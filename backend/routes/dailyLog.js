const express = require('express');
const DailyFoodLog = require('../models/DailyFoodLog');

const router = express.Router();

/**
 * GET /api/daily-log/range
 * Fetch food logs for a date range
 * Query params: start (YYYY-MM-DD), end (YYYY-MM-DD)
 * Returns: Array of DailyFoodLog objects
 */
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const logs = await DailyFoodLog.find({
      date: { $gte: start, $lte: end }
    })
    .populate('breakfast lunch dinner')
    .sort({ date: 1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching daily logs range:', error);
    res.status(500).json({ error: 'Failed to fetch daily food logs' });
  }
});

/**
 * GET /api/daily-log/:date
 * Fetch food log for a specific date
 * Param: date (YYYY-MM-DD format)
 * Returns: DailyFoodLog object or null
 */
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    const log = await DailyFoodLog.findOne({ date }).populate('breakfast lunch dinner');
    
    if (!log) {
      return res.json({ date, breakfast: [], lunch: [], dinner: [] });
    }

    res.json(log);
  } catch (error) {
    console.error('Error fetching daily log:', error);
    res.status(500).json({ error: 'Failed to fetch daily food log' });
  }
});

/**
 * POST /api/daily-log
 * Create or update food log for a specific date
 * Body: { date, breakfast, lunch, dinner }
 * Returns: Updated DailyFoodLog object
 */
router.post('/', async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Upsert: update if exists, create if doesn't
    const log = await DailyFoodLog.findOneAndUpdate(
      { date },
      { 
        date,
        breakfast: breakfast || [],
        lunch: lunch || [],
        dinner: dinner || []
      },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    ).populate('breakfast lunch dinner');

    res.json(log);
  } catch (error) {
    console.error('Error saving daily log:', error);
    res.status(500).json({ error: 'Failed to save daily food log' });
  }
});

module.exports = router;
