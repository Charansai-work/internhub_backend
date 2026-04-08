const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ✅ REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user,
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ✅ LOGIN (FINAL FIXED)
const login = async (req, res) => {
  try {
    console.log('JWT SECRET LOGIN:', process.env.JWT_SECRET)

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // ✅ CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user,
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ✅ GET ME
const getMe = async (req, res) => {
  res.json(req.user)
}

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
  res.json({ message: 'UpdateProfile working' })
}

// ✅ EXPORT
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
}