const Submission = require('../models/Submission');
const Task = require('../models/Task');

// @desc  Submit task
// @route POST /api/submissions
// @access Student
const submitTask = async (req, res) => {
  try {
    const { taskId, fileUrl, notes } = req.body;

    const existing = await Submission.findOne({ taskId, userId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already submitted this task' });
    }

    const submission = await Submission.create({
      taskId,
      userId: req.user._id,
      fileUrl,
      notes,
    });

    // Update task status
    await Task.findByIdAndUpdate(taskId, { status: 'completed' });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get my submissions
// @route GET /api/submissions/my
// @access Student
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .populate('taskId', 'title deadline priority')
      .sort('-createdAt');
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all submissions (admin)
// @route GET /api/submissions/admin
// @access Admin
const getAdminSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('taskId', 'title deadline')
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Review submission (admin)
// @route PUT /api/submissions/:id/review
// @access Admin
const reviewSubmission = async (req, res) => {
  try {
    const { status, adminReview, score } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, adminReview, score },
      { new: true }
    ).populate('userId', 'name email').populate('taskId', 'title');

    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitTask, getMySubmissions, getAdminSubmissions, reviewSubmission };
