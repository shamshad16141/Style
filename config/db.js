const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
    const mongoURI = process.env.MONGODB_URI || (isProduction ? null : 'mongodb://localhost:27017/style');

    if (!mongoURI) {
      throw new Error('MONGODB_URI is required in production environment');
    }
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
