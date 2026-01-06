const express = require('express');
const WeightLog = require('../models/WeightLog');

const router = express.Router();

/**
 * GET /api/weight
 * Fetch all weight entries, sorted by date (newest first)
 * Returns: Array of WeightLog objects
 */
router.get('/', async (req, res) => {
  try {
    const weights = await WeightLog.find({}).sort({ date: -1 });
    res.json(weights);
  } catch (error) {
    console.error('Error fetching weight logs:', error);
    res.status(500).json({ error: 'Failed to fetch weight logs' });
  }
});

/**
 * POST /api/weight
 * Create or update weight entry for a specific date
 * Body: { date, weight }
 * Returns: Updated WeightLog object
 */
router.post('/', async (req, res) => {
  try {
    const { date, weight } = req.body;

    if (!date || weight === undefined || weight === null) {
      return res.status(400).json({ error: 'Date and weight are required' });
    }

    if (weight < 0) {
      return res.status(400).json({ error: 'Weight must be a positive number' });
    }

    // Upsert: update if exists, create if doesn't
    const weightLog = await WeightLog.findOneAndUpdate(
      { date },
      { date, weight },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    );

    res.json(weightLog);
  } catch (error) {
    console.error('Error saving weight log:', error);
    res.status(500).json({ error: 'Failed to save weight log' });
  }
});

module.exports = router;
