const Internship = require('../models/Internship');
const Application = require('../models/Application');

// @desc  Create internship
// @route POST /api/internships
// @access Admin
const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create({
      ...req.body,
      adminId: req.user._id,
    });
    res.status(201).json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all internships
// @route GET /api/internships
// @access Public
const getInternships = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === 'true') filter.isActive = true;
    if (req.query.domain) filter.domain = req.query.domain;

    // Admins see only their own internships
    if (req.user && req.user.role === 'admin') {
      filter.adminId = req.user._id;
    }

    const internships = await Internship.find(filter)
      .populate('adminId', 'name email')
      .sort('-createdAt');

    res.json({ success: true, count: internships.length, internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single internship
// @route GET /api/internships/:id
// @access Public
const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('adminId', 'name email');
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update internship
// @route PUT /api/internships/:id
// @access Admin
const updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    if (internship.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete internship
// @route DELETE /api/internships/:id
// @access Admin
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    if (internship.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await internship.deleteOne();
    res.json({ success: true, message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get applicants for an internship
// @route GET /api/internships/:id/applicants
// @access Admin
const getApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ internshipId: req.params.id })
      .populate('userId', 'name email bio skills')
      .sort('-createdAt');
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInternship,
  getInternships,
  getInternship,
  updateInternship,
  deleteInternship,
  getApplicants,
};
