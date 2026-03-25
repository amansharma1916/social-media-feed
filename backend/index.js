import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
console.log('Starting backend server...');
console.log('Loaded environment variables:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
  PORT: process.env.PORT || 5000
});
const app = express();
app.use(cors({
    origin: 'https://social-media-feed-livid.vercel.app'
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
