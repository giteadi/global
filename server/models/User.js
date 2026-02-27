const { pool } = require('../config/database')
// const bcrypt = require('bcryptjs')  // Removed for plain text passwords

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, phone, street, city, state, pincode, country } = userData

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, phone, street, city, state, pincode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone, street, city, state, pincode, country]
    )

    return { id: result.insertId, name, email, phone, role: 'user' }
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, phone, role, street, city, state, pincode, country, is_active, last_login FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, street, city, state, pincode, country, is_active, created_at FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  }

  // Update user by ID
  static async findByIdAndUpdate(id, updates) {
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`)
        values.push(updates[key])
      }
    })

    if (fields.length === 0) return null

    values.push(id)

    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    return this.findById(id)
  }

  // Update last login
  static async updateLastLogin(id) {
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [id]
    )
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE email = ?'
    const params = [email]

    if (excludeId) {
      query += ' AND id != ?'
      params.push(excludeId)
    }

    const [rows] = await pool.execute(query, params)
    return rows.length > 0
  }

  // Update reset token
  static async updateResetToken(id, token, expire) {
    await pool.execute(
      'UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?',
      [token, expire, id]
    )
  }
}

module.exports = User
