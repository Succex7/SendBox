// importing dotenv first to ensure environment variables are loaded before anything else
import './src/config/env.js';

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Global safety nets for unexpected errors in production
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 SendBox server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err.message);
    process.exit(1);
  });