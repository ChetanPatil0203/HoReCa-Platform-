const express = require('express');
const cors = require('cors');
const path = require('path');

// Specific Route Modules Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const manpowerRequirementRoutes = require('./routes/manpowerRequirementRoutes');
const marketingRequirementRoutes = require('./routes/marketingRequirementRoutes');
const serviceProviderRequirementRoutes = require('./routes/serviceProviderRequirementRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Direct Specific Base URL Mounting
app.use('/api/auth', authRoutes); // Handles /api/auth/register, /api/auth/login, etc.
app.use('/api/users', userRoutes); // Handles /api/users/profile, etc.
app.use('/api/admin', adminRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/requirements/manpower', manpowerRequirementRoutes);
app.use('/api/requirements/marketing', marketingRequirementRoutes);
app.use('/api/requirements/service-provider', serviceProviderRequirementRoutes);
app.use('/api/requirements', requirementRoutes);

// Root & API Health Check Route
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HRC HUB API is running successfully',
    version: '1.0.0',
    baseUrls: {
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
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
