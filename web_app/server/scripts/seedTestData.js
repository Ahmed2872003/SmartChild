const Test = require('../models/test');
const Category = require('../models/category');
const TestDesc = require('../models/testDesc');

const { categoryMap, testsDescription } = require('../models/db/seedData');
const runSeeder = require('./seeder');

const syncTestConfigData = async () => {
  console.log('Syncing categories, tests, and config data...');

  for (const categoryData of categoryMap) {
    // 1. Upsert Category: Update if it exists, create if it doesn't
    const category = await Category.findOneAndUpdate(
      { name: categoryData.title }, // The query to find it
      {
        $set: {
          name: categoryData.title,
          description: categoryData.description,
        },
      },
      { new: true, upsert: true }, // 'new' returns the document, 'upsert' creates it if missing
    );

    for (const testData of categoryData.tests) {
      // 2. Upsert Test: Update if it exists, create if it doesn't
      const test = await Test.findOneAndUpdate(
        { name: testData.title },
        {
          $set: {
            name: testData.title,
            description: testData.description,
            category_id: category._id,
          },
        },
        { new: true, upsert: true },
      );

      // 3. Upsert Configurations (TestDesc)
      const testConfigData = testsDescription[testData.title];

      if (testConfigData) {
        const difficulties = ['easy', 'medium', 'hard'];

        for (const difficulty of difficulties) {
          if (testConfigData[difficulty]) {
            await TestDesc.updateOne(
              { test_id: test._id, difficulty: difficulty },
              { $set: { config: testConfigData[difficulty] } },
              { upsert: true },
            );
          }
        }
      } else {
        console.log(`Warning: No config found for test "${testData.title}".`);
      }
    }
  }

  console.log('Sync complete! New data created, existing data updated safely.');
};

runSeeder(syncTestConfigData);
