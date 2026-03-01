import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
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
import AdminPayments from './pages/AdminPayments'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'
import './styles.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-16">
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
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--teal)',
              color: 'var(--white)',
            },
            success: {
              style: {
                background: 'var(--gold)',
                color: 'var(--text-bright)',
              },
            },
            error: {
              style: {
                background: 'var(--maroon)',
                color: 'var(--white)',
              },
            },
          }}
        />
      </Router>
    </Provider>
  )
}

export default App
