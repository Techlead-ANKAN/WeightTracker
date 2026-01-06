const mongoose = require('mongoose');

/**
 * WeightLog Schema
 * Tracks weight entries by date
 * date: ISO string (YYYY-MM-DD format)
 * weight: Weight in kilograms
 */
const weightLogSchema = new mongoose.Schema({
  date: {
    type: String, // Store as ISO string (YYYY-MM-DD)
    required: true,
    unique: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeightLog', weightLogSchema);
