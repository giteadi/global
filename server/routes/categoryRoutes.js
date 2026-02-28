const express = require('express')
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')

const router = express.Router()

// Public routes
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)

// Admin routes (would need authentication middleware)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
