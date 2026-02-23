const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Initialize database connection once at startup
let dbInitialized = false;

app.use('/api', async (req, res, next) => {
  try {
    if (!dbInitialized) {
      await connectDB();
      dbInitialized = true;
    }
    next();
  } catch (error) {
    console.error('Database connection failure:', error.message);
    res.status(503).json({ 
      message: 'Database temporarily unavailable', 
      error: 'Please try again in a moment'
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;