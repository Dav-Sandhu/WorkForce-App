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

  const employee_number = req.body.data.employee_number
  const password = req.body.data.password

  const query = queries("find-employee", [employee_number, password])
  const output = await db_query(query.query, query.parameters)

  if (output.length > 0){

    const clockInQuery = queries("check-clocked-in", [employee_number])
    const clockIn = await db_query(clockInQuery.query, clockInQuery.parameters)
  
    if (clockIn.length > 0){
      output[0].clock_in = clockIn[0].clock_in
      output[0].clock_out = clockIn[0].clock_out || null
    }else{ 
      output[0].clock_in = null
      output[0].clock_out = null
    }

    const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
    return res.json({ token, status: 1 })
  }else{
    res.json({ status: -1 })
  }
})

app.get('/userinfo', authenticateToken, (req, res) => {

  res.json({ output: req.output.output, status: 1 })
})

app.post('/checkemployee', async (req, res) => {
  
    const query = queries('email', [req.body.data.email])
    const output = await db_query(query.query, query.parameters)
   
    res.json({ found: output.length === 0, status: 1 })
})

app.post('/sendemail', async (req, res) => {
  
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
  
  res.json({ status: -1 })

})

app.post('/registeremployee', async (req, res) => {
    
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
    
    res.json({ status: -1 })
  }
})

app.post('/update-password', async (req, res) => {
  const password = req.body.data.password
  const email = req.body.data.email

  const query = queries(email, password)
  await db_query(query.query, query.parameters)

  res.json({ status: 1 })
})

app.post('/clockin', async (req, res) => {

  const query = queries('clock-in', [req.body.data.employee_number])
  const output = await db_query(query.query, query.parameters)

  res.json({ status: 1, output })
})

app.post('/clockout', async (req, res) => {
  
    const query = queries('clock-out', [req.body.data.employee_number])
    const output = await db_query(query.query, query.parameters)
  
    res.json({ status: 1, output })
})

app.post('/checkclockin', async (req, res) => {
    const query = queries('check-clocked-in', [req.body.data.employee_number])
    const output = await db_query(query.query, query.parameters)

    res.json({ status: 1, output })
})

app.post('/updateToken', async (req, res) => {
  // Get the new data from the request
  const newData = req.body.data

  // Create a new token with the updated data
  const token = jwt.sign({ output: [newData] }, process.env.JWT_KEY, { expiresIn: '1h' })

  // Send the new token back to the client
  res.json({ token, status: 1 })
})

app.post('/facematch', async (req, res) => {
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
      output.clock_out = clockIn[0].clock_out || null
    }else{
      output.clock_in = null
      output.clock_out = null
    }

    //creates a token with the matched face's profile
    const token = jwt.sign({ output: [output] }, process.env.JWT_KEY, { expiresIn: '1h' })
    return res.json({ token, status: 1 })
  }

  res.json({ status: -1 })

})

//app.use(express.static(path.resolve(__dirname, "models")))
app.use(express.static(path.resolve(__dirname, "client", "dist")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(port)