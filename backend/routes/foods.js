const express = require('express');
const Food = require('../models/Food');

const router = express.Router();

/**
 * GET /api/foods
 * Fetch all food items grouped by mealType
 * Returns: { breakfast: [], lunch: [], dinner: [] }
 */
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({}).sort({ mealType: 1, name: 1 });

    // Group foods by mealType
    const groupedFoods = {
      breakfast: foods.filter(f => f.mealType === 'breakfast'),
      lunch: foods.filter(f => f.mealType === 'lunch'),
      dinner: foods.filter(f => f.mealType === 'dinner')
    };

    res.json(groupedFoods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Failed to fetch food items' });
  }
});

/**
 * POST /api/foods
 * Add a new food item
 * Body: { _id, name, portionLabel, grams, mealType }
 */
router.post('/', async (req, res) => {
  try {
    const { _id, name, portionLabel, grams, mealType } = req.body;

    // Validation
    if (!_id || !name || !portionLabel || !grams || !mealType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['breakfast', 'lunch', 'dinner'].includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type' });
    }

    if (grams <= 0) {
      return res.status(400).json({ error: 'Grams must be greater than 0' });
    }

    // Check if food ID already exists
    const existingFood = await Food.findById(_id);
    if (existingFood) {
      return res.status(400).json({ error: 'Food ID already exists' });
    }

    // Create new food
    const newFood = new Food({
      _id,
      name,
      portionLabel,
      grams,
      mealType
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ error: 'Failed to add food item' });
  }
});

/**
 * PUT /api/foods/:id
 * Update an existing food item
 * Body: { name, portionLabel, grams, mealType }
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, portionLabel, grams, mealType } = req.body;

    // Validation
    if (!name || !portionLabel || !grams || !mealType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['breakfast', 'lunch', 'dinner'].includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type' });
    }

    if (grams <= 0) {
      return res.status(400).json({ error: 'Grams must be greater than 0' });
    }

    // Update food item
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { name, portionLabel, grams, mealType },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json(updatedFood);
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ error: 'Failed to update food item' });
  }
});

/**
 * DELETE /api/foods/:id
 * Delete a food item by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully', food: deletedFood });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Failed to delete food item' });
  }
});

module.exports = router;
