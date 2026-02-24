const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // If already connected and healthy, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }
  
  // If connection is in progress, wait for it
  if (connectionPromise) {
    console.log('⏳ Waiting for in-progress MongoDB connection...');
    return connectionPromise;
  }

  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      // Ensure we start fresh
      if (mongoose.connection.readyState !== 0) {
        console.log('🔄 Closing existing connection...');
        await mongoose.disconnect();
      }

      const mongoURI = process.env.MONGODB_URI;
      
      if (!mongoURI) {
        throw new Error(
          '❌ MONGODB_URI not found! ' +
          'Make sure to add it in Vercel Settings > Environment Variables'
        );
      }
      
      console.log('🔗 Attempting MongoDB connection...');
      console.log('📍 Database:', mongoURI.includes('style') ? 'style ✓' : 'unknown ✗');
      
      const connection = await mongoose.connect(mongoURI, {
        // Aggressive timeouts for serverless
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        maxPoolSize: 5,
        minPoolSize: 1,
        maxIdleTimeMS: 10000,
        bufferCommands: false,
        bufferMaxEntries: 0,
        retryWrites: true,
        w: 'majority',
      });
      
      isConnected = true;
      console.log('✅ MongoDB connected successfully!');
      
      // Handle disconnection
      mongoose.connection.on('disconnected', () => {
        console.log('❌ MongoDB disconnected');
        isConnected = false;
        connectionPromise = null;
      });
      
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB error:', error.message);
        isConnected = false;
        connectionPromise = null;
      });
      
      resolve(connection);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      isConnected = false;
      connectionPromise = null;
      reject(error);
    }
  });
  
  return connectionPromise;
};

module.exports = connectDB;

