const { pool } = require('../config/database')

class Product {
  // Find products with filters
  static async find(query = {}, options = {}) {
    let sql = `SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.is_active = 1`
    const params = []

    // Add filters
    if (query.category && query.category !== 'All') {
      sql += ` AND c.name = ?`
      params.push(query.category)
    }

    if (query.isFeatured !== undefined) {
      sql += ` AND p.is_featured = ?`
      params.push(query.isFeatured)
    }

    // Add search
    if (query.$text) {
      sql += ` AND MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)`
      params.push(query.$text.$search)
    }

    // Add sorting
    const sortField = `p.${options.sortBy || 'created_at'}`
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

    const [rows] = await pool.query(sql, params)
    return rows
  }

  // Count products
  static async countDocuments(query = {}) {
    let sql = `SELECT COUNT(*) as count FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.is_active = 1`
    const params = []

    if (query.category && query.category !== 'All') {
      sql += ` AND c.name = ?`
      params.push(query.category)
    }

    if (query.isFeatured !== undefined) {
      sql += ` AND p.is_featured = ?`
      params.push(query.isFeatured)
    }

    // Add search
    if (query.$text) {
      sql += ` AND MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)`
      params.push(query.$text.$search)
    }

    const [rows] = await pool.query(sql, params)
    return rows[0].count
  }

  // Find product by ID
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.id = ? AND p.is_active = 1',
      [id]
    )
    return rows[0]
  }

  // Get distinct categories
  static async distinct(field) {
    if (field === 'category') {
      const [rows] = await pool.query(
        `SELECT DISTINCT c.name FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.is_active = 1`
      )
      return rows.map(row => row.name)
    }
    const [rows] = await pool.query(
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

    const [result] = await pool.query(
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

    await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    if (options.new !== false) {
      return this.findById(id)
    }
  }

  // Update stock
  static async updateStock(id, quantity) {
    await pool.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [quantity, id]
    )
  }

  // Count products
  static async countDocuments(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM products'
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
}

module.exports = Product
