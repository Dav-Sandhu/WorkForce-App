const sql = require('mssql')

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
    min: 1,
    max: 4
  }
}

const pool = new sql.ConnectionPool(config)
pool.connect()

const db_query = async (query, params) => {
  return new Promise(async (resolve, reject) => {
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