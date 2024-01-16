const { Connection, Request } = require('tedious')
const fs = require('fs')

const db_connect = () => {
    const connection = new Connection({
      server: process.env.SERVER,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.USER,
          password: process.env.PASSWORD 
        }
      },
      options: {
        database: process.env.DATABASE,
        port: parseInt(process.env.DBPORT),
        trustServerCertificate: true,
        encrypt: true
      }
    })
  
    return connection
}

const db_query = async (query, params) => {
    return new Promise((resolve, reject) => {
      const connection = db_connect()
      let output = []
  
      connection.connect(err => {
        if(!err){
          const request = new Request(query, err => {
            if (err) {
              console.log(err)
              reject(err)
            }
          })
  
          params.forEach(p => { request.addParameter(p.name, p.type, p.value) })
  
          request.on('row', function(columns){
            let result = {}
            columns.forEach(function(column){
              result[column.metadata.colName] = column.value
            })
            output.push(result)
          })
  
          request.on("requestCompleted", function(){ resolve(output) })
          request.on("error", function(err){ reject(err) })
  
          connection.execSql(request)
        } else {
          reject(err)
        }
      })
    })
  }

module.exports = {db_query}