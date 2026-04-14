import express from 'express';
import cors from 'cors';

// No dotenv.config() here — server.js handles it as the entry point
import authRoutes from './routes/auth.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import fileRoutes from './routes/file.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

// Middleware

// CORS — validate CLIENT_ORIGIN is set, fall back to nothing if missing
const allowedOrigin = process.env.CLIENT_ORIGIN;
if (!allowedOrigin) {
  console.warn('⚠️  CLIENT_ORIGIN is not set — CORS may block all requests');
}

app.use(cors({
  origin: allowedOrigin || false, // false = block all origins if not set
  credentials: true,
}));

// Cap JSON payload size to prevent large payload attacks
app.use(express.json({ limit: '10mb' }));

// Cap URL-encoded payload size too
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check 
app.get('/', (req, res) => res.json({ message: 'SendBox API is live ✅' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Handler 
// Catches requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler 
// asyncHandler throws errors here - returns clean JSON instead of HTML
app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development, never in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;