require('dotenv').config({ path: '../.env' });
const connectDB = require('./config/db');

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Test the connection
connectDB()
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Connection error:', error);
    process.exit(1);
  });
