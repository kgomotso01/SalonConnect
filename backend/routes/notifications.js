
const express = require('express')
const db = require('../db')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

// Get notifications for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const [notifications] = await db.query(
      `SELECT
        notification_id,
        appointment_id,
        message,
        is_read,
        created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.user_id]
    )

    res.json(notifications)
  } catch (error) {
    console.error('Error retrieving notifications:', error)
    res.status(500).json({
      message: 'Could not retrieve notifications.'
    })
  }
})


// Mark a notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE notification_id = ?
       AND user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Notification not found.'
      })
    }

    res.json({
      message: 'Notification marked as read.'
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    res.status(500).json({
      message: 'Could not update notification.'
    })
  }
})


// Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = ? AND is_read = FALSE`,
      [req.user.user_id]
    )

    res.json({
      message: 'All notifications marked as read.'
    })
  } catch (error) {
    console.error('Error updating notifications:', error)
    res.status(500).json({
      message: 'Could not update notifications.'
    })
  }
})

module.exports = router
