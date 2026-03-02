const User = require('../models/User')
// const bcrypt = require('bcryptjs')  // Removed for plain text passwords
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  })
}

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, street, city, state, pincode, country } = req.body

    // Check if user exists
    const existingUser = await User.emailExists(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      street,
      city,
      state,
      pincode,
      country
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

    // Special admin login
    if (email === 'admin@globaleximtraders.com') {
      if (password === 'admin123') {
        const token = generateToken(1) // Admin ID
        return res.json({
          success: true,
          data: {
            user: {
              id: 1,
              name: 'Admin',
              email: 'admin@globaleximtraders.com',
              role: 'admin'
            },
            token
          },
          message: 'Admin login successful'
        })
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        })
      }
    }

    // Regular user login
    const user = await User.getByEmail(email)
    if (!user || password !== user.password) {
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
    const user = await User.getById(req.user.id)

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
    const { name, phone } = req.body
    const userId = req.user.id

    // Update user
    const updatedUser = await User.updateById(userId, { name, phone })

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: {
            street: updatedUser.street,
            city: updatedUser.city,
            state: updatedUser.state,
            pincode: updatedUser.pincode,
            country: updatedUser.country
          },
          created_at: updatedUser.created_at
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
// Forget password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.getByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await User.updateResetToken(user.id, resetToken, resetExpire)

    // Send email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Global Exim Traders',
      text: `You requested a password reset. Click this link to reset your password: http://localhost:5173/reset-password/${resetToken}\n\nThis link will expire in 10 minutes.`
    }

    await transporter.sendMail(mailOptions)

    res.json({
      success: true,
      message: 'Password reset email sent'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending reset email',
      error: error.message
    })
  }
}

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const role = req.query.role

    const filters = role ? { role } : {}

    const users = await User.getAll({
      ...filters,
      limit,
      skip: (page - 1) * limit,
      sort: 'created_at',
      order: 'desc'
    })
    const total = await User.count(filters)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    })
  }
}

// Admin: Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone, street, city, state, pincode, country } = req.body

    // Check if user exists
    const existingUser = await User.emailExists(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      street,
      city,
      state,
      pincode,
      country
    })

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    })
  }
}

// Admin: Update user
exports.updateUser = async (req, res) => {
  console.log("Update User called with ID:", req.params.id)
  console.log("req.body:", req.body)
  try {
    const { name, email, password, role, status, phone, street, city, state, pincode, country } = req.body

    const updates = { name, email, role, status, phone, street, city, state, pincode, country }
    if (password) updates.password = password

    console.log("Constructed updates:", updates)

    const user = await User.updateById(req.params.id, updates)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error("Update Error:", error)
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    })
  }
}

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.updateById(req.params.id, { status: 'Inactive' })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    })
  }
}

// Admin: Reset all user passwords to plain text (Development only)
exports.resetAllPasswords = async (req, res) => {
  try {
    // This is for development only - resets all passwords to plain text format
    const { pool } = require('../config/database')

    // Reset all passwords to 'password{user_id}' format
    await pool.query('UPDATE users SET password = CONCAT("password", id)')

    res.json({
      success: true,
      message: 'All user passwords reset to plain text',
      example: 'User ID 1 password: password1, User ID 2 password: password2, etc.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting passwords',
      error: error.message
    })
  }
}
