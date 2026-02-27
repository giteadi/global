import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-teal-950 border-t border-teal-700/30">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-serif text-yellow-400 font-bold">Global Exim</span>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed mb-4">
              Where Heritage Meets Global Elegance. Premium Indian handicrafts and fashion jewellery delivered worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm">
                f
              </a>
              <a href="#" className="w-8 h-8 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm">
                📷
              </a>
              <a href="#" className="w-8 h-8 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm">
                in
              </a>
              <a href="#" className="w-8 h-8 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm">
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Temple Heritage Jewellery
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Contemporary Ethnic Fashion
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Handcrafted Artisan Décor
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors text-sm">
                  Export-Grade Handicrafts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">📍</span>
                <span className="text-teal-200">
                  Export Import Zone<br/>
                  Rajasthan, India
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-yellow-400">📞</span>
                <span className="text-teal-200">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-yellow-400">✉️</span>
                <span className="text-teal-200">info@globaleximtraders.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-teal-700/30 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-yellow-400 text-sm uppercase tracking-wider">Certifications & Compliance</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-4 py-2">
              <span className="text-yellow-400 text-xs font-semibold">GSTIN Registered</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-4 py-2">
              <span className="text-yellow-400 text-xs font-semibold">IEC Code Holder</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-4 py-2">
              <span className="text-yellow-400 text-xs font-semibold">EPCH Associated</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-4 py-2">
              <span className="text-yellow-400 text-xs font-semibold">Export Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-teal-700/30 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-teal-200 mb-2 md:mb-0">
              © {currentYear} Global Exim Traders. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors">
                Shipping Policy
              </a>
              <a href="#" className="text-teal-200 hover:text-yellow-400 transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
