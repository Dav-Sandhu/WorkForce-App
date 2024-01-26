const express = require('express')
const cors = require('cors')
const queries = require('./queries.js')

const { config } = require('dotenv')
const { db_query } = require('./database.js')

const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const { loadModels, compareFaces } = require('./facerecognition.js')

config()

const { EmailClient } = require("@azure/communication-email")
const connectionString = `endpoint=${process.env.ENDPOINT};accesskey=${process.env.ACCESS_KEY}`
const client = new EmailClient(connectionString)

const app = express()

const port = process.env.PORT || 3000

function authenticateToken(req, res, next) {
  const token = req.headers.authorization

  if (token == null) return res.json({ status: -1 })
  
  jwt.verify(token, process.env.JWT_KEY, (err, output) => {
    if (err) return res.json({ status: -1 })

    req.output = output

    next()
  })
}

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.post('/login', async (req, res) => {

  try{
    const employee_number = req.body.data.employee_number
    const password = req.body.data.password

    const query = queries("find-employee", [employee_number, password])
    const output = await db_query(query.query, query.parameters)
  
    if (output.length > 0){
  
      const clockInQuery = queries("check-clocked-in", [employee_number])
      const clockIn = await db_query(clockInQuery.query, clockInQuery.parameters)
    
      if (clockIn.length > 0){
        output[0].clock_in = clockIn[0].clock_in
        output[0].clock_out = null
      }else{ 
        output[0].clock_in = null
        output[0].clock_out = null
      }
  
      const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
      return res.json({ token, status: 1 })
    }else{
      return res.json({ status: -1 })
    }
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.get('/getcustomers', authenticateToken, async (req, res) => {

  try{
    const query = queries('get-customers', [])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.get('/getjobs', authenticateToken , async (req, res) => {

  try{
    const query = queries('get-jobs', [])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output , status: 1  })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.get('/userinfo', authenticateToken, (req, res) => {
  return res.json({ output: req.output.output, status: 1 })
})

app.get('/getunfinishedprocesses', authenticateToken, async (req, res) => {

  try{
    const employee_number = req.query.query.employee_number

    const query = queries('get-unfinished-processes', [employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/startjob', async (req, res) => {

  try{
    const employee_number = req.body.data.employee_number
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

app.post('/finishjob', async (req, res) => {

  try{
    const employee_number = req.body.data.employee_number
    const process_type = req.body.data.process_type
    const business_name = req.body.data.business_name
    const contact_email = req.body.data.contact_email
    const start = req.body.data.start

    const finishJobQuery = queries('finish-process', [ employee_number, process_type, business_name, contact_email, start ])
    const output = await db_query(finishJobQuery.query, finishJobQuery.parameters)

    return res.json({ output, status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/deletejob', async (req, res) => {

  try{
    const employee_number = req.body.data.employee_number
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
    //const sendInfo = req.body.data.sendInfo
    const subject = req.body.data.subject
    const email = req.body.data.email
    const name = req.body.data.name

    const query = queries('email', [email])
    const output = await db_query(query.query, query.parameters)

    if (output.length > 0){
      
      const message = {
        senderAddress: process.env.SENDER_ADDRESS,
        content: { subject: subject, plainText: "Your password is " + output[0].password },
        recipients: { to: [{ address: email, displayName: name }] },
      }

      const poller = await client.beginSend(message)
      await poller.pollUntilDone()
    
      return res.json({ status: 1 })
    }
  
    return res.json({ status: -1 })
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
      ""
    ])
  
    const output = await db_query(query.query, query.parameters)
  
    if (output.length > 0){
  
      output[0].clock_in = null
      output[0].clock_out = null
      
      const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
      return res.json({ token, status: 1 })
    }else{
      
      return res.json({ status: -1 })
    }
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/update-password', async (req, res) => {

  try{
    const password = req.body.data.password
    const email = req.body.data.email

    const query = queries('update-password', [email, password])
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/clockin', async (req, res) => {

  try{
    const query = queries('clock-in', [req.body.data.employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/clockout', async (req, res) => {
  
  try{
    const query = queries('clock-out', [req.body.data.employee_number])
    await db_query(query.query, query.parameters)
  
    return res.json({ status: 1 })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/checkclockin', async (req, res) => {
  
  try{
    const query = queries('check-clocked-in', [req.body.data.employee_number])
    const output = await db_query(query.query, query.parameters)

    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/startbreak', async (req, res) => {
  
  try{
    const query = queries('start-time-off', [req.body.data.employee_number, req.body.data.break_type])
    const output = await db_query(query.query, query.parameters)

    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/endbreak', async (req, res) => {

  try{
    const query = queries('finish-time-off', [req.body.data.employee_number, req.body.data.start])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }
})

app.post('/deletebreak', async (req, res) => {
  try{

    const employee_number = req.body.data.employee_number
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
    const query = queries('get-timeoff', [req.query.query.employee_number])
    const output = await db_query(query.query, query.parameters)
  
    return res.json({ status: 1, output })
  }catch(error){
    return res.json({ status: -1, error })
  }

})

app.post('/updateToken', async (req, res) => {

  try{
    // Get the new data from the request
    const newData = req.body.data

    // Create a new token with the updated data
    const token = jwt.sign({ output: [newData] }, process.env.JWT_KEY, { expiresIn: '1h' })

    // Send the new token back to the client
    return res.json({ token, status: 1 })
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
      const token = jwt.sign({ output: [output] }, process.env.JWT_KEY, { expiresIn: '1h' })
      return res.json({ token, status: 1 })
    }
  
    return res.json({ status: -1 })
  }catch(error){
    return res.json({ status: -1, error })
  }

})

//app.use(express.static(path.resolve(__dirname, "models")))
app.use(express.static(path.resolve(__dirname, "client", "dist")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(port)