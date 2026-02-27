const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  })
}

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user exists
    const existingUser = await User.emailExists(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user'
        },
        token
      },
      message: 'User registered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    // Update last login
    await User.updateLastLogin(user.id)

    // Generate token
    const token = generateToken(user.id)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    })
  }
}

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: {
            street: user.street,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            country: user.country
          },
          created_at: user.created_at
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      street: req.body.address?.street,
      city: req.body.address?.city,
      state: req.body.address?.state,
      pincode: req.body.address?.pincode,
      country: req.body.address?.country
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: {
            street: user.street,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            country: user.country
          }
        }
      },
      message: 'Profile updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    })
  }
}
