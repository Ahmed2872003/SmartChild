const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);

    console.log('connected to database...');
  } catch (err) {
    console.log('Error while connecting to DB');

    console.error(err);
  }
};

module.exports = connectDB;
