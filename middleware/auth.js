const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// ✅ PROTECT ROUTE
exports.protect = async (req, res, next) => {
  let token

  try {
    // 🔥 GET TOKEN FROM HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // ❌ NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      })
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ GET USER FROM DB
    req.user = await User.findById(decoded.id).select('-password')

    next()
  } catch (error) {
    console.error('AUTH ERROR:', error.message)

    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    })
  }
}

// ✅ ROLE AUTHORIZATION
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this role',
      })
    }
    next()
  }
}