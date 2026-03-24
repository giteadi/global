const Product = require('../models/Product')

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = 'created_at',
      order = 'desc',
      featured = false
    } = req.query

    const query = {}
    const options = {}

    // Add filters
    if (category && category !== 'All') {
      query.category = category
    }

    if (featured === 'true') {
      query.isFeatured = true
    }

    if (search) {
      // Use prefix search for better performance (can use index)
      query.name = { $like: `${search}%` }
    }

    // Add sorting
    options.sortBy = sort
    options.sortOrder = order

    // Add pagination with hard limit
    const limitValue = Math.min(parseInt(limit), 20) // Max 20 products
    options.limit = limitValue
    options.skip = (parseInt(page) - 1) * limitValue

    console.log('Starting product query...')
    const startTime = Date.now()
    
    // Run queries in parallel for better performance
    const [products, total] = await Promise.all([
      Product.getAll(query, options),
      Product.count(query)
    ])
    
    console.log('Products query took:', Date.now() - startTime, 'ms')
    console.log('Total products:', total)

    // Images already processed in Product.getAll model
    // No additional processing needed

    console.log('Returning products count:', products.length)

    res.json({
      success: true,
      data: {
        products: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    })
  }
}

// Get single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images) : []),
      features: Array.isArray(product.features) ? product.features : (product.features ? JSON.parse(product.features) : []),
      tags: Array.isArray(product.tags) ? product.tags : (product.tags ? JSON.parse(product.tags) : []),
      seo_keywords: Array.isArray(product.seo_keywords) ? product.seo_keywords : (product.seo_keywords ? JSON.parse(product.seo_keywords) : [])
    }

    res.json({
      success: true,
      data: parsedProduct
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    })
  }
}

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.getAll({ isFeatured: true }, { limit: 8 })

    // Parse JSON fields for each product
    const parsedProducts = products.map(product => ({
      ...product,
      images: Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images) : []),
      features: Array.isArray(product.features) ? product.features : (product.features ? JSON.parse(product.features) : []),
      tags: Array.isArray(product.tags) ? product.tags : (product.tags ? JSON.parse(product.tags) : []),
      seo_keywords: Array.isArray(product.seo_keywords) ? product.seo_keywords : (product.seo_keywords ? JSON.parse(product.seo_keywords) : [])
    }))

    res.json({
      success: true,
      data: parsedProducts
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    })
  }
}

// Get product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getDistinct('category')

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
}

// Admin: Create new product
exports.createProduct = async (req, res) => {
  try {
    console.log('createProduct called with req.body:', req.body)
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    })
  }
}

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.updateById(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    })
  }
}

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    // First check if product exists
    const existingProduct = await Product.getById(req.params.id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Perform soft delete
    await Product.updateById(req.params.id, { is_active: false })

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    })
  }
}
