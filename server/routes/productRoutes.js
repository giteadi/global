const express = require('express')
const { auth, adminAuth } = require('../middleware/auth')
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

// Admin routes (protected with authentication)
router.post('/', auth, adminAuth, createProduct)
router.put('/:id', auth, adminAuth, updateProduct)
router.delete('/:id', auth, adminAuth, deleteProduct)

module.exports = router
