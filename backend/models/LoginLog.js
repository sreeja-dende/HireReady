const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Placement Cell'],
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  failureReason: {
    type: String,
    enum: ['Invalid credentials', 'User not found', 'Account locked', 'Other']
  }
}, {
  timestamps: true
});

// Index for efficient queries
loginLogSchema.index({ userId: 1, timestamp: -1 });
loginLogSchema.index({ email: 1, timestamp: -1 });
loginLogSchema.index({ success: 1, timestamp: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
