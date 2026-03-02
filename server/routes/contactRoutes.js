const express = require('express')
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController')

const router = express.Router()

// Public route
router.post('/', createContact)

// Admin routes (without auth middleware for now)
router.get('/admin', getAllContacts)
router.get('/admin/stats', getContactStats)
router.get('/admin/:id', getContactById)
router.put('/admin/:id/status', updateContactStatus)
router.delete('/admin/:id', deleteContact)

module.exports = router
