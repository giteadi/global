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
      query.$text = { $search: search }
    }

    // Add sorting
    options.sortBy = sort
    options.sortOrder = order

    // Add pagination
    options.limit = parseInt(limit)
    options.skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Product.find(query, options)
    const total = await Product.countDocuments(query)

    // Parse JSON fields for each product
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      seo_keywords: product.seo_keywords ? JSON.parse(product.seo_keywords) : []
    }))

    res.json({
      success: true,
      data: {
        products: parsedProducts,
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
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      seo_keywords: product.seo_keywords ? JSON.parse(product.seo_keywords) : []
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
    const products = await Product.find({ isFeatured: true }, { limit: 8 })

    // Parse JSON fields for each product
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      seo_keywords: product.seo_keywords ? JSON.parse(product.seo_keywords) : []
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
    const categories = await Product.distinct('category')

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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body)

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
    const existingProduct = await Product.findById(req.params.id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Perform soft delete
    await Product.findByIdAndUpdate(req.params.id, { is_active: false })

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
