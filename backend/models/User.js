const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Placement Cell'],
    required: true
  },
  // Additional fields for students
  college: {
    type: String,
    required: function() { return this.role === 'Student'; }
  },
  year: {
    type: String,
    required: function() { return this.role === 'Student'; }
  },
  branch: {
    type: String,
    required: function() { return this.role === 'Student'; }
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    required: function() { return this.role === 'Student'; }
  },
  skills: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  // Job role selected by student
  jobRole: {
    type: String,
    default: ''
  },
  // Password reset fields
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
