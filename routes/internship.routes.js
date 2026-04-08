const express = require('express');
const router = express.Router();
const {
  createInternship,
  getInternships,
  getInternship,
  updateInternship,
  deleteInternship,
  getApplicants,
} = require('../controllers/internship.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getInternships);
router.get('/:id', protect, getInternship);
router.get('/:id/applicants', protect, authorize('admin'), getApplicants);
router.post('/', protect, authorize('admin'), createInternship);
router.put('/:id', protect, authorize('admin'), updateInternship);
router.delete('/:id', protect, authorize('admin'), deleteInternship);

module.exports = router;
