const express = require('express')
const cors = require('cors')
const queries = require('./queries.js')
const compression = require('compression')

require('dotenv').config()
const { db_query } = require('./database.js')

const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const { loadModels, compareFaces } = require('./facerecognition.js')

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")

const { EmailClient } = require("@azure/communication-email")

const app = express()

//if the port is not defined in the environment variables, it will default to 3000
const port = process.env.PORT || 3000

//for checking to see if the token is valid
function authenticateToken(req, res, next) {
  const token = req.headers.authorization

  if (token == null) return res.json({ status: -1, error: 'token is NULL' })
  
  jwt.verify(token, process.env.JWT_KEY, (err, output) => {
    if (err) return res.json({ status: -1, error: 'token authentication failed.' })

    req.output = output

    next()
  })
}

//middleware for compression and parsing the body of the request as well as allowing cross origin requests
app.use(cors())
app.use(compression())
//limits the maximum size of the request to 10mb due to the images
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

//for logging in the user
app.post('/login', async (req, res) => {

  //every request is wrapped in a try and catch to ensure that the server does not crash
  try{
    const email = req.body.data.email
    const password = req.body.data.password

    //makes sure the employee is in the database
    const query = queries("find-employee-by-email", [email, password]) //queries is for formatting the query with the parameters
    const output = await db_query(query.query, query.parameters) //db_query is for executing the queries
  
    if (output.length > 0){
  
      const clockInQuery = queries("check-clocked-in-by-email", [email])
      const clockIn = await db_query(clockInQuery.query, clockInQuery.parameters)
    
      //adds the clockin information to the output
      if (clockIn.length > 0){
        output[0].clock_in = clockIn[0].clock_in
        output[0].clock_out = null
      }else{ 
        output[0].clock_in = null
        output[0].clock_out = null
      }
  
      //creates a token with the employee's profile
      const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '24h' })
      return res.json({ token, status: 1 }) //a status flag is added to every response to indicate if the request was successful or not
    }else{
      //if the employee is not in the database, it will return an error
      return res.json({ status: -1, error: 'employee does not exist' })
    }
  }catch(error){
    return res.json({ status: -1, error })
  }
})

//all get requests need to be authenticated
app.get('/getcustomers', authenticateToken, async (req, res) => {

  try{
    const query = queries('get-customers', [])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/addcustomer', authenticateToken, async (req, res) => {

  try{
    const business_name = req.body.data.business_name
    const contact_email = req.body.data.contact_email
    const contact_name = req.body.data.contact_name
    const currency = req.body.data.currency
    const logo = req.body.data.logo


    const query = queries('add-customer', [
      business_name,
      currency,
      contact_name,
      contact_email,
      logo
    ])
  
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/deletecustomer', authenticateToken, async (req, res) => {
    
    try{
      const business_name = req.body.data.business_name
      const contact_email = req.body.data.contact_email
    
      const query = queries('delete-customer', [business_name, contact_email])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.get('/getinternalprocesses' , authenticateToken, async (req, res) => {
  
    try{
      const query = queries('get-internal-processes', [])
      const output = await db_query(query.query, query.parameters)
    
      return res.json({ output, status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/addinternalprocess', authenticateToken, async (req, res) => {

      try{
        const process_type = req.body.data.process_type
        const billable = req.body.data.billable
        const hourly_rate = req.body.data.hourly_rate
    
        const query = queries('add-internal-process', [process_type, billable, hourly_rate])
        await db_query(query.query, query.parameters)
      
        return res.json({ status: 1 })
      }catch(error){
        return res.json({ status: -1, error })
      }
})

app.post('/deleteinternalprocess', authenticateToken, async (req, res) => {
    
    try{
      const process_type = req.body.data.process_type
  
      const query = queries('delete-internal-process', [process_type])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.get('/getjobs', authenticateToken , async (req, res) => {

  try{
    const query = queries('get-jobs', [req.query.query.employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output , status: 1  })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/assignjob', authenticateToken, async (req, res) => {
  
    try{
      const employee_number = req.body.data.employee_number
      const process_type = req.body.data.process_type

      const checkQuery = queries('check-assign-job', [employee_number, process_type])
      const checkOutput = await db_query(checkQuery.query, checkQuery.parameters)

      if (checkOutput.length > 0){
        return res.json({ status: -1, error: 'job already assigned' })
      }
  
      const query = queries('assign-job', [employee_number, process_type])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/requestjob', authenticateToken, async (req, res) => {
    
    try{
      const employee_number = req.body.data.employee_number
  
      const query = queries('request-job', [employee_number])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/deletejobrequest', authenticateToken, async (req, res) => {
      
      try{
    
        const query = queries('delete-job-request', [req.body.data.employee_number])
        await db_query(query.query, query.parameters)

        return res.json({ status: 1 })
      }catch(error){
        return res.json({ status: -1, error })
      }
})

app.get('/getrequests', authenticateToken, async (req, res) => {
    
    try{
      const query = queries('get-requests', [])
      const output = await db_query(query.query, query.parameters)

      return res.json({ output, status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.get('/userinfo', authenticateToken, (req, res) => {
  return res.json({ output: req.output.output, status: 1 })
})

app.get('/getunfinishedprocesses', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.output.output[0].employee_number

    const query = queries('get-unfinished-processes', [employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/startjob', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.output.output[0].employee_number
    const process_type = req.body.data.process_type
    const business_name = req.body.data.business_name
    const contact_email = req.body.data.contact_email

    const startJobQuery = queries('start-process', [ employee_number, process_type, business_name, contact_email ])
    const output = await db_query(startJobQuery.query, startJobQuery.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/finishjob', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.output.output[0].employee_number
    const process_type = req.body.data.process_type
    const business_name = req.body.data.business_name
    const contact_email = req.body.data.contact_email
    const start = req.body.data.start

    const finishJobQuery = queries('finish-process', [ employee_number, process_type, business_name, contact_email, start ])
    const output = await db_query(finishJobQuery.query, finishJobQuery.parameters)

    const query = queries('delete-assigned-job', [employee_number, process_type])
    await db_query(query.query, query.parameters)

    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/deletejob', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.output.output[0].employee_number
    const process_type = req.body.data.process_type
    const business_name = req.body.data.business_name
    const contact_email = req.body.data.contact_email
    const start = req.body.data.start

    const query = queries('delete-process', [ employee_number, process_type, business_name, contact_email, start ])
    await db_query(query.query, query.parameters)

    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/upload-image', authenticateToken, async (req, res) => {

  try{

    const employee_number = req.output.output[0].employee_number
    const token = req.body.data.token
    const name = req.output.output[0].first_name + '-' + req.output.output[0].last_name + '-' + employee_number + '.jpg'
    const file = req.body.data.image
    const image = Buffer.from(file.split(';base64,').pop(), 'base64') //converts the image file into a buffer for the azure storage

    const endpointsProtocol = process.env.DEFAULT_ENDPOINTS_PROTOCOL
    const endpointsSuffix = process.env.ENDPOINT_SUFFIX

    const account = process.env.ACCOUNT_NAME
    const accountKey = process.env.ACCOUNT_KEY

    const container = process.env.CONTAINER_NAME

    //creates a new client for the azure storage
    const credentials = new StorageSharedKeyCredential(account, accountKey)
    const serviceClient = new BlobServiceClient(`${endpointsProtocol}://${account}.blob.${endpointsSuffix}`, credentials)

    //creates a new container client and a new block blob client
    const containerClient = serviceClient.getContainerClient(container)
    const blockBlobClient = containerClient.getBlockBlobClient(name)

    //uploads the image to the azure storage
    await blockBlobClient.upload(image, image.length, {
      blobHTTPHeaders: {
        blobContentType: 'image/jpeg'
      },
    })

    //returns the url of the image after it is uploaded to azure storage
    const picture = process.env.PICTURE_LOCATION + name

    //updates the employee's profile picture in the database with the new url
    const query = queries('update-picture', [employee_number, picture])
    await db_query(query.query, query.parameters)

    jwt.verify(token, process.env.JWT_KEY, (err, output) => {
      if (err) return res.json({ status: -1, error: err })
  
      const profile = output.output[0]
      profile.picture = picture

      const token = jwt.sign({ output: [profile] }, process.env.JWT_KEY, { expiresIn: '24h' })

      return res.json({ status: 1, token })
    })

  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.get('/getemployees', authenticateToken, async (req, res) => {

  try{
    const query = queries('get-employees', [])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  
  }
})

app.post('/upgradeuser', authenticateToken, async (req, res) => {
  
    try{
      const employee_number = req.body.data.employee_number
  
      const query = queries('upgrade-user', [employee_number])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/downgradeuser', authenticateToken, async (req, res) => {
    
    try{
      const employee_number = req.body.data.employee_number
  
      const query = queries('downgrade-user', [employee_number])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/updatebreaktimes', authenticateToken, async (req, res) => {
    
    try{
      const employee_number = req.body.data.employee_number
      const break_time = req.body.data.break_time
      const lunch_time = req.body.data.lunch_time
  
      const query = queries('update-break-times', [employee_number, break_time, lunch_time])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/checkpassword', async (req, res) => {

  try{

    const first_name = req.body.data.name.split(' ')[0]
    const last_name = req.body.data.name.split(' ')[1]

    const query = queries('check-password', [first_name, last_name, req.body.data.password])
    const output = await db_query(query.query, query.parameters)

    return res.json({ status: 1, output: output.length > 0 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/updateadpnumber', authenticateToken, async (req, res) => {
      
    try{
      const employee_number = req.body.data.employee_number
      const adp_number = req.body.data.adp_number
  
      const query = queries('update-adp-number', [employee_number, adp_number])
      await db_query(query.query, query.parameters)
    
      return res.json({ status: 1 })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/removeemployee', authenticateToken, async (req, res) => {
  
  try{
    const employee_number = req.body.data.employee_number
    const imageName = req.body.data.first_name + '-' + req.body.data.last_name + '-' + employee_number + '.jpg'

    const query = queries('delete-employee', [employee_number])
    await db_query(query.query, query.parameters)

    try{
      const connectionString = 'DefaultEndpointsProtocol=' + process.env.DEFAULT_ENDPOINTS_PROTOCOL + 
      ';AccountName=' + process.env.ACCOUNT_NAME + ';AccountKey=' + process.env.ACCOUNT_KEY + 
      ';EndpointSuffix=' + process.env.ENDPOINT_SUFFIX
  
      const container = process.env.CONTAINER_NAME

      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      const containerClient = blobServiceClient.getContainerClient(container)
      const blobClient = containerClient.getBlobClient(imageName)

      await blobClient.delete()
    }catch(error){
      console.log('profile picture does not exist')
    }
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/checkemployee', async (req, res) => {
  
  try{
    const query = queries('email', [req.body.data.email])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ found: output.length === 0, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/sendemail', async (req, res) => {

  try{
    const subject = req.body.data.subject
    const email = req.body.data.email
    const name = req.body.data.name

    const connectionString = `endpoint=${process.env.ENDPOINT};accesskey=${process.env.ACCESS_KEY}`
    const client = new EmailClient(connectionString)

    const query = queries('email', [email])
    const output = await db_query(query.query, query.parameters)

    if (output.length > 0){
      
      //formats the email to be sent to the user
      const message = {
        senderAddress: process.env.SENDER_ADDRESS,
        content: { subject: subject, plainText: "Your password is " + output[0].password },
        recipients: { to: [{ address: email, displayName: name }] },
      }

      //sends the email to the user
      const poller = await client.beginSend(message)
      await poller.pollUntilDone()
    
      return res.json({ status: 1 })
    }
  
    return res.json({ status: -1 , error: 'email is not in database' })
  }catch(error){
    return res.json({ status: -1, error })
  }

})

app.post('/registeremployee', async (req, res) => {
    
  try{
    let query = queries('generate-employee-number', [])

    const num = await db_query(query.query, query.parameters)
    const generatedEmployeeNumber = num[0].rn
    
    const state = req.body.data
  
    query = queries('add-employee', [
      state.first_name,
      state.last_name,
      generatedEmployeeNumber,
      state.email,
      state.password,
      0.0,
      "",
      0,
      0
    ])
  
    const output = await db_query(query.query, query.parameters)
  
    if (output.length > 0){
  
      output[0].clock_in = null
      output[0].clock_out = null
      
      const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '24h' })
      return res.json({ token, status: 1 })
    }else{
      
      return res.json({ status: -1, error: 'output is empty' })
    }
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/clockin', authenticateToken, async (req, res) => {

  try{

    const output = req.output.output[0]

    const query = queries('clock-in', [output.employee_number])
    const queryOutput = await db_query(query.query, query.parameters)

    const token = jwt.sign({ output: [{ ...output, clock_in: queryOutput[0].clock_in }] }, process.env.JWT_KEY, { expiresIn: '24h' })
  
    return res.json({ status: 1, token })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/clockout', authenticateToken, async (req, res) => {
  
  try{
    const query = queries('clock-out', [req.output.output[0].employee_number])
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/checkclockin', authenticateToken, async (req, res) => {
  
  try{
    const query = queries('check-clocked-in', [req.output.output[0].employee_number])
    const output = await db_query(query.query, query.parameters)

    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

//used by admin to get the daily reports for all the employees
app.get('/getreport', authenticateToken, async (req, res) => {

  try{

    let output = {}
    let selectedOutput = []

    const start = req.query.query.start
    const finish = req.query.query.finish
    const selectedTable = req.query.query.selectedTable

    const employeeQuery = queries('get-all-employees', [])
    const employeeOutput = await db_query(employeeQuery.query, employeeQuery.parameters)

    if(selectedTable === 'clocks'){
      const clockQuery = queries('get-clocks-range', [start, finish])
      selectedOutput = await db_query(clockQuery.query, clockQuery.parameters)
    }else if(selectedTable === 'employees'){
      const workQuery = queries('get-work-range', [start, finish])
      selectedOutput = await db_query(workQuery.query, workQuery.parameters)
    }else if(selectedTable === 'breaks'){
      const breakQuery = queries('get-time-off-range', [start, finish])
      selectedOutput = await db_query(breakQuery.query, breakQuery.parameters)
    }else if (selectedTable === 'customers' || selectedTable === 'employeebycustomer'){
      const workQuery = queries('get-work-range', [start, finish])
      selectedOutput = await db_query(workQuery.query, workQuery.parameters)

      const internalProcessQuery = queries('get-internal-processes', [])
      const internalProcessOutput = await db_query(internalProcessQuery.query, internalProcessQuery.parameters)

      const mergedOutput = {}

      internalProcessOutput.forEach(p => {
        mergedOutput[p.process_type] = p
        mergedOutput[p.process_type].totalWork = 0
      })

      output.work = []

      const customersQuery = queries('get-customers', [])
      const customersOutput = await db_query(customersQuery.query, customersQuery.parameters)
      const businessNames = customersOutput.map(customer => customer.business_name)

      output['headings'] = ['hours by activity', ...businessNames, 'total hours', 'hourly rate', 'total revenue']

      if(selectedTable === 'customers'){
      
        selectedOutput.forEach(w => {
          const startTime = new Date(w.start)
          const finishTime = w.finish !== null ? new Date(w.finish) : 0
          const seconds = w.finish !== null ? (finishTime.getTime() - startTime.getTime()) / 1000 : 0
  
          output.work.push({ time: seconds, process_type: w.process_type, business_name: w.business_name })
          mergedOutput[w.process_type].totalWork += seconds
        })
  
        output['data'] = mergedOutput
        
        return res.json({ status: 1, output })
      }else if (selectedTable === 'employeebycustomer'){

        employeeOutput.forEach(e => {

          output[e.employee_number] = e
          output[e.employee_number].work = []

          const dataOutput = JSON.parse(JSON.stringify(mergedOutput))
          const matchingWork = selectedOutput.filter(w => w.employee_number === e.employee_number)

          matchingWork.forEach(w => {
            const startTime = new Date(w.start)
            const finishTime = w.finish !== null ? new Date(w.finish) : 0
            const seconds = w.finish !== null ? (finishTime.getTime() - startTime.getTime()) / 1000 : 0

            output[e.employee_number].work.push({ time: seconds, process_type: w.process_type, business_name: w.business_name })
            dataOutput[w.process_type].totalWork += seconds
          })

          output[e.employee_number].data = dataOutput
        })

        return res.json({ status: 1, output })
      }
    }


    for (const e in employeeOutput){

      const employee = employeeOutput[e]
      const employee_number = employee.employee_number

      const select = selectedOutput.filter(o => o.employee_number === employee_number)

      output[employee_number] = employee
      output[employee_number].values = select || []
    }

    if (selectedTable === 'employees'){
      Object.values(output).forEach(o => {
        o.values.sort((a, b) => {
          if (a.start < b.start){
            return -1
          }else if (a.start > b.start){
            return 1
          }
          return 0
        })
      })

      const customersQuery = queries('get-customers', [])
      const customersOutput = await db_query(customersQuery.query, customersQuery.parameters)
      const businessNames = customersOutput.map(customer => customer.business_name)
  
      output['headings'] = ['employee', ...businessNames, 'total'] 
    }

    return res.json({ status: 1, output })

  }catch(error){
    console.log(error)
    return res.json({ status: -1, error })
  }
})

app.post('/startbreak', authenticateToken, async (req, res) => {
  
  try{
    const query = queries('start-time-off', [req.output.output[0].employee_number, req.body.data.break_type])
    const output = await db_query(query.query, query.parameters)

    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/autoendbreak', authenticateToken, async (req, res) => {
    
    try{

      let finishBreak = false
      const seconds = req.body.data.seconds

      const onTimeOffQuery = queries('get-timeoff', [req.output.output[0].employee_number])
      const onTimeOffOutput = await db_query(onTimeOffQuery.query, onTimeOffQuery.parameters)

      if (onTimeOffOutput.length > 0){
        const startTime = new Date(onTimeOffOutput[0].start)
        const endTime = new Date(startTime.getTime() + seconds * 1000)

        finishBreak = new Date() > endTime
      }

      if (finishBreak){
        const query = queries('auto-time-off-finish', [req.output.output[0].employee_number, seconds])
        await db_query(query.query, query.parameters)
      }

      return res.json({ status: 1, finishBreak })
    }catch(error){
      return res.json({ status: -1, error })
    }
})

app.post('/endbreak', authenticateToken, async (req, res) => {

  try{
    const query = queries('finish-time-off', [req.output.output[0].employee_number, req.body.data.start])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/deletebreak', authenticateToken, async (req, res) => {
  try{

    const employee_number = req.output.output[0].employee_number
    const break_type = req.body.data.break_type
    const start = req.body.data.start

    const query = queries('delete-time-off', [employee_number, break_type, start])
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.get('/getbreaks', authenticateToken, async (req, res) => {

  try{
    const query = queries('get-timeoff', [req.output.output[0].employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }

})

app.post('/updateemployeewage', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.body.data.employee_number
    const hourly_wage = req.body.data.hourly_wage

    const query = queries('update-employee-wage', [employee_number, hourly_wage])
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/facematch', async (req, res) => {

  try{
    const image = req.body.data.image
    let matches = false
    let match_num = 0
    let closest = 1
  
    //gets the images from the database
    const query = queries('picture', null)
    const images_list = await db_query(query.query, query.parameters)
  
    //loads the models
    await loadModels(path)
  
    //iterates through the images list
    for (let i = 0;i < images_list.length;i++){

      //extra try and catch to ensure that broken images do not crash the server
      try{

        /*
        compares the images and returns a number, the smaller the number is the more the two faces are alike
        if the number is smaller than 0.6 there is a high likelyhood that the two faces belong to the same person,
        but as it is imperfect, sometimes it can be wrong which is why there exists a closest value to return only
        the one match that gave the smallest value.
        */
        let match = await compareFaces(image, images_list[i].picture)
        matches = (match < 0.6) ? true : matches
        match_num = (match < closest) ? i : match_num
        closest = (match < closest) ? match : closest
      }catch(err){
        continue;
      }
    }
      
    if (matches){
      //returns the matched face's profile
      const getMatchedFace = queries('facematch', [images_list[match_num].picture])
      const faceProfile = await db_query(getMatchedFace.query, getMatchedFace.parameters)
  
      const output = {...faceProfile[0]}
  
      const getClockIn = queries('check-clocked-in', [faceProfile[0].employee_number])
      const clockIn = await db_query(getClockIn.query, getClockIn.parameters)
      
      if (clockIn.length > 0){
        output.clock_in = clockIn[0].clock_in
        output.clock_out = null
      }else{
        output.clock_in = null
        output.clock_out = null
      }
  
      //creates a token with the matched face's profile
      const token = jwt.sign({ output: [output] }, process.env.JWT_KEY, { expiresIn: '24h' })
      return res.json({ token, status: 1, name: output.first_name + " " + output.last_name })
    }
  
    return res.json({ status: -1, error: 'no match found' })
  }catch(error){
    return res.json({ status: -1, error })
  }

})

//app.use(express.static(path.resolve(__dirname, "models")))
app.use(express.static(path.resolve(__dirname, "client", "dist")))

//serves the index.html file from the client/dist folder
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(port)