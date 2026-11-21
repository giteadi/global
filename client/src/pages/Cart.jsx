import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

// Memoized Cart Item Component to prevent whole list re-renders
const CartItem = React.memo(({ item, onRemove, onUpdateQuantity, onNavigateProduct }) => {
  const imageUrl = useMemo(() => {
    let images = item.images
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = []
      }
    }
    return images && images.length > 0 ? images[0] : null
  }, [item.images])

  const itemPrice = Number(item.price) || 0
  const itemQty = Number(item.quantity) || 1
  const lineTotal = (itemPrice * itemQty).toFixed(2)

  return (
    <div className="bg-teal-900/30 border border-teal-600/20 rounded-lg p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div
          onClick={() => onNavigateProduct(item.id)}
          className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-3xl">
              📦
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-2">
            <div>
              <h3
                onClick={() => onNavigateProduct(item.id)}
                className="text-white font-semibold cursor-pointer hover:text-yellow-400 text-with-shadow truncate"
              >
                {item.name}
              </h3>
              <p className="text-yellow-400 text-sm">
                {item.category}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-400 hover:text-red-300 p-1"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>

          <div className="flex justify-between items-center mt-3">
            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, itemQty - 1)}
                className="w-8 h-8 bg-teal-700 hover:bg-teal-600 text-white rounded font-bold transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-white w-10 text-center text-with-shadow font-semibold">
                {itemQty}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, itemQty + 1)}
                className="w-8 h-8 bg-teal-700 hover:bg-teal-600 text-white rounded font-bold transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-yellow-400 font-semibold">
                ₹{itemPrice}
              </p>
              <p className="text-white text-sm text-with-shadow">
                ₹{lineTotal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const Cart = React.memo(() => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items = [], total = 0 } = useSelector((state) => state.cart || {})

  const handleRemoveItem = useCallback((id) => {
    dispatch(removeFromCart(id))
    toast.success('Item removed from cart')
  }, [dispatch])

  const handleUpdateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
    } else {
      dispatch(updateQuantity({ id, quantity }))
    }
  }, [dispatch, handleRemoveItem])

  const handleClearCart = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  const handleNavigateProduct = useCallback((id) => {
    navigate(`/product/${id}`)
  }, [navigate])

  const handleCheckout = useCallback(() => {
    toast.success('Proceeding to checkout...')
    navigate('/checkout')
  }, [navigate])

  const numTotal = Number(total) || 0
  const subtotalFormatted = numTotal.toFixed(2)
  const taxFormatted = (numTotal * 0.1).toFixed(2)
  const grandTotalFormatted = (numTotal * 1.1).toFixed(2)

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-serif text-white mb-4 text-with-shadow">
            Your cart is empty
          </h2>
          <p className="text-teal-200 mb-8">
            Looks like you haven't added any items yet
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-white text-with-shadow">
              Cart Items ({items.length})
            </h2>
            <button
              onClick={handleClearCart}
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                onNavigateProduct={handleNavigateProduct}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-xl font-serif text-white mb-6 text-with-shadow">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-teal-200">
              <span>Subtotal</span>
              <span>₹{subtotalFormatted}</span>
            </div>
            <div className="flex justify-between text-teal-200">
              <span>Tax (10%)</span>
              <span>₹{taxFormatted}</span>
            </div>
            <div className="border-t border-teal-600/30 pt-3 flex justify-between text-white text-lg font-semibold text-with-shadow">
              <span>Total</span>
              <span className="text-yellow-400">
                ₹{grandTotalFormatted}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
})

export default Cart
