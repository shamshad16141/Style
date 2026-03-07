import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function testConnection(): Promise<void> {
  console.log('🧪 Testing MongoDB Connection...');
  console.log('URI Format:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

  if (!process.env.MONGODB_URI) {
    console.error('❌ No MONGODB_URI in .env');
    return;
  }

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log('✅ Connected successfully!');
    console.log('Database:', mongoose.connection.db?.databaseName ?? 'unknown');
    await mongoose.disconnect();
    console.log('✅ Disconnected.');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Connection Error:', err.message);
    console.error('\nFull Error:');
    console.error(err);
    process.exit(1);
  }
}

void testConnection();