const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['developer', 'data-analyst', 'ai-engineer'],
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String
  }],
  solutions: [{
    code: String,
    language: String,
    efficiency: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
