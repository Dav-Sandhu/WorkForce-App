import express from 'express'
import cors from 'cors'
import queries from './queries.js'

import { Connection, Request } from 'tedious'
import { config } from 'dotenv'

const app = express()
config()

app.use(cors())

app.get('/sql', (req, res) => {
    
  const input = JSON.parse(req.query.query)
  const query = queries(input.type, input.values)

  let output = []

  const connection = new Connection({
    server: process.env.domain,
    authentication: {
      type: 'default',
      options: {
        userName: process.env.USER,
        password: process.env.PASSWORD 
      }
    },
    options: {
      database: process.env.DATABASE,
      port: parseInt(process.env.PORT),
      trustServerCertificate: true,
      encrypt: true
    }
  })
  
  connection.connect(err => {
    if(!err){
      const request = new Request(query.query, err => {
        err ? console.log(err) : ""
      })

      //adds the parameters to the request separately to prevent sql injection
      query.parameters.forEach(p => {
        request.addParameter(p.name, p.type, p.value)
      })

    request.on('row', function(columns){ 
      let result = {}

      columns.forEach(function(column){
        result[column.metadata.colName] = column.value
      }) 

      output.push(result)
    })  
          
    request.on("requestCompleted", function(){
      res.send(output)
      connection.close()
    })

    request.on("error", function(err){
      res.send(output)
      console.log(err)
    })
      
    connection.execSql(request) 
  }
  })
})

app.listen(3000)