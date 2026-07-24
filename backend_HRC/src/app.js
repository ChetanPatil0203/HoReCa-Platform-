const express = require('express');
const cors = require('cors');

// Specific Route Modules Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Direct Specific Base URL Mounting
app.use('/api/auth', authRoutes); // Handles /api/auth/register, /api/auth/login, etc.
app.use('/api/users', userRoutes); // Handles /api/users/profile, etc.

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HRC HUB API is running successfully',
    version: '1.0.0',
    baseUrls: {
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
