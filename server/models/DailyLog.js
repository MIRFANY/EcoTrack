const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transportation: {
    type: {
      type: String,
      enum: ['walking', 'cycling', 'bus', 'train', 'car', 'electric_vehicle'],
      required: true
    },
    distance: {
      type: Number, // in kilometers
      required: true
    },
    carbonEmission: Number
  },
  meals: [{
    type: {
      type: String,
      enum: ['vegan', 'vegetarian', 'meat', 'fish']
    },
    carbonEmission: Number
  }],
  digitalWaste: {
    emails: Number, // number of emails
    streamingHours: Number, // hours spent streaming
    carbonEmission: Number
  },
  totalCarbonForDay: {
    type: Number,
    default: 0
  },
  challengesCompleted: [String], // array of challenge IDs
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
