import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart, closeCart } from '../store/slices/cartSlice'
import { logout } from '../store/slices/authSlice'
import { useGetCategoriesQuery } from '../store/slices/adminApi'
import {
  HomeIcon as HomeOutline,
  ShoppingBagIcon as ShoppingBagOutline,
  ShoppingCartIcon as ShoppingCartOutline,
  UserIcon as UserOutline,
  Squares2X2Icon as Squares2X2Outline,
  XMarkIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  ShoppingCartIcon as ShoppingCartSolid,
  UserIcon as UserSolid,
  Squares2X2Icon as Squares2X2Solid
} from '@heroicons/react/24/solid'

const Navbar = React.memo(() => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { items, isOpen, total } = useSelector(state => state.cart)
  const { user, token, isAdmin } = useSelector(state => state.auth)

  const isUserAdmin = Boolean(token && user && (isAdmin || user.role === 'admin'))

  // Use RTK Query for categories
  const { data: categoriesData = [] } = useGetCategoriesQuery()

  const categories = useMemo(() => {
    if (!categoriesData) return []
    if (Array.isArray(categoriesData)) return categoriesData
    if (categoriesData.data && Array.isArray(categoriesData.data)) return categoriesData.data
    return []
  }, [categoriesData])

  const handleLogout = () => {
    dispatch(logout())
    setIsBottomSheetOpen(false)
    navigate('/login')
  }

  const handleCategoryClick = (categoryName) => {
    setIsBottomSheetOpen(false)
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full max-w-full"
        style={{
          background: 'rgba(8, 30, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(37, 204, 200, 0.18)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group apple-press flex-shrink-0">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                🏛️
              </span>
              <div className="flex flex-col">
                <span
                  style={{
                    color: 'var(--gold-bright)',
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.02em',
                    lineHeight: '1.15'
                  }}
                >
                  Global Exim Traders
                </span>
                <span
                  className="hidden sm:inline-block text-[0.62rem] uppercase tracking-[0.25em]"
                  style={{ color: 'var(--teal-light)' }}
                >
                  Heritage & Luxury
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 apple-press ${
                  isActive('/')
                    ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.2)]'
                    : 'text-[var(--text-soft)] hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 apple-press ${
                  isActive('/products')
                    ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.2)]'
                    : 'text-[var(--text-soft)] hover:text-white hover:bg-white/5'
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 apple-press ${
                  isActive('/about')
                    ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.2)]'
                    : 'text-[var(--text-soft)] hover:text-white hover:bg-white/5'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 apple-press ${
                  isActive('/contact')
                    ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.2)]'
                    : 'text-[var(--text-soft)] hover:text-white hover:bg-white/5'
                }`}
              >
                Contact
              </Link>
              {isUserAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 apple-press ${
                    isActive('/admin')
                      ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.2)]'
                      : 'text-[var(--gold)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Action Area (Desktop only - Cart & Auth) */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
              {/* Cart Button (Desktop only) */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2.5 rounded-xl apple-press transition-all bg-white/5 hover:bg-white/10 border border-teal-500/20"
                style={{ color: 'var(--gold-bright)' }}
                aria-label="Shopping Cart"
              >
                <ShoppingCartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                {items.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[0.65rem] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transform transition-transform animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #7c1d32 0%, #5C1A28 100%)',
                      color: '#ffffff',
                      border: '1.5px solid #081E23'
                    }}
                  >
                    {items.length}
                  </span>
                )}
              </button>

              {/* Desktop Auth Section */}
              {token ? (
                <div className="hidden md:flex items-center space-x-3 pl-2 border-l border-teal-500/20">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-[var(--gold-bright)] hover:underline apple-press"
                  >
                    <span className="w-8 h-8 rounded-full bg-teal-900/60 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-[var(--gold-bright)]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="font-medium max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[var(--text-soft)] hover:text-rose-400 transition-colors apple-press px-2.5 py-1 rounded-full border border-white/10 hover:border-rose-400/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-teal-500/20">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full text-[var(--text-soft)] hover:text-white hover:bg-white/5 transition-all apple-press"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full shadow-md transition-all apple-press"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                      color: '#071e24'
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content is not hidden behind fixed top navbar */}
      <div className="h-16"></div>

      {/* ================= APPLE-STYLE MOBILE BOTTOM TAB BAR ================= */}
      {/* 100% Fixed to viewport on all pages, never scrolls with content */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden pb-safe w-full"
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          zIndex: 99999,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          background: 'rgba(7, 30, 36, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(37, 204, 200, 0.3)',
          boxShadow: '0 -10px 32px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center justify-around h-16 w-full max-w-md mx-auto px-1" style={{ height: '64px', minHeight: '64px' }}>
          {/* 1. Home Tab */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl apple-press transition-all ${
              isActive('/') ? 'text-[var(--gold-bright)]' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isActive('/') ? (
              <HomeSolid className="w-5 h-5 transition-transform scale-110 drop-shadow-[0_0_8px_rgba(224,194,128,0.6)]" />
            ) : (
              <HomeOutline className="w-5 h-5 stroke-[2]" />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-1">Home</span>
            {isActive('/') && (
              <span className="w-1.5 h-1 rounded-full bg-[var(--gold-bright)] mt-0.5 shadow-[0_0_6px_var(--gold-bright)]"></span>
            )}
          </Link>

          {/* 2. Products Tab */}
          <Link
            to="/products"
            className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl apple-press transition-all ${
              isActive('/products') ? 'text-[var(--gold-bright)]' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isActive('/products') ? (
              <ShoppingBagSolid className="w-5 h-5 transition-transform scale-110 drop-shadow-[0_0_8px_rgba(224,194,128,0.6)]" />
            ) : (
              <ShoppingBagOutline className="w-5 h-5 stroke-[2]" />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-1">Products</span>
            {isActive('/products') && (
              <span className="w-1.5 h-1 rounded-full bg-[var(--gold-bright)] mt-0.5 shadow-[0_0_6px_var(--gold-bright)]"></span>
            )}
          </Link>

          {/* 3. Cart Tab */}
          <button
            onClick={() => dispatch(toggleCart())}
            className="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl relative apple-press text-slate-300 hover:text-[var(--gold-bright)] transition-all"
          >
            <div className="relative">
              <ShoppingCartOutline className="w-5 h-5 stroke-[2]" />
              {items.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white shadow-md animate-pulse"
                  style={{ background: 'var(--maroon)', boxShadow: '0 0 8px rgba(92,26,40,0.9)' }}
                >
                  {items.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-1">Cart</span>
          </button>

          {/* 4. Profile / Account Tab */}
          <Link
            to={token ? '/profile' : '/login'}
            className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl apple-press transition-all ${
              isActive('/profile') || isActive('/login') || isActive('/signup')
                ? 'text-[var(--gold-bright)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {isActive('/profile') ? (
              <UserSolid className="w-5 h-5 transition-transform scale-110 drop-shadow-[0_0_8px_rgba(224,194,128,0.6)]" />
            ) : (
              <UserOutline className="w-5 h-5 stroke-[2]" />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-1 truncate max-w-[52px]">
              {token ? (user?.name?.split(' ')[0] || 'Profile') : 'Account'}
            </span>
            {(isActive('/profile') || isActive('/login')) && (
              <span className="w-1.5 h-1 rounded-full bg-[var(--gold-bright)] mt-0.5 shadow-[0_0_6px_var(--gold-bright)]"></span>
            )}
          </Link>

          {/* 5. Explore / Categories Tab */}
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl apple-press transition-all ${
              isBottomSheetOpen ? 'text-[var(--gold-bright)]' : 'text-slate-300 hover:text-white'
            }`}
            aria-label="Open Explore Menu"
          >
            {isBottomSheetOpen ? (
              <Squares2X2Solid className="w-5 h-5 transition-transform scale-110 drop-shadow-[0_0_8px_rgba(224,194,128,0.6)]" />
            ) : (
              <Squares2X2Outline className="w-5 h-5 stroke-[2]" />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-1">Explore</span>
            {isBottomSheetOpen && (
              <span className="w-1.5 h-1 rounded-full bg-[var(--gold-bright)] mt-0.5 shadow-[0_0_6px_var(--gold-bright)]"></span>
            )}
          </button>
        </div>
      </nav>

      {/* ================= APPLE-STYLE MOBILE BOTTOM ACTION SHEET & MENU ================= */}
      {isBottomSheetOpen && (
        <div className="md:hidden fixed inset-0 z-[1000] flex flex-col justify-end">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsBottomSheetOpen(false)}
          />

          {/* Action Sheet Container */}
          <div
            className="relative w-full max-h-[88vh] overflow-y-auto rounded-t-3xl p-5 pb-safe z-10 transition-transform duration-300"
            style={{
              background: 'linear-gradient(180deg, #0e3740 0%, #071e24 100%)',
              borderTop: '1px solid rgba(37, 204, 200, 0.3)',
              boxShadow: '0 -16px 40px rgba(0, 0, 0, 0.85)'
            }}
          >
            {/* iOS Grabber Handle */}
            <div className="w-12 h-1.5 bg-white/25 rounded-full mx-auto mb-4"></div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-teal-500/20 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h3
                    className="font-serif font-bold text-base"
                    style={{ color: 'var(--gold-bright)' }}
                  >
                    Global Exim Traders
                  </h3>
                  <p className="text-[11px] text-[var(--teal-light)]">Royal Indian Heritage & Crafts</p>
                </div>
              </div>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 hover:text-white apple-press"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Collections / Categories Chips */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--gold-bright)] flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Explore Collections
                </span>
                <Link
                  to="/products"
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="text-xs text-[var(--teal-light)] font-semibold hover:underline"
                >
                  All Products →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id || cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all apple-press shadow-sm"
                      style={{
                        background: 'rgba(27, 158, 155, 0.22)',
                        border: '1px solid rgba(37, 204, 200, 0.3)',
                        color: 'var(--text-bright)'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      onClick={() => handleCategoryClick('Temple Heritage Jewellery')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all apple-press bg-teal-900/40 border border-teal-500/25 text-white"
                    >
                      Temple Heritage Jewellery
                    </button>
                    <button
                      onClick={() => handleCategoryClick('Contemporary Ethnic Fashion')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all apple-press bg-teal-900/40 border border-teal-500/25 text-white"
                    >
                      Contemporary Ethnic Fashion
                    </button>
                    <button
                      onClick={() => handleCategoryClick('Handcrafted Artisan Décor')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all apple-press bg-teal-900/40 border border-teal-500/25 text-white"
                    >
                      Handcrafted Artisan Décor
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <Link
                to="/"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all apple-press"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs font-semibold text-white">Home Page</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all apple-press"
              >
                <span className="text-xl">🛍️</span>
                <span className="text-xs font-semibold text-white">Shop Catalog</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all apple-press"
              >
                <span className="text-xl">🏛️</span>
                <span className="text-xs font-semibold text-white">About Us</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all apple-press"
              >
                <span className="text-xl">📞</span>
                <span className="text-xs font-semibold text-white">Contact & Help</span>
              </Link>
            </div>

            {isUserAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-teal-950/60 border border-[var(--gold)]/40 hover:border-[var(--gold)] transition-all apple-press mb-5"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheckIcon className="w-5 h-5 text-[var(--gold-bright)]" />
                  <span className="text-xs font-bold text-[var(--gold-bright)]">
                    Admin Control Panel
                  </span>
                </div>
                <span className="text-xs text-[var(--gold)]">Open Dashboard →</span>
              </Link>
            )}

            {/* ================= DEDICATED BOTTOM BUTTON BAR INSIDE MOBILE MENU ================= */}
            <div className="pt-3 border-t border-teal-500/20 space-y-2.5">
              <button
                onClick={() => {
                  setIsBottomSheetOpen(false)
                  dispatch(toggleCart())
                }}
                className="w-full min-h-[46px] rounded-xl font-bold text-xs flex items-center justify-center space-x-2 apple-press shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                  color: '#071e24'
                }}
              >
                <ShoppingCartOutline className="w-4 h-4 stroke-[2.5]" />
                <span>View Shopping Bag ({items.length} items)</span>
              </button>

              {token ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-950/40 border border-teal-500/25">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal-800 text-[var(--gold-bright)] font-bold flex items-center justify-center text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-[10px] text-[var(--teal-pale)] truncate">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/50 border border-rose-500/30 apple-press"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="min-h-[44px] rounded-xl font-semibold text-xs flex items-center justify-center border border-teal-500/30 text-white bg-teal-950/50 apple-press"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="min-h-[44px] rounded-xl font-semibold text-xs flex items-center justify-center border border-[var(--gold)]/40 text-[var(--gold-bright)] bg-[var(--gold)]/10 apple-press"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= CART SIDEBAR ================= */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[1100] transition-opacity"
            onClick={() => dispatch(closeCart())}
          ></div>

          <aside
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-[1110] overflow-y-auto flex flex-col transition-all duration-300"
            style={{
              background: 'linear-gradient(180deg, #0d323a 0%, #071e24 100%)',
              borderLeft: '1px solid rgba(37, 204, 200, 0.25)',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-teal-500/20 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🛍️</span>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif">
                  Your Shopping Bag
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-900/60 text-[var(--gold-bright)] font-semibold border border-teal-500/30">
                  {items.length}
                </span>
              </div>

              <button
                onClick={() => dispatch(closeCart())}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 hover:text-white apple-press"
                aria-label="Close cart"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 p-5 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-900/30 border border-teal-500/20 flex items-center justify-center text-3xl mb-4">
                    🛒
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Your cart is empty</h3>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mb-6">
                    Discover our royal collection of temple jewellery & artisan handicrafts.
                  </p>
                  <button
                    onClick={() => {
                      dispatch(closeCart())
                      navigate('/products')
                    }}
                    className="min-h-[44px] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider apple-press shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                      color: '#071e24'
                    }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl flex items-center space-x-3.5 apple-glass-card"
                    >
                      <div className="w-16 h-16 rounded-xl bg-teal-950/60 border border-teal-500/20 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={typeof item.images === 'string' ? JSON.parse(item.images)[0] : item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{item.icon || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{item.name}</h4>
                        <p
                          className="text-xs font-semibold mt-0.5"
                          style={{ color: 'var(--gold-bright)' }}
                        >
                          ₹{item.price}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-teal-500/20 bg-[#071e24]/95 pb-safe">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[var(--text-soft)]">Subtotal</span>
                  <span
                    className="text-xl font-bold font-serif"
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
                  className="w-full min-h-[46px] rounded-full font-semibold text-sm shadow-xl transition-all apple-press flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                    color: '#071e24'
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  )
})

export default Navbar
