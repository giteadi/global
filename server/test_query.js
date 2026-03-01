// Simple test for User.find method
const { pool } = require('./config/database')

const testSimpleQuery = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, status, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 0'
    )
    console.log('Simple query result:', rows)
    return rows
  } catch (error) {
    console.error('Simple query error:', error)
    throw error
  }
}

const testParameterizedQuery = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, status, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [10, 0]
    )
    console.log('Parameterized query result:', rows)
    return rows
  } catch (error) {
    console.error('Parameterized query error:', error)
    throw error
  }
}

module.exports = { testSimpleQuery, testParameterizedQuery }
