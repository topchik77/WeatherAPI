const mongoose = require('mongoose');

const user = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB_NAME;
const options = process.env.MONGODB_OPTIONS;

const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}${options}`;

const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB with Mongoose');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
