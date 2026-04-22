import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // For secure OTP generation
import bcrypt from 'bcryptjs'; //for password hashing and OTP hashing
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { sendOtpEmail } from '../services/email.service.js';

// Guard: ensure JWT_SECRET is defined at startup
if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

// Helpers 
// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Generate a cryptographically secure 6-digit OTP
 * crypto.randomInt is far more secure than Math.random for OTPs
 */
const generateOtp = () => String(crypto.randomInt(100000, 999999));

// Register

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(409);
    throw new Error('Email already in use');
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    message: 'Account created successfully',
    data: {
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        uniqueId: user.uniqueId,
      },
    },
  });
});

// Login

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    message: 'Login successful',
    data: {
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        uniqueId: user.uniqueId,
      },
    },
  });
});

//Get Current User 

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  // Explicitly exclude password as a safety net independent of middleware
  const user = await User.findById(req.user._id).select('-password -resetOtp -resetOtpExpiry -resetOtpAttempts');
  res.status(200).json({ data: user });
});

//Forgot Password

// @route POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // Prevent OTP spam — if a valid OTP already exists, block a new request
    // Use the same generic response so attacker can't confirm email exists
    const otpStillValid = user.resetOtpExpiry && user.resetOtpExpiry > Date.now();
    if (!otpStillValid) {
      // Only generate and send a new OTP if no valid one exists
      const otp = generateOtp();
      const hashedOtp = await bcrypt.hash(otp, 10);

      user.resetOtp = hashedOtp;
      user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      user.resetOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });

      // If email sending fails, roll back OTP fields so user can try again
      try {
        await sendOtpEmail(user.email, otp);
      } catch {
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.resetOtpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Failed to send reset email. Please try again.');
      }
    }
  }

  // Always return the same message — prevents email enumeration
  res.status(200).json({
    message: 'If an account with that email exists, a reset code has been sent.',
  });
});

//Reset Password 

// @route POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Email, OTP, and new password are required');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Same error for non-existent user and invalid OTP — no information leakage
  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    res.status(400);
    throw new Error('Invalid or expired reset code');
  }

  // Check expiry first — before attempt count
  if (user.resetOtpExpiry < Date.now()) {
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.resetOtpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    res.status(400);
    throw new Error('Reset code has expired. Please request a new one.');
  }

  // Brute force protection — check attempt count before comparing OTP
  if (user.resetOtpAttempts >= 5) {
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.resetOtpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    res.status(429);
    throw new Error('Too many failed attempts. Please request a new reset code.');
  }

  // Compare submitted OTP against stored hash
  const isOtpValid = await bcrypt.compare(String(otp), user.resetOtp);

  if (!isOtpValid) {
    user.resetOtpAttempts += 1;
    await user.save({ validateBeforeSave: false });

    res.status(400);
    throw new Error('Invalid reset code. Please check and try again.');
  }

  // Valid OTP — update password (pre-save hook hashes it) and clear all OTP fields
  user.password = newPassword;
  user.resetOtp = null;
  user.resetOtpExpiry = null;
  user.resetOtpAttempts = 0;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
});