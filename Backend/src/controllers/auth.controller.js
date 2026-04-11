import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// @route POST /api/auth/register
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(409).json({ message: 'Email already in use' });

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
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

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
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ data: req.user });
};