const { pool } = require('../config/database')

class Product {
  // Get products with filters
  static async getAll(query = {}, options = {}) {
    try {
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
      const sortField = options.sortBy || 'id'
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

      console.log('Product.getAll SQL:', sql)
      console.log('Product.getAll params:', params)

      const [rows] = await pool.query(sql, params)
      console.log('Product.getAll rows length:', rows.length)

      return rows.map(row => {
        if (row.images && typeof row.images === 'string' && row.images.trim() !== '') {
          try {
            row.images = JSON.parse(row.images)
          } catch (e) {
            console.log('Error parsing images for product:', row.id, row.images, e.message)
            row.images = []
          }
        }
        return row
      })
    } catch (error) {
      console.error('Product.getAll error:', error)
      throw error
    }
  }

  // Count products
  static async count(query = {}) {
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

    // Add search
    if (query.$text) {
      sql += ` AND MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)`
      params.push(query.$text.$search)
    }

    const [rows] = await pool.query(sql, params)
    return rows[0].count
  }

  // Get product by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE id = ? AND is_active = true',
        [id]
      )
      if (rows.length === 0) return null
      const product = rows[0]
      if (product.images && typeof product.images === 'string' && product.images.trim() !== '') {
        try {
          product.images = JSON.parse(product.images)
        } catch (e) {
          product.images = []
        }
      }
      return product
    } catch (error) {
      throw new Error('Error fetching product: ' + error.message)
    }
  }

  // Get distinct categories
  static async getDistinct(field) {
    const [rows] = await pool.query(
      `SELECT DISTINCT ${field} FROM products WHERE is_active = 1`
    )
    return rows.map(row => row[field])
  }

  // Create new product
  static async create(productData) {
    try {
      const { 
        name, 
        description, 
        category, 
        price, 
        original_price, 
        discount, 
        icon = '🏛️', 
        material, 
        craftsmanship, 
        origin = 'Rajasthan, India', 
        weight, 
        dimensions, 
        care, 
        stock = 10, 
        is_featured = false, 
        is_active = true, 
        images = [],
        features = [],
        tags = [],
        seo_keywords = []
      } = productData
      
      const [result] = await pool.query(
        `INSERT INTO products (
          name, description, category, price, original_price, discount, 
          icon, material, craftsmanship, origin, weight, dimensions, care, 
          stock, is_featured, is_active, images, features, tags, seo_keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, 
          description, 
          category, 
          price, 
          original_price || null, 
          discount || null, 
          icon, 
          material || null, 
          craftsmanship || null, 
          origin, 
          weight || null, 
          dimensions || null, 
          care || null, 
          stock, 
          is_featured, 
          is_active, 
          JSON.stringify(images),
          JSON.stringify(features),
          JSON.stringify(tags),
          JSON.stringify(seo_keywords)
        ]
      )

      console.log('Product inserted with ID:', result.insertId)

      return { id: result.insertId, ...productData }
    } catch (error) {
      throw new Error('Error creating product: ' + error.message)
    }
  }

  // Update product
  static async updateById(id, updates, options = {}) {
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'images' || key === 'features' || key === 'tags' || key === 'seo_keywords') {
          fields.push(`${key} = ?`)
          values.push(JSON.stringify(updates[key]))
        } else {
          fields.push(`${key} = ?`)
          values.push(updates[key])
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
      return this.getById(id)
    }
  }

  // Update stock
  static async updateStock(id, quantity) {
    await pool.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [quantity, id]
    )
  }
}

module.exports = Product
