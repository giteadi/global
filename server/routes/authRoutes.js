const express = require('express')
const { register, login, getProfile, updateProfile, forgetPassword } = require('../controllers/authController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forget-password', forgetPassword)
router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfile)

module.exports = router
