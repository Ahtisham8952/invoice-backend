const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoice');
const authRoutes = require('./routes/auth');
const redirectRoutes = require('./routes/redirect');
const auth = require('./middleware/auth');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Invoice = require('./models/Invoice'); // Add this line to import the Invoice model

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
    
    await initializeAdmin();

    // Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'https://invoice-frontned.vercel.app'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json());

    // Add request logging
    app.use((req, res, next) => {
      console.log(`Incoming request: ${req.method} ${req.url}`);
      next();
    });

    // Test route
    app.get('/', (req, res) => {
      res.json({ message: 'Backend API is running' });
    });

    // Routes with /api prefix
    app.use('/api/auth', authRoutes);
    app.use('/api/invoices', auth, invoiceRoutes); // Keep the main invoice routes protected
    app.get('/api/invoices/:invoiceNumber', async (req, res) => { // Add unprotected route for viewing single invoice
      try {
        const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
        if (!invoice) {
          return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    
    // Redirect route without /api prefix
    app.use('/i', redirectRoutes);

    // Handle 404
    app.use((req, res) => {
      console.log(`404 Not Found: ${req.method} ${req.url}`);
      res.status(404).json({ message: 'Route not found' });
    });

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
