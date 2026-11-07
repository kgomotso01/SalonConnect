
const express = require('express')
const db = require('../db')
const { verifyToken, customerOnly } = require('../middleware/auth')

const router = express.Router()

// Get unavailable times for a selected date
router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({
        message: 'Please provide an appointment date.'
      })
    }

    const [appointments] = await db.query(
      `SELECT TIME_FORMAT(appointment_time, '%H:%i') AS appointment_time
       FROM appointments
       WHERE appointment_date = ?
       AND status IN ('PENDING', 'APPROVED')`,
      [date]
    )

    res.json(appointments.map(item => item.appointment_time))

  } catch (error) {
    console.error('Error checking availability:', error)
    res.status(500).json({
      message: 'Could not check appointment availability.'
    })
  }
})


 // Get appointments belonging to the logged-in customer
router.get('/my-appointments', verifyToken, customerOnly, async (req, res) => {
  try {
    const [appointments] = await db.query(
      `SELECT
        a.appointment_id,
        a.appointment_date,
        TIME_FORMAT(a.appointment_time, '%H:%i') AS appointment_time,
        a.status,
        s.service_name,
        s.price,
        u.full_name AS staff_name
       FROM appointments a
       JOIN services s ON a.service_id = s.service_id
       LEFT JOIN staff st ON a.staff_id = st.staff_id
       LEFT JOIN users u ON st.user_id = u.user_id
       WHERE a.customer_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.user_id]
    )

    res.json(appointments)

  } catch (error) {
    console.error('Error retrieving customer appointments:', error)

    res.status(500).json({
      message: 'Could not retrieve your appointments.'
    })
  }
})


// Save a customer's appointment
router.post('/', verifyToken, customerOnly, async (req, res) => {
  try {
    const { service_id, appointment_date, appointment_time } = req.body

    if (!service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message: 'Please provide a service, date and time.'
      })
    }

    // Check whether the selected time is already booked
    const [existingAppointments] = await db.query(
      `SELECT appointment_id
       FROM appointments
       WHERE appointment_date = ?
       AND appointment_time = ?
       AND status IN ('PENDING', 'APPROVED')`,
      [appointment_date, appointment_time]
    )

    if (existingAppointments.length > 0) {
      return res.status(409).json({
        message: 'Sorry, this time is already booked. Please choose another time.'
      })
    }

    // Check that the selected service is available
    const [services] = await db.query(
      `SELECT service_id
       FROM services
       WHERE service_id = ? AND is_available = TRUE`,
      [service_id]
    )

    if (services.length === 0) {
      return res.status(404).json({
        message: 'The selected service is not available.'
      })
    }

    // Save the appointment
    const [result] = await db.query(
      `INSERT INTO appointments
       (customer_id, service_id, appointment_date, appointment_time, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [
        req.user.user_id,
        service_id,
        appointment_date,
        appointment_time
      ]
    )

    res.status(201).json({
      message: 'Appointment request submitted successfully! The salon owner will review your booking.',
      appointment_id: result.insertId
    })

  } catch (error) {
    console.error('Error saving appointment:', error)

    res.status(500).json({
      message: 'Could not submit your appointment. Please try again.'
    })
  }
})

module.exports = router
