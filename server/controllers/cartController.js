const Cart = require('../models/Cart')
const Product = require('../models/Product')

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.getByUser(req.user.id)

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    res.json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    })
  }
}

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    // Validate product exists and is active
    const product = await Product.getById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get or create cart
    let cart = await Cart.getByUser(req.user.id)
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    // Add item to cart items array
    cart.items.push({
      product: productId,
      name: product.name,
      icon: product.icon,
      price: product.price,
      quantity: quantity,
      category: product.category
    })

    // Update cart in database
    await Cart.updateByUser({ user: req.user.id }, { items: cart.items })

    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    })
  }
}

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.getByUser(req.user.id)
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    await Cart.updateByUser({ user: req.user.id }, { items: cart.items })

    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    })
  }
}

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.getByUser(req.user.id)

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    cart.items.splice(itemIndex, 1)

    await Cart.updateByUser({ user: req.user.id }, { items: cart.items })

    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    })
  }
}

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.clearByUser(req.user.id)

    res.json({
      success: true,
      data: { items: [], total: 0 },
      message: 'Cart cleared successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    })
  }
}
