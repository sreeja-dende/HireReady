const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Resume Sample', 'Company Info', 'Interview Tips'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
