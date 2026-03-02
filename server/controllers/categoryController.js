const Category = require('../models/Category')
const Product = require('../models/Product')

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()

    // Add product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category.name })
        return {
          ...category,
          productCount
        }
      })
    )

    res.json({
      success: true,
      data: {
        categories: categoriesWithCount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
}

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Add product count
    const productCount = await Product.countDocuments({ category: category.name })

    res.json({
      success: true,
      data: {
        ...category,
        productCount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    })
  }
}

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, status = 'Active' } = req.body

    // Check if category already exists
    const existingCategory = await Category.findByName(name)
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      })
    }

    const category = await Category.create({
      name,
      description,
      status
    })

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

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body

    const category = await Category.findByIdAndUpdate(req.params.id, {
      name,
      description,
      status
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Update all products with this category name
    if (name && name !== category.name) {
      await Product.updateMany(
        { category: category.name },
        { category: name }
      )
    }

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

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name })
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      })
    }

    await Category.findByIdAndDelete(req.params.id)

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

// Get category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.find()
    const stats = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category.name })
        const activeProducts = await Product.countDocuments({ 
          category: category.name, 
          is_active: true 
        })
        
        return {
          name: category.name,
          totalProducts: productCount,
          activeProducts,
          status: category.status
        }
      })
    )

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    })
  }
}

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
exports.createCategoryAdmin = async (req, res) => {
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
exports.updateCategoryAdmin = async (req, res) => {
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
