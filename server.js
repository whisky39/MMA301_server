import dotenv from 'dotenv';
dotenv.config();

// Import lib
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParse from 'body-parser';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

// Import Route
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Connect DB
import connectDB from './config/db.js';
connectDB();

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET)

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Tạo đối tượng ứng dụng
const app = express();

// Cấu hình các middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParse.json());
app.use(cookieParser());

// Đăng ký các route
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cat', categoryRoutes);
app.use('/api/order', orderRoutes);

// Khởi động server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Running On PORT ${PORT} in ${process.env.NODE_ENV} Mode`.bgMagenta.white);
});
