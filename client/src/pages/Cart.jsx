import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items = [], total = 0 } = useSelector((state) => state.cart || {})

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
    toast.success('Item removed from cart')
  }

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
    } else {
      dispatch(updateQuantity({ id, quantity }))
    }
  }

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...')
    navigate('/checkout') // optional redirect
  }

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
          <h2 className="text-3xl font-serif text-white mb-4">
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
            <h2 className="text-xl font-serif text-white">
              Cart Items ({items.length})
            </h2>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              let images = item.images

              if (typeof images === 'string') {
                try {
                  images = JSON.parse(images)
                } catch {
                  images = []
                }
              }

              const imageUrl =
                images && images.length > 0 ? images[0] : null

              return (
                <div
                  key={item.id}
                  className="bg-teal-900/30 border border-teal-600/20 rounded-lg p-4"
                >
                  <div className="flex gap-4">

                    {/* Product Image */}
                    <div
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg overflow-hidden cursor-pointer"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-3xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="text-white font-semibold cursor-pointer hover:text-yellow-400"
                          >
                            {item.name}
                          </h3>
                          <p className="text-yellow-400 text-sm">
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 bg-teal-700 text-white rounded"
                          >
                            -
                          </button>
                          <span className="text-white w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 bg-teal-700 text-white rounded"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-yellow-400 font-semibold">
                            ₹{item.price}
                          </p>
                          <p className="text-white text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-xl font-serif text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-teal-200">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-teal-200">
              <span>Tax (10%)</span>
              <span>₹{(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t border-teal-600/30 pt-3 flex justify-between text-white text-lg font-semibold">
              <span>Total</span>
              <span className="text-yellow-400">
                ₹{(total * 1.1).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart