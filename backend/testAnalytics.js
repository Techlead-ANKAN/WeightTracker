require('dotenv').config();
const axios = require('axios');
const dayjs = require('dayjs');

const BASE_URL = 'http://localhost:5000/api';

async function testAnalytics() {
  console.log('🧪 Testing Food Analytics API Endpoints\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Fetch range with data
    console.log('\n✓ Test 1: Fetch 7-day range');
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(7, 'days').format('YYYY-MM-DD');
    
    const response1 = await axios.get(`${BASE_URL}/daily-log/range`, {
      params: { start: startDate, end: endDate }
    });
    
    console.log(`  Status: ${response1.status}`);
    console.log(`  Data received: ${response1.data.length} logs`);
    
    if (response1.data.length > 0) {
      const firstLog = response1.data[0];
      console.log(`  Sample date: ${firstLog.date}`);
      console.log(`  Breakfast items: ${firstLog.breakfast?.length || 0}`);
      console.log(`  Lunch items: ${firstLog.lunch?.length || 0}`);
      console.log(`  Dinner items: ${firstLog.dinner?.length || 0}`);
    }
    
    // Test 2: Fetch range with no data (future dates)
    console.log('\n✓ Test 2: Fetch future range (should be empty)');
    const futureStart = dayjs().add(10, 'days').format('YYYY-MM-DD');
    const futureEnd = dayjs().add(20, 'days').format('YYYY-MM-DD');
    
    const response2 = await axios.get(`${BASE_URL}/daily-log/range`, {
      params: { start: futureStart, end: futureEnd }
    });
    
    console.log(`  Status: ${response2.status}`);
    console.log(`  Data received: ${response2.data.length} logs (expected: 0)`);
    
    // Test 3: Fetch 30-day range
    console.log('\n✓ Test 3: Fetch 30-day range');
    const endDate30 = dayjs().format('YYYY-MM-DD');
    const startDate30 = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    
    const response3 = await axios.get(`${BASE_URL}/daily-log/range`, {
      params: { start: startDate30, end: endDate30 }
    });
    
    console.log(`  Status: ${response3.status}`);
    console.log(`  Data received: ${response3.data.length} logs`);
    
    // Test 4: Missing parameters
    console.log('\n✓ Test 4: Missing parameters (should fail)');
    try {
      await axios.get(`${BASE_URL}/daily-log/range`, {
        params: { start: startDate }
      });
      console.log('  ❌ FAILED: Should have returned 400 error');
    } catch (error) {
      console.log(`  Status: ${error.response?.status} (expected: 400)`);
      console.log(`  Error message: ${error.response?.data?.error}`);
    }
    
    // Test 5: Verify data structure
    console.log('\n✓ Test 5: Verify data structure');
    if (response1.data.length > 0) {
      const log = response1.data[0];
      const hasRequiredFields = 
        log.date !== undefined &&
        log.breakfast !== undefined &&
        log.lunch !== undefined &&
        log.dinner !== undefined;
      
      const hasPopulatedFields = 
        log.breakfast.length === 0 || (log.breakfast[0].name !== undefined && log.breakfast[0].grams !== undefined);
      
      console.log(`  Has required fields: ${hasRequiredFields ? '✓' : '✗'}`);
      console.log(`  Fields are populated: ${hasPopulatedFields ? '✓' : '✗'}`);
      
      // Check if foods have all required properties
      if (log.breakfast.length > 0) {
        const food = log.breakfast[0];
        console.log('  Sample food item:');
        console.log(`    - ID: ${food._id}`);
        console.log(`    - Name: ${food.name}`);
        console.log(`    - Portion: ${food.portionLabel}`);
        console.log(`    - Grams: ${food.grams}`);
      }
    }
    
    // Calculate analytics metrics
    console.log('\n✓ Test 6: Calculate analytics metrics');
    if (response1.data.length > 0) {
      const logs = response1.data;
      
      // Total intake
      let totalBreakfast = 0, totalLunch = 0, totalDinner = 0;
      logs.forEach(log => {
        totalBreakfast += log.breakfast?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0;
        totalLunch += log.lunch?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0;
        totalDinner += log.dinner?.reduce((sum, f) => sum + (f.grams || 0), 0) || 0;
      });
      
      const grandTotal = totalBreakfast + totalLunch + totalDinner;
      const avgDaily = Math.round(grandTotal / logs.length);
      
      console.log(`  Total logs analyzed: ${logs.length} days`);
      console.log(`  Total intake: ${grandTotal}g`);
      console.log(`  Average daily: ${avgDaily}g`);
      console.log(`  Breakfast total: ${totalBreakfast}g (${((totalBreakfast/grandTotal)*100).toFixed(1)}%)`);
      console.log(`  Lunch total: ${totalLunch}g (${((totalLunch/grandTotal)*100).toFixed(1)}%)`);
      console.log(`  Dinner total: ${totalDinner}g (${((totalDinner/grandTotal)*100).toFixed(1)}%)`);
      
      // Top foods
      const foodFreq = {};
      logs.forEach(log => {
        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
          log[meal]?.forEach(food => {
            if (!foodFreq[food.name]) {
              foodFreq[food.name] = { count: 0, grams: 0 };
            }
            foodFreq[food.name].count++;
            foodFreq[food.name].grams += food.grams || 0;
          });
        });
      });
      
      const topFoods = Object.entries(foodFreq)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5);
      
      console.log('\n  Top 5 Foods:');
      topFoods.forEach(([name, data], index) => {
        console.log(`    ${index + 1}. ${name}: ${data.count}x (${data.grams}g total)`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAnalytics();
