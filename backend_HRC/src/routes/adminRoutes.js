const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Administrative Verification Endpoints
router.put('/verify-registration', adminController.verifyRegistration);

// Superadmin Audit Endpoints
router.get('/horeca-registrations', adminController.getHorecaRegistrations);
router.get('/vendor-registrations', adminController.getVendorRegistrations);
router.get('/login-logs', adminController.getUserLoginLogs);

// Dashboard and Team Endpoints
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/team', adminController.getTeam);

// System Limits & Quotas Endpoints
router.get('/limits', adminController.getSystemLimits);
router.put('/limits', adminController.updateSystemLimits);

module.exports = router;
