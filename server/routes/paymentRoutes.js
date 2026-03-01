const express = require('express')
const router = express.Router()
const Razorpay = require('razorpay')
const {
  getPayments,
  getPayment,
  processRefund,
  updatePaymentStatus,
  getPaymentStats
} = require('../controllers/paymentController')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Public routes
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body
  const options = {
    amount: amount * 100, // amount in paise
    currency,
    receipt: 'receipt_' + Date.now()
  }
  try {
    const order = await razorpay.orders.create(options)
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  const crypto = require('crypto')
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')
  if (expectedSignature === razorpay_signature) {
    res.json({ success: true })
  } else {
    res.status(400).json({ success: false })
  }
})

// Admin routes (without auth middleware for now)
router.get('/admin/payments', getPayments)
router.get('/admin/payments/:id', getPayment)
router.post('/admin/payments/:id/refund', processRefund)
router.put('/admin/payments/:id', updatePaymentStatus)
router.get('/admin/payments/stats', getPaymentStats)

module.exports = router
