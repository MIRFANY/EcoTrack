const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['transportation', 'diet', 'digital', 'general'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  pointsReward: {
    type: Number,
    default: 10
  },
  targetValue: Number, // e.g., walk 5km, eliminate 3 meat meals
  startDate: Date,
  endDate: Date,
  participants: [{
    userId: mongoose.Schema.Types.ObjectId,
    progress: Number,
    completed: Boolean,
    completedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
