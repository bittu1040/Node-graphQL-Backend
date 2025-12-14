const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken } = require('../utils/jwt');

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  };
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: 'User registered' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken(user._id);

  res.cookie('token', token, cookieOptions());
  res.json({ message: 'Login successful' });
};

exports.logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
};

exports.dashboard = (req, res) => {
  res.json({
    message: 'Welcome to dashboard',
    userId: req.userId
  });
};
