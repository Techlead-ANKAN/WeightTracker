require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('../models/Food');

// Exact food master data as specified in requirements
const foodMasterData = [
  // BREAKFAST ITEMS
  {
    "_id": "bf_bread_2",
    "name": "Bread",
    "portionLabel": "2 slices",
    "grams": 59,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_peanut_butter",
    "name": "Peanut Butter",
    "portionLabel": "1 tablespoon",
    "grams": 17,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_boiled_egg",
    "name": "Boiled Egg",
    "portionLabel": "1 whole",
    "grams": 50,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_omelette",
    "name": "Omelette",
    "portionLabel": "1 egg",
    "grams": 50,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_roti_2",
    "name": "Roti",
    "portionLabel": "2 medium",
    "grams": 80,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_dal",
    "name": "Dal",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "breakfast"
  },
  {
    "_id": "bf_sabji",
    "name": "Sabji (Vegetables)",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "breakfast"
  },
  
  // LUNCH ITEMS
  {
    "_id": "ln_rice_1cup",
    "name": "Cooked Rice",
    "portionLabel": "1 cup",
    "grams": 170,
    "mealType": "lunch"
  },
  {
    "_id": "ln_mixed_rice",
    "name": "Mixed Rice",
    "portionLabel": "1 medium bowl",
    "grams": 350,
    "mealType": "lunch"
  },
  {
    "_id": "ln_khichdi",
    "name": "Khichdi",
    "portionLabel": "1 medium bowl",
    "grams": 300,
    "mealType": "lunch"
  },
  {
    "_id": "ln_dal",
    "name": "Dal",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "lunch"
  },
  {
    "_id": "ln_sabji",
    "name": "Sabji (Vegetables)",
    "portionLabel": "1–2 bowls",
    "grams": 200,
    "mealType": "lunch"
  },
  {
    "_id": "ln_fish_fry",
    "name": "Fish Fry",
    "portionLabel": "1 piece",
    "grams": 100,
    "mealType": "lunch"
  },
  {
    "_id": "ln_fish_curry",
    "name": "Fish Curry",
    "portionLabel": "1 piece with gravy",
    "grams": 120,
    "mealType": "lunch"
  },
  {
    "_id": "ln_chicken_curry",
    "name": "Chicken Curry",
    "portionLabel": "1 medium bowl",
    "grams": 150,
    "mealType": "lunch"
  },
  {
    "_id": "ln_chicken_fry",
    "name": "Chicken Fry",
    "portionLabel": "3–4 small pieces",
    "grams": 120,
    "mealType": "lunch"
  },
  {
    "_id": "ln_egg_curry",
    "name": "Egg Curry",
    "portionLabel": "2 eggs with gravy",
    "grams": 120,
    "mealType": "lunch"
  },
  {
    "_id": "ln_boiled_egg",
    "name": "Boiled Egg",
    "portionLabel": "1 whole",
    "grams": 50,
    "mealType": "lunch"
  },
  {
    "_id": "ln_paneer_sabji",
    "name": "Paneer Sabji",
    "portionLabel": "1 medium bowl",
    "grams": 100,
    "mealType": "lunch"
  },
  {
    "_id": "ln_curd",
    "name": "Curd (Doi)",
    "portionLabel": "1 small bowl",
    "grams": 100,
    "mealType": "lunch"
  },
  {
    "_id": "ln_salad",
    "name": "Salad",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "lunch"
  },

  // DINNER ITEMS
  {
    "_id": "dn_roti_3",
    "name": "Roti",
    "portionLabel": "3 medium",
    "grams": 120,
    "mealType": "dinner"
  },
  {
    "_id": "dn_dal",
    "name": "Dal",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "dinner"
  },
  {
    "_id": "dn_sabji",
    "name": "Sabji (Vegetables)",
    "portionLabel": "1–2 bowls",
    "grams": 200,
    "mealType": "dinner"
  },
  {
    "_id": "dn_fish_curry",
    "name": "Fish Curry",
    "portionLabel": "1 piece with gravy",
    "grams": 100,
    "mealType": "dinner"
  },
  {
    "_id": "dn_chicken_curry",
    "name": "Chicken Curry",
    "portionLabel": "1 small bowl",
    "grams": 120,
    "mealType": "dinner"
  },
  {
    "_id": "dn_egg_curry",
    "name": "Egg Curry",
    "portionLabel": "1–2 eggs with gravy",
    "grams": 100,
    "mealType": "dinner"
  },
  {
    "_id": "dn_boiled_egg",
    "name": "Boiled Egg",
    "portionLabel": "1 whole",
    "grams": 50,
    "mealType": "dinner"
  },
  {
    "_id": "dn_paneer_sabji",
    "name": "Paneer Sabji",
    "portionLabel": "1 small bowl",
    "grams": 80,
    "mealType": "dinner"
  },
  {
    "_id": "dn_curd",
    "name": "Curd (Doi)",
    "portionLabel": "1 small bowl",
    "grams": 80,
    "mealType": "dinner"
  },
  {
    "_id": "dn_salad",
    "name": "Salad",
    "portionLabel": "1 bowl",
    "grams": 150,
    "mealType": "dinner"
  }
];

async function seedFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing food data
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing food data');

    // Insert food master data
    await Food.insertMany(foodMasterData);
    console.log(`✅ Successfully seeded ${foodMasterData.length} food items`);

    // Verify the data
    const count = await Food.countDocuments();
    console.log(`📊 Total food items in database: ${count}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding food data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedFoods();
