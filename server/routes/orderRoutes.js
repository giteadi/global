const express = require('express')
const {
  getOrders,
  getOrder,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController')

const router = express.Router()

// User routes (without auth for now)
router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.put('/:id/cancel', cancelOrder)

// Admin routes (without auth for now)
router.get('/admin/all', getAllOrders)
router.put('/admin/:id/status', updateOrderStatus)

module.exports = router
