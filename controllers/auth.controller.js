import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { createToken } from '../utils/jwt.js';

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  };
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: 'User registered' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken(user._id);

  res.cookie('token', token, cookieOptions());
  res.json({ message: 'Login successful' });
};

export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
};

export const dashboard = (req, res) => {
  res.json({
    message: 'Welcome to dashboard',
    userId: req.userId
  });
};

export const test = (req, res) => {
  res.json({ message: 'Test API is working!', timestamp: new Date().toISOString() });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
