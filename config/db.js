const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  
  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      // Close existing connection if any
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
      const mongoURI = process.env.MONGODB_URI || (isProduction ? null : 'mongodb://localhost:27017/style');

      if (!mongoURI) {
        throw new Error('MONGODB_URI is required in production environment');
      }
      
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      });
      
      isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        console.log('❌ MongoDB disconnected');
        isConnected = false;
        connectionPromise = null;
      });
      
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error.message);
        isConnected = false;
        connectionPromise = null;
      });
      
      resolve(mongoose.connection);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      isConnected = false;
      connectionPromise = null;
      reject(error);
    }
  });
  
  return connectionPromise;
};

module.exports = connectDB;
