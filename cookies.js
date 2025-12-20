

import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// middleware to read cookies
app.use(cookieParser());

/**
 * Set a cookie
 */
app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'bittu', {
    maxAge: 60 * 1000, // 1 minute
    httpOnly: true
  });
  res.send('Cookie has been set');
});

/**
 * Read a cookie
 */
app.get('/get-cookie', (req, res) => {
  const username = req.cookies.username;
  res.send(`Cookie value: ${username}`);
});

/**
 * Clear a cookie
 */
app.get('/clear-cookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie cleared');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
