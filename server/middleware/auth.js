const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    let token

    // Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

      // Get user from token
      const user = await User.findById(decoded.id).select('-password')

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or account deactivated'
        })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

// Check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    })
  }
}

module.exports = { auth, adminAuth }
