const mongoose = require('mongoose');

/**
 * Food Schema
 * Represents the master food database with hardcoded portions
 * _id: Custom string ID (e.g., "bf_bread_2")
 * name: Display name of the food item
 * portionLabel: Human-readable portion size (e.g., "2 slices")
 * grams: Fixed weight in grams for this portion
 * mealType: breakfast, lunch, or dinner
 */
const foodSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  portionLabel: {
    type: String,
    required: true
  },
  grams: {
    type: Number,
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner']
  }
}, {
  _id: false // Disable auto-generation of _id since we're using custom string IDs
});

module.exports = mongoose.model('Food', foodSchema);
