import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import fileRoutes from './routes/file.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'SendBox API is live ✅' }));

export default app;