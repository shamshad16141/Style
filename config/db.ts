import mongoose from 'mongoose';

let isConnected = false;
let connectPromise: Promise<mongoose.Mongoose> | null = null;

const connectDB = async (): Promise<mongoose.Mongoose> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  if (mongoose.connection.readyState === 2 && connectPromise) {
    return connectPromise;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in environment variables!');
    }

    console.log('🔗 Connecting to MongoDB Atlas...');

    connectPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    const connection = await connectPromise;

    isConnected = true;
    console.log('✅ MongoDB connected successfully!');

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('error', (error: Error) => {
      console.error('❌ MongoDB connection error:', error.message);
      isConnected = false;
    });

    return connection;
  } catch (error) {
    const dbError = error as Error;
    console.error('❌ MongoDB connection failed:', dbError.message);
    isConnected = false;
    throw dbError;
  } finally {
    connectPromise = null;
  }
};

export default connectDB;