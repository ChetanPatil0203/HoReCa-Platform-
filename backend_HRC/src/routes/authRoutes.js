const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Public/Admin Inspection Routes for Collective Tables
router.get('/horeca-registrations', authController.getHorecaRegistrations);
router.get('/vendor-registrations', authController.getVendorRegistrations);
router.get('/login-logs', authController.getUserLoginLogs);

// Protected Auth Routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/verify-otp', authMiddleware, authController.verifyOTP);
router.post('/resend-otp', authMiddleware, authController.resendOTP);

module.exports = router;
