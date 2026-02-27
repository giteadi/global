import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signupUser } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const result = await dispatch(signupUser(formData)).unwrap()
      toast.success('Account created successfully! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-black/60">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Join Us</span>
          <h1 className="text-3xl font-serif text-white mt-2 mb-4 text-with-shadow">
            Create Your Account
          </h1>
          <p className="text-teal-200 text-with-shadow">
            Sign up to start shopping and enjoy exclusive benefits
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-yellow-400 text-sm mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Your full name"
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
              <label className="block text-yellow-400 text-sm mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-yellow-400 text-sm mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-yellow-400 text-sm mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-yellow-400 text-sm mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="Pincode"
                />
              </div>
              <div>
                <label className="block text-yellow-400 text-sm mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                  placeholder="Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-yellow-400 text-sm mb-2">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Street address"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-teal-200">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
