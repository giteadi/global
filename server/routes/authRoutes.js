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
  deleteUser
} = require('../controllers/authController')

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/forget-password', forgetPassword)

// Protected routes (without auth middleware for now)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

// Admin routes (without auth middleware for now)
router.get('/admin/users', getAllUsers)
router.post('/admin/users', createUser)
router.put('/admin/users/:id', updateUser)
router.delete('/admin/users/:id', deleteUser)

module.exports = router
