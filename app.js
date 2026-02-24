const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (no DB required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Initialize database connection once at startup
let dbInitialized = false;
let dbError = null;

// Try to connect immediately on startup
connectDB().then(() => {
  dbInitialized = true;
  dbError = null;
  console.log('🚀 Initial database connection successful');
}).catch(err => {
  dbError = err;
  console.error('⚠️ Initial DB connection failed, will retry on first request:', err.message);
});

app.use('/api', async (req, res, next) => {
  // Skip DB init for health check
  if (req.path === '/health') {
    return next();
  }
  
  try {
    if (!dbInitialized) {
      console.log('📡 Attempting database connection...');
      await connectDB();
      dbInitialized = true;
      dbError = null;
      console.log('✅ Database connected');
    }
    next();
  } catch (error) {
    console.error('❌ Database unavailable:', error.message);
    return res.status(503).json({ 
      message: 'Database temporarily unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
});

module.exports = app;
