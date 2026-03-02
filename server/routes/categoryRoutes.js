const express = require('express')
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  createCategoryAdmin,
  updateCategoryAdmin
} = require('../controllers/categoryController')

const router = express.Router()

// Public routes
router.get('/', getCategories)
router.get('/:id', getCategory)

// Admin routes (without auth middleware for now)
router.get('/admin/stats', getCategoryStats)
router.post('/admin', createCategoryAdmin)
router.put('/admin/:id', updateCategoryAdmin)
router.delete('/admin/:id', deleteCategory)

module.exports = router
