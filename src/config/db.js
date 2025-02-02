const mongoose = require('mongoose');
require('dotenv').config();

console.log("MONGODB_CLUSTER:", process.env.MONGODB_CLUSTER);

const user = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB_NAME;
const options = process.env.MONGODB_OPTIONS ? `?${process.env.MONGODB_OPTIONS}` : '';

if (!cluster) {
  console.error("MONGODB_CLUSTER не загружен из .env");
  process.exit(1);
}

const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}${options}`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
