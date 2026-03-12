import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import API_BASE from '../api/config'

const Contact = React.memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Contact form error:', error)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-teal-200 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, 
            want to place a bulk order, or just want to connect with us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8"
          >
            <h2 className="text-2xl font-serif text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
              <h2 className="text-2xl font-serif text-white mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-xl">📍</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Address</h3>
                    <p className="text-teal-200">
                      Global Exim Traders<br/>
                      Export Import Zone<br/>
                      Rajasthan, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-xl">📞</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-teal-200">+91 98765 43210</p>
                    <p className="text-teal-200">+91 12345 67890</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-xl">✉️</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-teal-200">info@globaleximtraders.com</p>
                    <p className="text-teal-200">exports@globaleximtraders.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-xl">🕐</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-teal-200">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-teal-200">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
              <h2 className="text-2xl font-serif text-white mb-6">Quick Links</h2>
              
              <div className="space-y-3">
                <a href="#" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                  📄 Product Catalog
                </a>
                <a href="#" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                  📋 Bulk Order Form
                </a>
                <a href="#" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                  🏭 Export Information
                </a>
                <a href="#" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                  📊 Partnership Opportunities
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
              <h2 className="text-2xl font-serif text-white mb-6">Follow Us</h2>
              
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <span className="text-xl">f</span>
                </a>
                <a href="#" className="w-12 h-12 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" className="w-12 h-12 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <span className="text-xl">in</span>
                </a>
                <a href="#" className="w-12 h-12 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <span className="text-xl">🐦</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
})

export default React.memo(Contact)
