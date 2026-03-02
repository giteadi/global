import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart, closeCart } from '../store/slices/cartSlice'
import { logout } from '../store/slices/authSlice'
import API_BASE from '../api/config'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { items, isOpen, total } = useSelector(state => state.cart)
  const { user, token, isAdmin } = useSelector(state => state.auth)

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products/categories`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch categories on mount and periodically
  useEffect(() => {
    // Initial fetch
    fetchCategories()
    
    // Refetch every 10 seconds to keep categories updated
    const interval = setInterval(fetchCategories, 10000)
    
    return () => clearInterval(interval)
  }, [])

  // Refetch when dropdown opens
  const handleCategoryDropdownToggle = () => {
    if (!isCategoryOpen) {
      fetchCategories() // Refresh categories when opening dropdown
    }
    setIsCategoryOpen(!isCategoryOpen)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleCategoryClick = (category) => {
    setIsCategoryOpen(false)
    setIsMobileMenuOpen(false)
    navigate(`/products?category=${encodeURIComponent(category)}`)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="w-full shadow-md fixed top-0 left-0 z-50"
        style={{ background: '#081E23' }}>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span style={{ fontSize: '1.4rem', color: 'var(--gold-bright)' }}>🏛️</span>
              <span
                style={{
                  color: 'var(--gold-bright)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Global Exim Traders
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={handleCategoryDropdownToggle}
                  className="nav-link flex items-center gap-1"
                >
                  Categories
                  <span className="text-xs">{isCategoryOpen ? '▲' : '▼'}</span>
                </button>
                
                {isCategoryOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoryOpen(false)}
                    ></div>
                    <div
                      className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-20 py-2"
                      style={{
                        background: '#0a2830',
                        border: '1px solid rgba(37,204,200,0.25)'
                      }}
                    >
                      <button
                        onClick={() => handleCategoryClick('All')}
                        className="w-full text-left px-4 py-2 hover:bg-teal-700/30 transition-colors"
                        style={{ color: 'var(--gold-bright)' }}
                      >
                        All Products
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryClick(category)}
                          className="w-full text-left px-4 py-2 hover:bg-teal-700/30 transition-colors"
                          style={{ color: 'var(--text-soft)' }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>
                About
              </Link>
              <Link to="/contact" className={isActive('/contact') ? 'nav-link active' : 'nav-link'}>
                Contact
              </Link>

              {isAdmin && (
                <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-6">

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2"
                style={{ color: 'var(--gold-bright)' }}
              >
                <span className="text-xl">🛒</span>

                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: 'var(--maroon)', color: 'white' }}>
                    {items.length}
                  </span>
                )}
              </button>

              {token ? (
                <div className="hidden md:flex items-center space-x-3">
                  <span style={{ color: 'var(--gold-bright)' }}>
                    Hi, {user?.name || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="px-4 py-1 rounded-full font-semibold"
                    style={{ background: 'var(--gold)', color: '#000' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
                style={{ color: 'var(--gold-bright)' }}
              >
                <span className="text-2xl">
                  {isMobileMenuOpen ? '✕' : '☰'}
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-4"
            style={{
              background: 'rgba(8,30,35,0.98)',
              borderTop: '1px solid rgba(37,204,200,0.2)'
            }}>

            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">
                Home
              </Link>
              
              {/* Mobile Categories */}
              <div>
                <button
                  onClick={handleCategoryDropdownToggle}
                  className="nav-link w-full text-left flex items-center justify-between"
                >
                  Categories
                  <span className="text-xs">{isCategoryOpen ? '▲' : '▼'}</span>
                </button>
                {isCategoryOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className="nav-link w-full text-left text-sm"
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="nav-link w-full text-left text-sm"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">
                About
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">
                Contact
              </Link>

              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">
                  Admin
                </Link>
              )}

              {user ? (
                <div className="pt-2 space-y-2">
                  <div className="text-sm" style={{ color: 'var(--gold-bright)' }}>
                    Hi, {user.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="nav-link w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ================= CART SIDEBAR ================= */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => dispatch(closeCart())}
          ></div>

          <div
            className="fixed right-0 top-0 h-full w-96 z-50 overflow-y-auto"
            style={{
              background: '#0a2830',
              borderLeft: '1px solid rgba(37,204,200,0.25)'
            }}
          >
            <div className="p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Shopping Cart
                </h2>

                <button
                  onClick={() => dispatch(closeCart())}
                  style={{ color: 'var(--gold-bright)' }}
                >
                  ✕
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  🛒 Your cart is empty
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg"
                        style={{
                          background: 'rgba(27,158,155,0.1)',
                          border: '1px solid rgba(37,204,200,0.12)'
                        }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-white font-semibold">
                              {item.name}
                            </h4>
                            <p style={{ color: 'var(--gold-bright)' }}>
                              ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 border-gray-600">
                    <div className="flex justify-between mb-4">
                      <span className="text-white font-semibold">
                        Total:
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: 'var(--gold-bright)' }}
                      >
                        ₹{total.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(closeCart())
                        navigate('/cart')
                      }}
                      className="w-full py-2 rounded-full font-semibold"
                      style={{
                        background: 'var(--gold)',
                        color: '#000'
                      }}
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

      {/* Spacer so content not hide behind fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}

export default Navbar