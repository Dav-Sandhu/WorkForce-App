const sql = require('mssql')

//gets the information required for authenticating the server and connecting to the database
const config = {
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
    encrypt: true
  },
  pool: {
    min: 1, //minimum number of connections
    max: 4 //maximum number of connections
  }
}

//creates a new connection pool which will stay open until the app is closed
const pool = new sql.ConnectionPool(config)
pool.connect()

//main method for interacting with the database
const db_query = async (query, params) => {
  return new Promise(async (resolve, reject) => {

    //will attempt to execute the query with the given parameters and return the result
    try{
      const request = pool.request()

      params.forEach(p => { request.input(p.name, p.type, p.value) })

      const result = await request.query(query)
      resolve(result.recordset)
    }catch(err) {
      reject(err)
    }
  })
}

module.exports = { db_query }