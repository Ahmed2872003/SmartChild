const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const runSeeder = async (seedingCallback) => {
  try {
    await mongoose.connect(DB);
    console.log('Database connected successfully.');

    await seedingCallback();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = runSeeder;
