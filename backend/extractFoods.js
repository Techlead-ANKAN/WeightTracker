require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

async function extractFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch all food items
    const foods = await Food.find({}).sort({ mealType: 1, name: 1 });
    
    console.log(`\n📊 Total food items in database: ${foods.length}\n`);
    
    // Group by meal type
    const groupedFoods = {
      breakfast: [],
      lunch: [],
      dinner: []
    };
    
    foods.forEach(food => {
      groupedFoods[food.mealType].push(food);
    });
    
    // Display foods by meal type
    for (const [mealType, items] of Object.entries(groupedFoods)) {
      console.log(`\n🍽️  ${mealType.toUpperCase()} (${items.length} items)`);
      console.log('='.repeat(60));
      items.forEach(food => {
        console.log(`  ID: ${food._id}`);
        console.log(`  Name: ${food.name}`);
        console.log(`  Portion: ${food.portionLabel}`);
        console.log(`  Grams: ${food.grams}g`);
        console.log('-'.repeat(60));
      });
    }
    
    // Export as JSON
    console.log('\n📄 Full JSON export:\n');
    console.log(JSON.stringify(foods, null, 2));
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

extractFoods();
