const { pool } = require('../config/database')

class Contact {
  // Get all contact submissions
  static async getAll(options = {}) {
    try {
      let sql = 'SELECT * FROM contacts ORDER BY created_at DESC'
      
      if (options.limit) {
        sql += ` LIMIT ${parseInt(options.limit)}`
      }
      
      const [rows] = await pool.query(sql)
      return rows
    } catch (error) {
      throw new Error('Error fetching contacts: ' + error.message)
    }
  }

  // Get contact by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      )
      return rows[0] || null
    } catch (error) {
      throw new Error('Error fetching contact: ' + error.message)
    }
  }

  // Create new contact submission
  static async create(contactData) {
    try {
      const { name, email, phone, subject, message } = contactData
      
      const [result] = await pool.query(
        'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, subject, message]
      )

      return { id: result.insertId, ...contactData, created_at: new Date() }
    } catch (error) {
      throw new Error('Error creating contact: ' + error.message)
    }
  }

  // Update contact status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.query(
        'UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      )

      if (result.affectedRows === 0) {
        throw new Error('Contact not found')
      }

      return true
    } catch (error) {
      throw new Error('Error updating contact: ' + error.message)
    }
  }

  // Delete contact
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM contacts WHERE id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
        throw new Error('Contact not found')
      }

      return true
    } catch (error) {
      throw new Error('Error deleting contact: ' + error.message)
    }
  }

  // Count contacts
  static async count(query = {}) {
    try {
      let sql = 'SELECT COUNT(*) as count FROM contacts'
      const params = []

      if (query.status) {
        sql += ' WHERE status = ?'
        params.push(query.status)
      }

      const [rows] = await pool.query(sql, params)
      return rows[0].count
    } catch (error) {
      throw new Error('Error counting contacts: ' + error.message)
    }
  }
}

module.exports = Contact
