import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { paymentData } = location.state || {}

  useEffect(() => {
    if (!paymentData) {
      navigate('/cart')
      return
    }
    
    // Store payment data for admin dashboard
    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]')
    existingPayments.push(paymentData)
    localStorage.setItem('payments', JSON.stringify(existingPayments))
    
    toast.success('Order placed successfully!')
  }, [paymentData, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl mb-6"
        >
          ✅
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-serif text-white mb-4"
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-teal-200 mb-8"
        >
          Thank you for your order. We have received your payment and will process your order shortly.
        </motion.p>

        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6 mb-6 text-left"
          >
            <h2 className="text-xl font-serif text-white mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-teal-200">Order ID:</span>
                <span className="text-white font-semibold">#{paymentData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-200">Payment Method:</span>
                <span className="text-white font-semibold capitalize">{paymentData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-200">Total Amount:</span>
                <span className="text-yellow-400 font-semibold">₹{paymentData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-200">Date:</span>
                <span className="text-white font-semibold">
                  {new Date(paymentData.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
