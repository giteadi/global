import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Login = React.memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      const result = await dispatch(loginUser(formData)).unwrap()
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      toast.error(error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-black/60">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Welcome Back</span>
          <h1 className="text-3xl font-serif text-white mt-2 mb-4 text-with-shadow">
            Login to Your Account
          </h1>
          <p className="text-teal-200 text-with-shadow">
            Access your account to make purchases and manage your profile
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-yellow-400 text-sm mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="Your password"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Link to="/forget-password" className="text-yellow-400 hover:text-yellow-300 text-sm">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-teal-200">
              Don't have an account?{' '}
              <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
})

export default React.memo(Login)
