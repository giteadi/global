const { pool } = require('../config/database')

class Product {
  // Find products with filters
  static async find(query = {}, options = {}) {
    let sql = `SELECT * FROM products WHERE is_active = 1`
    const params = []

    // Add filters
    if (query.category && query.category !== 'All') {
      sql += ` AND category = ?`
      params.push(query.category)
    }

    if (query.isFeatured !== undefined) {
      sql += ` AND is_featured = ?`
      params.push(query.isFeatured)
    }

    // Add search
    if (query.$text) {
      sql += ` AND MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)`
      params.push(query.$text.$search)
    }

    // Add sorting
    const sortField = options.sortBy || 'created_at'
    const sortOrder = options.sortOrder === 'asc' ? 'ASC' : 'DESC'
    sql += ` ORDER BY ${sortField} ${sortOrder}`

    // Add pagination
    if (options.limit) {
      sql += ` LIMIT ?`
      params.push(options.limit)
    }

    if (options.skip) {
      sql += ` OFFSET ?`
      params.push(options.skip)
    }

    const [rows] = await pool.execute(sql, params)
    return rows
  }

  // Count products
  static async countDocuments(query = {}) {
    let sql = `SELECT COUNT(*) as count FROM products WHERE is_active = 1`
    const params = []

    if (query.category && query.category !== 'All') {
      sql += ` AND category = ?`
      params.push(query.category)
    }

    if (query.isFeatured !== undefined) {
      sql += ` AND is_featured = ?`
      params.push(query.isFeatured)
    }

    const [rows] = await pool.execute(sql, params)
    return rows[0].count
  }

  // Find product by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [id]
    )
    return rows[0]
  }

  // Get distinct categories
  static async distinct(field) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT ${field} FROM products WHERE is_active = 1`
    )
    return rows.map(row => row[field])
  }

  // Create new product
  static async create(productData) {
    const fields = Object.keys(productData)
    const placeholders = fields.map(() => '?').join(', ')
    const values = fields.map(field => {
      const value = productData[field]
      // Handle JSON fields
      if (['images', 'features', 'tags', 'seo_keywords'].includes(field)) {
        return JSON.stringify(value || [])
      }
      return value
    })

    const [result] = await pool.execute(
      `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`,
      values
    )

    return { id: result.insertId, ...productData }
  }

  // Update product
  static async findByIdAndUpdate(id, updates, options = {}) {
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`)
        const value = updates[key]
        // Handle JSON fields
        if (['images', 'features', 'tags', 'seo_keywords'].includes(key)) {
          values.push(JSON.stringify(value || []))
        } else {
          values.push(value)
        }
      }
    })

    if (fields.length === 0) return null

    values.push(id)

    await pool.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    if (options.new !== false) {
      return this.findById(id)
    }
  }

  // Update stock
  static async updateStock(id, quantity) {
    await pool.execute(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [quantity, id]
    )
  }
}

module.exports = Product
