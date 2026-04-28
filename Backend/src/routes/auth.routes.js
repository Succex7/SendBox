import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,   
  resetPassword,    
  verifyOtp,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);  
router.post('/reset-password', resetPassword);    
router.post('/verify-otp', verifyOtp);  

export default router;