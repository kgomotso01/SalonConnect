
const express = require('express')
const db = require('../db')
const { verifyToken, customerOnly, ownerOnly } = require('../middleware/auth')

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
        st.staff_name AS staff_name
       FROM appointments a
       JOIN services s ON a.service_id = s.service_id
       LEFT JOIN staff st ON a.staff_id = st.staff_id
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


// Get all appointments for the salon owner
router.get('/', verifyToken, ownerOnly, async (req, res) => {
  try {
    const [appointments] = await db.query(
      `SELECT
        a.appointment_id,
        a.appointment_date,
        TIME_FORMAT(a.appointment_time, '%H:%i') AS appointment_time,
        a.status,
        u.full_name AS customer_name,
        u.phone AS customer_phone,
        s.service_name,
        s.price,
        st.staff_name
       FROM appointments a
       JOIN users u ON a.customer_id = u.user_id
       JOIN services s ON a.service_id = s.service_id
       LEFT JOIN staff st ON a.staff_id = st.staff_id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    )

    res.json(appointments)
  } catch (error) {
    console.error('Error retrieving all appointments:', error)
    res.status(500).json({
      message: 'Could not retrieve appointments.'
    })
  }
})


// Owner approves or declines a booking and assigns staff
router.put('/:id/review', verifyToken, ownerOnly, async (req, res) => {
  try {
    const appointmentId = req.params.id
    const { status, staff_id } = req.body

    if (!['APPROVED', 'DECLINED'].includes(status)) {
      return res.status(400).json({
        message: 'Please choose approve or decline.'
      })
    }

    const [appointments] = await db.query(
      `SELECT appointment_id
       FROM appointments
       WHERE appointment_id = ? AND status = 'PENDING'`,
      [appointmentId]
    )

    if (appointments.length === 0) {
      return res.status(404).json({
        message: 'Pending appointment not found.'
      })
    }

    if (status === 'APPROVED') {
      if (!staff_id) {
        return res.status(400).json({
          message: 'Please select a staff member.'
        })
      }

      const [staff] = await db.query(
        `SELECT staff_id
         FROM staff
         WHERE staff_id = ? AND is_available = TRUE`,
        [staff_id]
      )

      if (staff.length === 0) {
        return res.status(404).json({
          message: 'The selected staff member is not available.'
        })
      }

      await db.query(
        `UPDATE appointments
         SET status = 'APPROVED', staff_id = ?
         WHERE appointment_id = ?`,
        [staff_id, appointmentId]
      )
    } else {
      await db.query(
        `UPDATE appointments
         SET status = 'DECLINED', staff_id = NULL
         WHERE appointment_id = ?`,
        [appointmentId]
      )
    }

    res.json({
      message: status === 'APPROVED'
        ? 'Appointment approved and staff member assigned successfully.'
        : 'Appointment declined successfully.'
    })
  } catch (error) {
    console.error('Error reviewing appointment:', error)
    res.status(500).json({
      message: 'Could not review the appointment.'
    })
  }
})


// Owner marks an approved appointment as completed
router.put('/:id/complete', verifyToken, ownerOnly, async (req, res) => {
  try {
    const appointmentId = req.params.id

    const [result] = await db.query(
      `UPDATE appointments
       SET status = 'COMPLETED'
       WHERE appointment_id = ?
       AND status = 'APPROVED'`,
      [appointmentId]
    )

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: 'This appointment cannot be marked as completed.'
      })
    }

    res.json({
      message: 'Appointment marked as completed successfully.'
    })
  } catch (error) {
    console.error('Error completing appointment:', error)
    res.status(500).json({
      message: 'Could not complete the appointment.'
    })
  }
})


// Customer cancels their own pending appointment
router.put('/:id/cancel', verifyToken, customerOnly, async (req, res) => {
  try {
    const appointmentId = req.params.id

    const [result] = await db.query(
      `UPDATE appointments
       SET status = 'CANCELLED'
       WHERE appointment_id = ?
       AND customer_id = ?
       AND status = 'PENDING'`,
      [appointmentId, req.user.user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: 'This appointment cannot be cancelled. Only your pending appointments can be cancelled.'
      })
    }

    res.json({
      message: 'Your appointment has been cancelled successfully.'
    })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    res.status(500).json({
      message: 'Could not cancel your appointment.'
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
