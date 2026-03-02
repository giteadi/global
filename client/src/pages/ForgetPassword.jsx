import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { forgetPassword } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(forgetPassword({ email })).unwrap()
      toast.success('Password reset link sent to your email!')
      setEmail('')
    } catch (error) {
      toast.error(error || 'Failed to send reset email')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Reset Password</span>
          <h1 className="text-3xl font-serif text-white mt-2 mb-4">
            Forgot Your Password?
          </h1>
          <p className="text-teal-200">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forget Password Form */}
        <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-yellow-400 text-sm mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-teal-900/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-teal-200">
              Remember your password?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgetPassword
