import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart, closeCart } from '../store/slices/cartSlice'
import { logout } from '../store/slices/authSlice'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { items, isOpen, total } = useSelector(state => state.cart)
  const { user, isAdmin } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-950/90 backdrop-blur-md border-b border-teal-700/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-serif text-yellow-400 font-bold">Global Exim</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-colors ${isActive('/') ? 'text-yellow-400' : 'text-teal-200 hover:text-yellow-400'}`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`transition-colors ${isActive('/products') ? 'text-yellow-400' : 'text-teal-200 hover:text-yellow-400'}`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`transition-colors ${isActive('/about') ? 'text-yellow-400' : 'text-teal-200 hover:text-yellow-400'}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`transition-colors ${isActive('/contact') ? 'text-yellow-400' : 'text-teal-200 hover:text-yellow-400'}`}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`transition-colors ${isActive('/admin') ? 'text-yellow-400' : 'text-teal-200 hover:text-yellow-400'}`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <span className="text-xl">🛒</span>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-teal-200 hover:text-yellow-400 text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <button className="text-teal-200 hover:text-yellow-400 text-sm transition-colors">
                    Login
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold transition-all">
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-teal-950/95 backdrop-blur-md border-t border-teal-700/30">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-yellow-400/20 text-yellow-400' : 'text-teal-200 hover:bg-teal-800/50'}`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/products') ? 'bg-yellow-400/20 text-yellow-400' : 'text-teal-200 hover:bg-teal-800/50'}`}
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/about') ? 'bg-yellow-400/20 text-yellow-400' : 'text-teal-200 hover:bg-teal-800/50'}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-yellow-400/20 text-yellow-400' : 'text-teal-200 hover:bg-teal-800/50'}`}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md transition-colors ${isActive('/admin') ? 'bg-yellow-400/20 text-yellow-400' : 'text-teal-200 hover:bg-teal-800/50'}`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => dispatch(closeCart())}
          ></div>
          <div className="fixed right-0 top-0 h-full w-96 bg-teal-900 border-l border-teal-700/30 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-white">Shopping Cart</h2>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-4">🛒</span>
                  <p className="text-teal-200">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-teal-800/30 border border-teal-600/20 rounded-lg p-4">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-teal-800 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                            <p className="text-yellow-400 text-sm">${item.price}</p>
                            <p className="text-teal-200 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-teal-600/30 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-xl text-yellow-400 font-bold">${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(closeCart())
                        navigate('/cart')
                      }}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold transition-all"
                    >
                      View Cart & Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
