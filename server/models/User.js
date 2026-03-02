const { pool } = require('../config/database')
// const bcrypt = require('bcryptjs')  // Removed for plain text passwords

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, phone, street, city, state, pincode, country, role = 'customer' } = userData

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, street, city, state, pincode, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone, street, city, state, pincode, country, role]
    )

    return { id: result.insertId, name, email, phone, role }
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, role, status, street, city, state, pincode, country, is_active, last_login, created_at FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, status, street, city, state, pincode, country, is_active, created_at FROM users WHERE id = ?',
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

    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    return this.findById(id)
  }

  // Update last login
  static async updateLastLogin(id) {
    await pool.query(
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

    const [rows] = await pool.query(query, params)
    return rows.length > 0
  }

  // Update reset token
  static async updateResetToken(id, token, expire) {
    await pool.query(
      'UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?',
      [token, expire, id]
    )
  }

  // Get all users with pagination and filtering (Admin)
  static async find(options = {}) {
    try {
      const { limit = 10, skip = 0, sort = 'created_at', order = 'desc', ...filters } = options
      
      // Validate sort field to prevent SQL injection
      const allowedSortFields = ['id', 'name', 'email', 'role', 'status', 'is_active', 'created_at']
      const validSort = allowedSortFields.includes(sort) ? sort : 'created_at'
      const validOrder = order === 'asc' ? 'ASC' : 'DESC'
      
      let query = 'SELECT id, name, email, phone, role, status, is_active, created_at, password FROM users'
      const params = []
      
      // Add filters
      const filterClauses = []
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          filterClauses.push(`${key} = ?`)
          params.push(filters[key])
        }
      })
      
      if (filterClauses.length > 0) {
        query += ' WHERE ' + filterClauses.join(' AND ')
      }
      
      // Add sorting
      query += ` ORDER BY ${validSort} ${validOrder}`
      
      // Add pagination without parameterized values for MySQL compatibility
      const limitNum = parseInt(limit) || 10
      const skipNum = parseInt(skip) || 0
      query += ` LIMIT ${limitNum} OFFSET ${skipNum}`
      
      console.log('Query:', query)
      console.log('Params:', params)
      
      const [rows] = await pool.query(query, params)
      return rows
    } catch (error) {
      console.error('User.find error:', error)
      throw error
    }
  }

  // Count users with filters (Admin)
  static async countDocuments(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM users'
    const params = []
    
    const filterClauses = []
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        filterClauses.push(`${key} = ?`)
        params.push(filters[key])
      }
    })
    
    if (filterClauses.length > 0) {
      query += ' WHERE ' + filterClauses.join(' AND ')
    }
    
    const [rows] = await pool.query(query, params)
    return rows[0].count
  }

  // Get user order count
  static async getOrderCount(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [userId]
    )
    return rows[0].count
  }

  // Get users with order counts (Admin dashboard)
  static async getUsersWithOrderCount(options = {}) {
    const { limit = 10, skip = 0, sort = 'created_at', order = 'desc' } = options
    
    const query = `
      SELECT u.id, u.name, u.email, u.role, u.status, u.is_active, u.created_at,
             COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.${sort} ${order}
      LIMIT ? OFFSET ?
    `
    
    const [rows] = await pool.query(query, [limit, skip])
    return rows
  }
}

module.exports = User
