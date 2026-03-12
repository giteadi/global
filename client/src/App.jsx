import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppInitializer from './components/AppInitializer'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgetPassword from './pages/ForgetPassword'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import AdminCategories from './pages/AdminCategories'
import AdminContacts from './pages/AdminContacts'
import AdminPayments from './pages/AdminPayments'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'
import './styles.css'

// Memoized ScrollToTop component
const ScrollToTop = React.memo(() => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
})

// Global Error Boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a2830' }}>
          <div className="text-center">
            <h1 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                background: 'var(--teal-bright)', 
                color: '#071e24', 
                padding: '0.5rem 1rem', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Memoized Loading component
const PageLoader = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a2830' }}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-bright mx-auto mb-4"></div>
      <p style={{ color: 'var(--text-bright)' }}>Loading...</p>
    </div>
  </div>
))

function App() {
  return (
    <AppErrorBoundary>
      <AppInitializer>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-1 pt-16">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forget-password" element={<ForgetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/contacts" element={<AdminContacts />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </AppInitializer>
    </AppErrorBoundary>
  )
}

export default App
