require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin if any
    await User.deleteOne({ username: 'admin' });
    console.log('✅ Deleted existing admin user');

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await User.create({
      username: 'admin',
      password: 'admin123', // Will be hashed by the pre-save middleware
      role: 'admin'
    });
    console.log('✅ Created new admin user');

    // Test password match
    const isMatch = await newAdmin.comparePassword('admin123');
    console.log('Password match test:', isMatch ? '✅ Success' : '❌ Failed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

resetAdmin();
