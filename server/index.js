import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import reviewRoutes from './routes/review.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import blogRoutes from './routes/blog.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import contactRoutes from './routes/contact.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  'https://inerrancy.vercel.app',
  'https://inerrancy.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5001',
];
// Allow additional origin from env (e.g. custom domain set later)
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
else app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Inerrancy API running 🏺' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🏺 Inerrancy server running on http://localhost:${PORT}`);
});
