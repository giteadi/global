import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserProfile } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })

  // Memoize form data to prevent unnecessary re-renders
  const memoizedFormData = useMemo(() => formData, [formData])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await dispatch(updateUserProfile(formData)).unwrap()
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error || 'Failed to update profile')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse text-with-shadow">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">My Profile</span>
          <h1 className="text-3xl font-serif text-white mt-2 mb-4">
            Edit Your Details
          </h1>
          <p className="text-teal-200">
            Update your personal information and address
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-yellow-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-teal-900/50 border border-teal-600/30 text-gray-400 px-4 py-3 rounded-lg cursor-not-allowed"
              />
              <p className="text-teal-200 text-sm mt-1">Email cannot be changed</p>
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
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
