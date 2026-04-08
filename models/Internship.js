const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    requirements: {
      type: String,
      default: '',
    },
    duration: {
      type: String, // e.g., "3 months"
      required: [true, 'Duration is required'],
    },
    stipend: {
      type: String,
      default: 'Unpaid',
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    slots: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', InternshipSchema);
