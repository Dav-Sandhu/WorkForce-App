import express from 'express'
import cors from 'cors'
import { Connection, Request } from 'tedious'
import { config } from 'dotenv'

const app = express()
config()

app.use(cors())

app.get('/sql', (req, res) => {
    
    const query = req.query.query
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
            const request = new Request(query, err => {
                err ? console.log(err) : ""
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