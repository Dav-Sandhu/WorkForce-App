import express from 'express'
import cors from 'cors'
import { Connection, Request, TYPES } from 'tedious'
import { config } from 'dotenv'

const app = express()
config()

app.use(cors())

const queries = (type, values) => {
    switch(type){
      case "find-employee":
        return {
          query: `USE WorkForce; SELECT * FROM employee WHERE employee_number=@employee_number AND password=@password`,
          parameters: [
            { name: 'employee_number', type: TYPES.Int, value: parseInt(values[0]) },
            { name: 'password', type: TYPES.VarChar, value: values[1] }
          ]
        };
      case "picture":
        return {
          query: `USE WorkForce; SELECT picture FROM employee;`,
          parameters: []
        };
      default:
        return;
    }
  }

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
    
            request.on("error", function(err){console.log(err)})
            
            connection.execSql(request) 
        }
    })
})

app.listen(3000)