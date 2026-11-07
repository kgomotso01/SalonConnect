
const jwt = require('jsonwebtoken')

// Check if the user is logged in
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Please log in to continue.'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired login. Please log in again.'
    })
  }
}

// Allow only customers to make bookings
function customerOnly(req, res, next) {
  if (req.user.role !== 'CUSTOMER') {
    return res.status(403).json({
      message: 'Only customers can make bookings.'
    })
  }

  next()
}

module.exports = { verifyToken, customerOnly }
