const Category = require('../models/Category')

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    
    res.json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
}

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    
    const category = await Category.findById(id)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category fetched successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    })
  }
}

// Create new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }
    
    // Check if category already exists
    const existingCategory = await Category.findByName(name.trim())
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      })
    }
    
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      icon: icon || '🏷️'
    }
    
    const category = await Category.create(categoryData)
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    })
  }
}

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, icon } = req.body
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }
    
    // Check if category exists
    const existingCategory = await Category.findById(id)
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    // Check if name is being changed to an existing name
    if (name.trim() !== existingCategory.name) {
      const duplicateCategory = await Category.findByName(name.trim())
      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        })
      }
    }
    
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      icon: icon || '🏷️'
    }
    
    const category = await Category.update(id, categoryData)
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    })
  }
}

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if category exists
    const existingCategory = await Category.findById(id)
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    await Category.delete(id)
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    })
  }
}
