const express = require('express');
const router = express.Router();
const {
  giveFeedback,
  getMyFeedback,
  getAdminFeedback,
  getStudentFeedback,
} = require('../controllers/feedback.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), giveFeedback);
router.get('/my', protect, authorize('student'), getMyFeedback);
router.get('/admin', protect, authorize('admin'), getAdminFeedback);
router.get('/student/:userId', protect, authorize('admin'), getStudentFeedback);


module.exports = router;
