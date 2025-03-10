const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoice');
const authRoutes = require('./routes/auth');
const redirectRoutes = require('./routes/redirect');
const auth = require('./middleware/auth');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Connect to MongoDB and initialize admin
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected');
    
    // Initialize admin user after DB connection
    await initializeAdmin();

    // Middleware
    app.use(cors({
      origin: [
        'http://localhost:5173',
        'https://invoice-frontned.vercel.app',
        'http://localhost:5000',
        'https://invoice-backend-ruddy.vercel.app'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/invoices', auth, invoiceRoutes); // Protected routes
    app.use('/i', redirectRoutes); // Short URL redirect route

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
