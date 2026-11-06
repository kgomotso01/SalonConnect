
const express = require('express')
const db = require('../db')

const router = express.Router()

// Get all available salon services
router.get('/', async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT service_id, service_name, description, price FROM services WHERE is_available = TRUE'
    )

    res.json(services)

  } catch (error) {
    console.error('Error retrieving services:', error)

    res.status(500).json({
      message: 'Could not retrieve salon services.'
    })
  }
})

module.exports = router
