const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const orders = await Order.find(
      { user: req.user.id },
      { limit, skip: (page - 1) * limit, sort: 'created_at', order: 'desc' }
    )
    const total = await Order.countDocuments({ user: req.user.id })

    res.json({
      success: true,
      data: {
        orders,
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
      message: 'Error fetching orders',
      error: error.message
    })
  }
}

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    })
  }
}

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body

    // Get user's cart
    const cart = await Cart.findByUser(req.user.id)
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      })
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product)
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.name || 'product'}`
        })
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over ₹500
    const total = subtotal + tax + shipping

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      tax,
      shipping,
      total,
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    })

    // Update product stock
    for (const item of cart.items) {
      await Product.updateStock(item.product, -item.quantity)
    }

    // Clear cart
    await Cart.clearCart(req.user.id)

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    })
  }
}

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status

    const query = status ? { orderStatus: status } : {}

    const orders = await Order.find(
      query,
      { limit, skip: (page - 1) * limit, sort: 'created_at', order: 'desc' }
    )
    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      data: {
        orders,
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
      message: 'Error fetching orders',
      error: error.message
    })
  }
}

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body

    const order = await Order.findByIdAndUpdate(req.params.id, {
      order_status: orderStatus,
      tracking_number: trackingNumber
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    })
  }
}

// Cancel order (user)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    if (order.order_status !== 'Processing') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      })
    }

    await Order.findByIdAndUpdate(req.params.id, { order_status: 'Cancelled' })

    // Restore product stock
    for (const item of order.items) {
      await Product.updateStock(item.product, item.quantity)
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    })
  }
}
