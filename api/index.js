const serverless = require('serverless-http');
const app = require('../app');

// Ensure environment is set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('🚀 API Handler initialized. NODE_ENV:', process.env.NODE_ENV);
console.log('📍 MONGODB_URI configured:', !!process.env.MONGODB_URI ? '✅ Yes' : '❌ No');

module.exports = serverless(app);