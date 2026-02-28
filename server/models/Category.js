const { pool } = require('../config/database')

class Category {
  // Get all categories
  static async findAll() {
    try {
      const [rows] = await pool.execute(
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
      const [rows] = await pool.execute(
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
      const { name, description, icon } = categoryData
      
      const [result] = await pool.execute(
        'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
        [name, description, icon || '🏷️']
      )

      return { id: result.insertId, ...categoryData }
    } catch (error) {
      throw new Error('Error creating category: ' + error.message)
    }
  }

  // Update category
  static async update(id, categoryData) {
    try {
      const { name, description, icon } = categoryData
      
      const [result] = await pool.execute(
        'UPDATE categories SET name = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, description, icon || '🏷️', id]
      )

      if (result.affectedRows === 0) {
        throw new Error('Category not found')
      }

      return { id, ...categoryData }
    } catch (error) {
      throw new Error('Error updating category: ' + error.message)
    }
  }

  // Delete category (soft delete)
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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

  // Check if category name exists
  static async findByName(name) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE name = ? AND is_active = true',
        [name]
      )
      return rows[0] || null
    } catch (error) {
      throw new Error('Error checking category name: ' + error.message)
    }
  }
}

module.exports = Category
