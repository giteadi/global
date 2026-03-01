const express = require('express')
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController')

const router = express.Router()

// Public routes
router.get('/', getCategories)
router.get('/:id', getCategory)

// Admin routes (without auth middleware for now)
router.get('/admin/stats', getCategoryStats)
router.post('/admin', createCategory)
router.put('/admin/:id', updateCategory)
router.delete('/admin/:id', deleteCategory)

module.exports = router
