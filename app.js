const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database connection once at startup
let dbInitialized = false;

app.use('/api', async (req, res, next) => {
  try {
    if (!dbInitialized) {
      console.log('📡 Initializing database connection...');
      await connectDB();
      dbInitialized = true;
      console.log('✅ Database initialized');
    }
    next();
  } catch (error) {
    console.error('❌ Database connection failure:', error.message);
    res.status(503).json({ 
      message: 'Database temporarily unavailable', 
      error: error.message
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
