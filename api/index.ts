import serverless from 'serverless-http';
import app from '../app';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('🚀 API Handler initialized. NODE_ENV:', process.env.NODE_ENV);
console.log('📍 MONGODB_URI configured:', process.env.MONGODB_URI ? '✅ Yes' : '❌ No');

const handler = serverless(app);

export = handler;