const express = require('express')
const cors = require('cors')
const queries = require('./queries.js')

const { config } = require('dotenv')
const { db_query } = require('./database.js')

const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

config()

const app = express()

const port = process.env.PORT || 3000

function authenticateToken(req, res, next) {
  const token = req.headers.authorization

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_KEY, (err, output) => {
    if (err) return res.sendStatus(403)

    req.output = output
    next()
  })
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/authenticate', (req, res) => {

  if (!req.body.data.type || !req.body.data.values){ return res.send("No Data!") }

  const query = queries(req.body.data.type, req.body.data.values)

  const request = async () => {
    const output = await db_query(query.query, query.parameters)

    if (output.length > 0){
      const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
      return res.json({ token })
    }else{
      res.send(null)
    }
  }

  request()
})

app.get('/userinfo', authenticateToken, (req, res) => {
  res.json(req.output.output)
})

app.post('/pictures', (req, res) => {
  const query = queries('picture', null)

  const request = async () => {
    const output = await db_query(query.query, query.parameters)
    res.json(output)
  }

  request()
})

app.post('/facematch', (req, res) => {

  const request = async () => {
    const query = queries('facematch', [req.body.data.picture])
    const output = await db_query(query.query, query.parameters)
    
    const token = jwt.sign({ output }, process.env.JWT_KEY, { expiresIn: '1h' })
    return res.json({ token })
  }

  request()
})

app.get('/sql', authenticateToken, (req, res) => {

  if (!req.query.query){ res.send("No Data!") }
    
  const input = JSON.parse(req.query.query)
  const query = queries(input.type, input.values)

  return db_query(query.query, query.parameters)

})

app.use(express.static(path.resolve(__dirname, "client", "dist")))
app.use(express.static(path.resolve(__dirname, "client", "dist", "model")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.listen(port)