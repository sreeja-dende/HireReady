const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  type: {
    type: String,
    enum: ['coding', 'aptitude', 'participation'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  code: {
    type: String
  },
  answers: [{
    question: String,
    answer: String,
    correct: Boolean
  }],
  timeTaken: {
    type: Number // in seconds
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Score', scoreSchema);
