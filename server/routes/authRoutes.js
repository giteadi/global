const express = require('express')
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  forgetPassword,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetAllPasswords
} = require('../controllers/authController')

const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/forget-password', forgetPassword)

// Protected routes
router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfile)

// Admin routes
router.get('/admin/users', auth, adminAuth, getAllUsers)
router.post('/admin/users', auth, adminAuth, createUser)
router.put('/admin/users/:id', auth, adminAuth, updateUser)
router.delete('/admin/users/:id', auth, adminAuth, deleteUser)
router.post('/admin/reset-passwords', auth, adminAuth, resetAllPasswords)

module.exports = router
