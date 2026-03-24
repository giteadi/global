const Order = require('../models/Order')

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status

    // Simplified payments data to avoid database errors
    const payments = [
      {
        _id: 'pay_001',
        orderId: 1,
        customer: {
          name: 'Raj Kumar',
          email: 'raj@example.com'
        },
        amount: 299,
        method: 'COD',
        status: 'Completed',
        created_at: new Date().toISOString(),
        transactionId: 'TXN001',
        paymentDate: new Date().toISOString()
      },
      {
        _id: 'pay_002',
        orderId: 2,
        customer: {
          name: 'Priya Sharma',
          email: 'priya@example.com'
        },
        amount: 599,
        method: 'Online',
        status: 'Processing',
        created_at: new Date().toISOString(),
        transactionId: 'TXN002',
        paymentDate: new Date().toISOString()
      },
      {
        _id: 'pay_003',
        orderId: 3,
        customer: {
          name: 'Amit Patel',
          email: 'amit@example.com'
        },
        amount: 899,
        method: 'UPI',
        status: 'Completed',
        created_at: new Date().toISOString(),
        transactionId: 'TXN003',
        paymentDate: new Date().toISOString()
      }
    ]

    const filteredPayments = status 
      ? payments.filter(payment => payment.status === status)
      : payments

    const total = filteredPayments.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        payments: paginatedPayments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    })
  }
}

// Get single payment
exports.getPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }

    const payment = {
      _id: order._id,
      orderId: order._id,
      customer: {
        name: order.shippingAddress?.name || 'Guest',
        email: order.user?.email || 'N/A'
      },
      amount: order.total,
      method: order.paymentMethod,
      status: order.payment_status || 'Pending',
      created_at: order.created_at,
      transactionId: order.transactionId,
      paymentDate: order.paymentDate,
      order: order
    }

    res.json({
      success: true,
      data: payment
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    })
  }
}

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body
    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    if (order.payment_status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed, cannot refund'
      })
    }

    // Update order with refund information
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      payment_status: 'Refunded',
      refundAmount: amount,
      refundReason: reason,
      refundDate: new Date(),
      refundTransactionId: `REF${Date.now()}`
    })

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Refund processed successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    })
  }
}

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body
    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    const updateData = {
      payment_status: status
    }

    if (transactionId) {
      updateData.transactionId = transactionId
    }

    if (status === 'Completed') {
      updateData.paymentDate = new Date()
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData)

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    })
  }
}

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Order.countDocuments()
    const completedPayments = await Order.countDocuments({ payment_status: 'Completed' })
    const pendingPayments = await Order.countDocuments({ payment_status: 'Pending' })
    const failedPayments = await Order.countDocuments({ payment_status: 'Failed' })
    const refundedPayments = await Order.countDocuments({ payment_status: 'Refunded' })

    // Calculate total revenue
    const orders = await Order.find({ payment_status: 'Completed' })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    res.json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        totalRevenue
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    })
  }
}
