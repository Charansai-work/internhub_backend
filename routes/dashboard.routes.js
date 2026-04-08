const express = require('express')
const router = express.Router()

const { getAdminDashboard } = require('../controllers/dashboard.controller')

// GET /api/dashboard/admin
router.get('/admin', getAdminDashboard)

module.exports = router