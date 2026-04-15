import express from 'express';
import {
  sendRequest,
  respondToRequest,
  getConnections,
  getPendingRequests,
} from '../controllers/connection.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All connection routes require auth

router.post('/request', sendRequest);
router.patch('/:id/respond', respondToRequest);
router.get('/', getConnections);
router.get('/requests', getPendingRequests);

export default router;