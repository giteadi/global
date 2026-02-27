const express = require('express')
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/categories', getCategories)
router.get('/:id', getProduct)

// Admin routes (would need authentication middleware)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
