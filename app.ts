import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

let dbInitialized = false;

connectDB()
  .then(() => {
    dbInitialized = true;
    console.log('🚀 Initial database connection successful');
  })
  .catch((err: Error) => {
    console.error('⚠️ Initial DB connection failed, will retry on first request:', err.message);
  });

app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health') {
    return next();
  }

  try {
    if (mongoose.connection.readyState === 1) {
      dbInitialized = true;
      return next();
    }

    if (!dbInitialized) {
      console.log('📡 Attempting database connection...');
      await connectDB();
      dbInitialized = true;
      console.log('✅ Database connected');
    }
    next();
  } catch (error) {
    const dbError = error as Error;
    console.error('❌ Database unavailable:', dbError.message);
    return res.status(503).json({
      message: 'Database temporarily unavailable',
      details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
    });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

export default app;