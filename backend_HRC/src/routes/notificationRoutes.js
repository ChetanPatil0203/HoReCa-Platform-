const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Fetch notifications for a user (with optional ?type=Filter)
router.get('/user/:userId', notificationController.getUserNotifications);

// Mark all as read for a user
router.put('/mark-all-read/:userId', notificationController.markAllAsRead);

// Toggle single notification read status
router.put('/:id/toggle-read', notificationController.toggleReadStatus);

// Mark single notification as unread
router.put('/:id/mark-unread', notificationController.markAsUnread);

// Create new notification
router.post('/', notificationController.createNotification);

module.exports = router;
