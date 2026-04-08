const express = require('express');
const router = express.Router();
const {
  submitTask,
  getMySubmissions,
  getAdminSubmissions,
  reviewSubmission,
} = require('../controllers/submission.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), submitTask);
router.get('/my', protect, authorize('student'), getMySubmissions);
router.get('/admin', protect, authorize('admin'), getAdminSubmissions);
router.put('/:id/review', protect, authorize('admin'), reviewSubmission);

module.exports = router;
