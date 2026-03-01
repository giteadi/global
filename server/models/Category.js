const { pool } = require('../config/database')

class Category {
  // Get all categories
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM categories WHERE is_active = true ORDER BY name ASC'
      )
      return rows
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message)
    }
  }

  // Get category by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM categories WHERE id = ? AND is_active = true',
        [id]
      )
      return rows[0] || null
    } catch (error) {
      throw new Error('Error fetching category: ' + error.message)
    }
  }

  // Create new category
  static async create(categoryData) {
    try {
      const { name, description, icon, status = 'Active' } = categoryData
      
      const [result] = await pool.query(
        'INSERT INTO categories (name, description, icon, status) VALUES (?, ?, ?, ?)',
        [name, description, icon || '🏷️', status]
      )

      return { id: result.insertId, ...categoryData }
    } catch (error) {
      throw new Error('Error creating category: ' + error.message)
    }
  }

  // Update category
  static async update(id, categoryData) {
    try {
      const { name, description, icon, status } = categoryData
      
      const [result] = await pool.query(
        'UPDATE categories SET name = ?, description = ?, icon = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, description, icon || '🏷️', status, id]
      )

      if (result.affectedRows === 0) {
        throw new Error('Category not found')
      }

      return { id, ...categoryData }
    } catch (error) {
      throw new Error('Error updating category: ' + error.message)
    }
  }

  // Update category by ID (alias for update)
  static async findByIdAndUpdate(id, categoryData) {
    return this.update(id, categoryData)
  }

  // Delete category (hard delete)
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM categories WHERE id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
        throw new Error('Category not found')
      }

      return true
    } catch (error) {
      throw new Error('Error deleting category: ' + error.message)
    }
  }

  // Find by ID and delete (alias)
  static async findByIdAndDelete(id) {
    const category = await this.findById(id)
    if (category) {
      await this.delete(id)
    }
    return category
  }

  // Check if category name exists
  static async findByName(name) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM categories WHERE name = ? AND is_active = true',
        [name]
      )
      return rows[0] || null
    } catch (error) {
      throw new Error('Error checking category name: ' + error.message)
    }
  }

  // Get categories with product counts
  static async findWithProductCount() {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.name = p.category AND p.is_active = true
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.name ASC
      `)
      return rows
    } catch (error) {
      throw new Error('Error fetching categories with product count: ' + error.message)
    }
  }

  // Get all categories (including inactive) for admin
  static async find(options = {}) {
    const { limit = 50, skip = 0, sort = 'name', order = 'asc', ...filters } = options
    
    // Validate sort field to prevent SQL injection
    const allowedSortFields = ['id', 'name', 'description', 'icon', 'status', 'is_active', 'created_at']
    const validSort = allowedSortFields.includes(sort) ? sort : 'name'
    const validOrder = order === 'asc' ? 'ASC' : 'DESC'
    
    let query = 'SELECT * FROM categories'
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
    const limitNum = parseInt(limit) || 50
    const skipNum = parseInt(skip) || 0
    query += ` LIMIT ${limitNum} OFFSET ${skipNum}`
    
    const [rows] = await pool.query(query, params)
    return rows
  }

  // Count categories with filters
  static async countDocuments(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM categories'
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

  // Get category statistics
  static async getStats() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          c.name,
          c.status,
          COUNT(p.id) as total_products,
          COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_products
        FROM categories c
        LEFT JOIN products p ON c.name = p.category
        WHERE c.is_active = true
        GROUP BY c.id, c.name, c.status
        ORDER BY total_products DESC
      `)
      return rows
    } catch (error) {
      throw new Error('Error fetching category statistics: ' + error.message)
    }
  }
}

module.exports = Category
