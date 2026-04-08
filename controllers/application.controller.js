const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc  Apply for internship
// @route POST /api/applications
// @access Student
const applyForInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter, resumeUrl } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.isActive) {
      return res.status(404).json({ success: false, message: 'Internship not found or inactive' });
    }

    const existing = await Application.findOne({ userId: req.user._id, internshipId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied for this internship' });
    }

    const application = await Application.create({
      userId: req.user._id,
      internshipId,
      coverLetter,
      resumeUrl,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get my applications (student)
// @route GET /api/applications/my
// @access Student
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('internshipId', 'title domain duration stipend adminId')
      .sort('-createdAt');
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update application status (Admin approve/reject)
// @route PUT /api/applications/:id/status
// @access Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    ).populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all applications for admin's internships
// @route GET /api/applications/admin
// @access Admin
const getAdminApplications = async (req, res) => {
  try {
    const internships = await Internship.find({ adminId: req.user._id }).select('_id');
    const ids = internships.map((i) => i._id);

    const applications = await Application.find({ internshipId: { $in: ids } })
      .populate('userId', 'name email')
      .populate('internshipId', 'title')
      .sort('-createdAt');

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForInternship,
  getMyApplications,
  updateApplicationStatus,
  getAdminApplications,
};
