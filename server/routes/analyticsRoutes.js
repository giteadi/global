const express = require('express')
const {
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getAnalytics
} = require('../controllers/analyticsController')

const router = express.Router()

// All analytics routes (without auth middleware for now)
router.get('/', getAnalytics)
router.get('/dashboard', getDashboardStats)
router.get('/sales', getSalesAnalytics)
router.get('/products', getProductAnalytics)
router.get('/customers', getCustomerAnalytics)

module.exports = router
