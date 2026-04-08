const express = require('express');
const router = express.Router();

const {
  applyForInternship,
  getMyApplications,
  updateApplicationStatus,
  getAdminApplications,
} = require('../controllers/application.controller');

const { protect, authorize } = require('../middleware/auth');

// ─── STUDENT ───────────────────────────────────────────
router.post('/', protect, authorize('student'), applyForInternship);
router.get('/my', protect, authorize('student'), getMyApplications);

// ─── ADMIN / EMPLOYER ──────────────────────────────────

// ✅ NEW FIX (IMPORTANT)
// Now frontend can call: /api/applications
router.get('/', protect, authorize('admin'), getAdminApplications);

// existing route (still works)
router.get('/admin', protect, authorize('admin'), getAdminApplications);

// update status
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;