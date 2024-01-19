const express = require('express')
const cors = require('cors')
const queries = require('./queries.js')

const { config } = require('dotenv')
const { db_query } = require('./database.js')

const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/authenticate', async (req, res) => {

  if (!req.body.data.type || !req.body.data.values){ return res.json({ status: -1 }) }

  const query = queries(req.body.data.type, req.body.data.values)
    
  const output = await db_query(query.query, query.parameters)

  if (output.length > 0){
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

app.post('/pictures', async (req, res) => {
  
  const query = queries('picture', null)

  const output = await db_query(query.query, query.parameters)
  res.json({ output, status: 1 })
})

app.post('/facematch', async (req, res) => {
    
  const query = queries('facematch', [req.body.data.picture])
  const output = await db_query(query.query, query.parameters)

  const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
  return res.json({ token, status: 1 })
})

app.get('/sql', authenticateToken, async (req, res) => {

  if (!req.query.query){ res.json({ status: -1 }) }
    
  const input = JSON.parse(req.query.query)
  const query = queries(input.type, input.values)

  const output = await db_query(query.query, query.parameters)

  res.json({ output, status: 1 })
})

app.use(express.static(path.resolve(__dirname, "client", "dist")))
app.use(express.static(path.resolve(__dirname, "client", "dist", "model")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(port)