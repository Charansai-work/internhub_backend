const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
