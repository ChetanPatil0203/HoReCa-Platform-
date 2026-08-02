const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected User Profile Routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Owner Dashboard Summary Route
router.get('/owner-dashboard/:ownerId', userController.getOwnerDashboardSummary);

// Push Token Registration Route
router.post('/push-token', userController.savePushToken);

module.exports = router;
