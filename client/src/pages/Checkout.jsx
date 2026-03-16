import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { clearCart } from '../store/slices/cartSlice'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items = [], total = 0 } = useSelector((state) => state.cart || {})
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)

  const totalWithTax = total * 1.1

  const bankDetails = {
    accountName: "B.R.Ashok Kumar",
    bankName: "Punjab National Bank",
    accountNumber: "3631000100063562",
    ifscCode: "PUNB0453800",
    upiId: "9885139882@ybl"
  }

  const qrCodeImage = "https://res.cloudinary.com/bazeercloud/image/upload/v1773650308/WhatsApp_Image_2026-03-16_at_11.22.28_abl7tl.jpg"
  const bankImage = "https://res.cloudinary.com/bazeercloud/image/upload/v1773650301/pnb_xs3myt.jpg"

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      // Create payment record for admin
      const paymentData = {
        id: Date.now(),
        items: items,
        total: totalWithTax,
        paymentMethod: selectedPaymentMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
        userInfo: {
          name: 'Customer', // You can get this from auth state
          email: 'customer@example.com'
        }
      }

      // Store payment data (you can send this to your backend)
      console.log('Payment completed:', paymentData)
      
      // Show success message
      toast.success('Payment completed successfully!')
      
      // Clear cart
      dispatch(clearCart())
      
      // Redirect to success page
      navigate('/payment-success', { state: { paymentData } })
      
      setIsProcessing(false)
    }, 2000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-serif text-white mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-white text-center mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-serif text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-teal-200 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-yellow-400 font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-teal-600/30 pt-4 space-y-2">
              <div className="flex justify-between text-teal-200">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-teal-200">
                <span>Tax (10%)</span>
                <span>₹{(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white text-lg font-semibold">
                <span>Total</span>
                <span className="text-yellow-400">
                  ₹{totalWithTax.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-serif text-white mb-6">Payment Method</h2>
            
            <div className="space-y-4">
              {/* Bank Transfer Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMethod === 'bank' 
                    ? 'border-yellow-400 bg-teal-700/30' 
                    : 'border-teal-600/30 hover:border-teal-500'
                }`}
                onClick={() => handlePaymentMethodSelect('bank')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                    {selectedPaymentMethod === 'bank' && (
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold">Bank Transfer</h3>
                </div>
                
                {selectedPaymentMethod === 'bank' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <div className="bg-teal-900/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-teal-200">Account Name:</span>
                        <span className="text-white font-semibold">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-200">Bank Name:</span>
                        <span className="text-white font-semibold">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-200">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{bankDetails.accountNumber}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(bankDetails.accountNumber)
                            }}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-200">IFSC Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{bankDetails.ifscCode}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(bankDetails.ifscCode)
                            }}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* UPI Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMethod === 'upi' 
                    ? 'border-yellow-400 bg-teal-700/30' 
                    : 'border-teal-600/30 hover:border-teal-500'
                }`}
                onClick={() => handlePaymentMethodSelect('upi')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                    {selectedPaymentMethod === 'upi' && (
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold">UPI Payment</h3>
                </div>
                
                {selectedPaymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <div className="bg-teal-900/50 rounded-lg p-4">
                      <div className="flex justify-center mb-3">
                        <img 
                          src={qrCodeImage} 
                          alt="UPI QR Code" 
                          className="w-80 h-80 object-contain"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-teal-200">UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{bankDetails.upiId}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(bankDetails.upiId)
                            }}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Payment Confirmation */}
            {selectedPaymentMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200 text-sm">
                    Please complete the payment using the selected method and click "Confirm Payment" below.
                  </p>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
