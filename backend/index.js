const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'Backend is running', 
    database: dbStatus,
    env: {
      has_mongo: !!process.env.MONGO_URI,
      has_jwt: !!process.env.JWT_SECRET
    }
  });
});

const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// MongoDB Connection with improved handling for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB is connected on every request (important for Vercel)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
