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

// Protected routes (temporarily without auth for testing)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

// Admin routes (temporarily without auth for testing)
router.get('/admin/users', getAllUsers)
router.post('/admin/users', createUser)
router.put('/admin/users/:id', updateUser)
router.delete('/admin/users/:id', deleteUser)
router.post('/admin/reset-passwords', resetAllPasswords)

module.exports = router
