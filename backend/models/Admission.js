const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  course: {
    type: String,
    required: true,
    enum: ['bca', 'bscit', 'bscca&it']
  },
  marksheet: {
    filename: String,
    path: String,
    originalName: String
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'accepted', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);