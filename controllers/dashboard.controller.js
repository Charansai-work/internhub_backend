const User = require('../models/user.model')
const Internship = require('../models/Internship')
const Application = require('../models/Application')

// ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    const totalInternships = await Internship.countDocuments()
    const totalApplications = await Application.countDocuments()
    const acceptedInterns = await Application.countDocuments({ status: 'accepted' })

    res.json({
      totalInternships,
      totalApplications,
      acceptedInterns,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAdminDashboard,
}