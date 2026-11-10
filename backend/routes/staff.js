
const express = require('express');
const router = express.Router();

const db = require('../db');
const { verifyToken, ownerOnly } = require('../middleware/auth');

// Get all available staff members
router.get('/', verifyToken, ownerOnly, async (req, res) => {
  try {
    const [staff] = await db.query(
      `SELECT staff_id, staff_name
       FROM staff
       WHERE is_available = TRUE
       ORDER BY staff_name ASC`
    );

    res.json(staff);
  } catch (error) {
    console.error('Error retrieving staff:', error);

    res.status(500).json({
      message: 'Could not retrieve staff members.'
    });
  }
});

module.exports = router;
