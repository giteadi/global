const express = require('express')
const {
  getOrders,
  getOrder,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

// User routes (require authentication)
router.get('/', auth, getOrders)
router.get('/:id', auth, getOrder)
router.post('/', auth, createOrder)
router.put('/:id/cancel', auth, cancelOrder)

// Admin routes (require admin authentication)
router.get('/admin/all', auth, adminAuth, getAllOrders)
router.put('/admin/:id/status', auth, adminAuth, updateOrderStatus)

module.exports = router
