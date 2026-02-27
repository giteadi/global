const mysql = require('mysql2/promise')

// Create connection pool
const pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'global',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('MySQL database connected successfully')
    connection.release()
  } catch (error) {
    console.error('MySQL database connection error:', error)
    process.exit(1)
  }
}

module.exports = {
  pool,
  testConnection
}
