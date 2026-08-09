const notificationService = require('../services/notificationService');

// GET /api/notifications/user/:userId
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, type } = req.query;
    
    const filter = status || type;
    const result = await notificationService.getUserNotificationsService(userId, filter);
    return res.status(200).json({
      success: true,
      unreadCount: result.unreadCount,
      readCount: result.readCount,
      totalCount: result.totalCount,
      data: result.notifications,
    });
  } catch (error) {
    console.error('getUserNotifications Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications',
    });
  }
};

// PUT /api/notifications/mark-all-read/:userId
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await notificationService.markAllNotificationsAsReadService(userId);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: result.unreadCount,
      readCount: result.readCount,
      totalCount: result.totalCount,
      data: result.notifications,
    });
  } catch (error) {
    console.error('markAllAsRead Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
    });
  }
};

// PUT /api/notifications/:id/toggle-read
exports.toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await notificationService.toggleNotificationReadStatusService(id);
    return res.status(200).json({
      success: true,
      message: `Notification read status updated to ${notif.isRead}`,
      data: notif,
    });
  } catch (error) {
    console.error('toggleReadStatus Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notification status',
    });
  }
};

// PUT /api/notifications/:id/mark-unread
exports.markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await notificationService.toggleNotificationReadStatusService(id, false);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as unread',
      data: notif,
    });
  } catch (error) {
    console.error('markAsUnread Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as unread',
    });
  }
};

// POST /api/notifications
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, extraData } = req.body;
    const notif = await notificationService.createNotificationService({ userId, type, title, message, extraData });
    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notif,
    });
  } catch (error) {
    console.error('createNotification Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create notification',
    });
  }
};
