const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected and healthy, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }
  
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in environment variables!');
    }
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
      isConnected = false;
    });
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

module.exports = connectDB;

