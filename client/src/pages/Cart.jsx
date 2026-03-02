import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart, closeCart } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)

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
    // In real app, this would navigate to checkout page
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-serif text-white mb-4">Your cart is empty</h2>
          <p className="text-teal-200 mb-8">Looks like you haven't added any items yet</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4 relative overflow-hidden">
      {/* Parallax Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 via-transparent to-teal-800/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,204,200,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,162,110,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif text-white mb-8 text-center">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-white">Cart Items ({items.length})</h2>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => {
                  // Parse images if they're in string format
                  let images = item.images
                  if (typeof images === 'string') {
                    try {
                      images = JSON.parse(images)
                    } catch {
                      images = []
                    }
                  }
                  const imageUrl = images && images.length > 0 ? images[0] : null

                  return (
                    <div key={item.id} className="bg-teal-900/30 border border-teal-600/20 rounded-lg p-4">
                      <div className="flex gap-4">
                        <div 
                          onClick={() => navigate(`/product/${item.id}`)}
                          className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">{item.icon || '📦'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="text-white font-semibold cursor-pointer hover:text-yellow-400 transition-colors"
                              >
                                {item.name}
                              </h3>
                              <p className="text-yellow-400 text-sm">{item.category}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-teal-700 hover:bg-teal-600 text-white rounded flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <span className="text-white w-12 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-teal-700 hover:bg-teal-600 text-white rounded flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-400 font-semibold">₹{item.price}</p>
                              <p className="text-white text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-serif text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-teal-200">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-teal-200">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-teal-200">
                  <span>Tax</span>
                  <span>₹{(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-teal-600/30 pt-3">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-yellow-400">₹{(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 mb-4"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-full font-semibold transition-all"
              >
                Continue Shopping
              </button>

              {/* Promo Code */}
              <div className="mt-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  />
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold transition-all">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Cart
