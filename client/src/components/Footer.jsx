import React from 'react'
import { Link } from 'react-router-dom'

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="overflow-x-hidden" style={{ background: 'rgba(8,30,35,0.92)', borderTop: '1px solid rgba(37,204,200,0.25)' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-serif font-bold" style={{ color: 'var(--gold-bright)' }}>Global Exim Traders</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-soft)' }}>
              Where Heritage Meets Global Elegance. Premium Indian handicrafts and fashion jewellery delivered worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm" style={{ background: 'rgba(200,162,110,0.1)', border: '1px solid var(--gold)' }}>
                f
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm" style={{ background: 'rgba(200,162,110,0.1)', border: '1px solid var(--gold)' }}>
                📷
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm" style={{ background: 'rgba(200,162,110,0.1)', border: '1px solid var(--gold)' }}>
                in
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm" style={{ background: 'rgba(200,162,110,0.1)', border: '1px solid var(--gold)' }}>
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="footer-link text-sm">
                  Temple Heritage Jewellery
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-sm">
                  Contemporary Ethnic Fashion
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-sm">
                  Handcrafted Artisan Décor
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-sm">
                  Export-Grade Handicrafts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span style={{ color: 'var(--gold-bright)' }}>📞</span>
                <span style={{ color: 'var(--text-soft)' }}> +91 98851 39882</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="py-6" style={{ borderTop: '1px solid rgba(37,204,200,0.25)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Certifications & Compliance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--gold-bright)' }}>GSTIN Registered</span>
            </div>
            <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--gold-bright)' }}>IEC Code Holder</span>
            </div>
            <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--gold-bright)' }}>EPCH Associated</span>
            </div>
            <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--gold-bright)' }}>Export Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-4" style={{ borderTop: '1px solid rgba(37,204,200,0.25)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-2 md:mb-0" style={{ color: 'var(--text-soft)' }}>
              © {currentYear} Global Exim Traders. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
              <a href="#" className="footer-link">
                Shipping Policy
              </a>
              <a href="#" className="footer-link">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default React.memo(Footer)
