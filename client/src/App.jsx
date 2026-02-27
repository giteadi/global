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
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import './styles.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen" style={{ background: '#0a2830' }}>
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
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
