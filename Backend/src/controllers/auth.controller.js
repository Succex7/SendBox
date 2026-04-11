import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// Guard: ensure JWT_SECRET is defined at startup
if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Field presence check
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Email format check
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  // Password strength check
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Duplicate email check
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('Email already in use');
  }

  // Create user
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

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
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

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  // Explicitly exclude password as a safety net
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ data: user });
});