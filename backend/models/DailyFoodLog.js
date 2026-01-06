const mongoose = require('mongoose');

/**
 * DailyFoodLog Schema
 * Tracks food selections for a specific date
 * date: ISO string (YYYY-MM-DD format)
 * breakfast: Array of food IDs selected for breakfast
 * lunch: Array of food IDs selected for lunch
 * dinner: Array of food IDs selected for dinner
 */
const dailyFoodLogSchema = new mongoose.Schema({
  date: {
    type: String, // Store as ISO string (YYYY-MM-DD)
    required: true,
    unique: true
  },
  breakfast: [{
    type: String,
    ref: 'Food'
  }],
  lunch: [{
    type: String,
    ref: 'Food'
  }],
  dinner: [{
    type: String,
    ref: 'Food'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyFoodLog', dailyFoodLogSchema);
