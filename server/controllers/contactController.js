const Contact = require('../models/Contact')

// Create new contact submission
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    })

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact submission received successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    })
  }
}

// Get all contacts (Admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { limit } = req.query
    const contacts = await Contact.getAll({ limit: limit ? parseInt(limit) : undefined })

    res.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    })
  }
}

// Get contact by ID (Admin only)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.getById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    })
  }
}

// Update contact status (Admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      })
    }

    await Contact.updateStatus(req.params.id, status)

    res.json({
      success: true,
      message: 'Contact status updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    })
  }
}

// Delete contact (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    await Contact.delete(req.params.id)

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    })
  }
}

// Get contact statistics (Admin only)
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.count()
    const newCount = await Contact.count({ status: 'New' })
    const inProgressCount = await Contact.count({ status: 'In Progress' })
    const resolvedCount = await Contact.count({ status: 'Resolved' })

    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        inProgress: inProgressCount,
        resolved: resolvedCount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message
    })
  }
}
