const Feedback = require('../models/Feedback');

// @desc  Give feedback
// @route POST /api/feedback
// @access Admin
const giveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({ ...req.body, adminId: req.user._id });
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get feedback for a student
// @route GET /api/feedback/my
// @access Student
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id })
      .populate('adminId', 'name')
      .populate('internshipId', 'title')
      .sort('-createdAt');

    const avgRating =
      feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : 0;

    res.json({ success: true, count: feedback.length, avgRating, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all feedback given by admin
// @route GET /api/feedback/admin
// @access Admin
const getAdminFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ adminId: req.user._id })
      .populate('userId', 'name email')
      .populate('internshipId', 'title')
      .sort('-createdAt');
    res.json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get feedback for a specific student (admin)
// @route GET /api/feedback/student/:userId
// @access Admin
const getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.params.userId })
      .populate('internshipId', 'title')
      .sort('-createdAt');
    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { giveFeedback, getMyFeedback, getAdminFeedback, getStudentFeedback };
