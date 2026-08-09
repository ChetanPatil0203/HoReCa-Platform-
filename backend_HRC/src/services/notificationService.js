const { User, Notification, VendorRegistration, HorecaRegistration, Order } = require('../models');

/**
 * Send push notification to Expo Push Notification API endpoint.
 * @param {string|string[]} pushTokens - Single push token or array of push tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} [data={}] - Custom payload data object
 */
const sendPushNotification = async (pushTokens, title, body, data = {}) => {
  if (!pushTokens) return;

  const tokens = Array.isArray(pushTokens) ? pushTokens.filter(Boolean) : [pushTokens].filter(Boolean);
  if (tokens.length === 0) return;

  const validTokens = tokens.filter(t => typeof t === 'string' && (t.startsWith('ExponentPushToken') || t.startsWith('ExpoPushToken') || t.length > 10));
  if (validTokens.length === 0) return;

  const messages = validTokens.map(token => ({
    to: token,
    sound: 'default',
    title: title || 'HRC Platform Notification',
    body: body || '',
    data: data || {},
    _displayInForeground: true,
  }));

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const resJson = await response.json();
    console.log('[PushNotificationService] Push notification dispatched:', resJson);
    return resJson;
  } catch (error) {
    console.error('[PushNotificationService] Failed to send push notification:', error.message);
  }
};

/**
 * Send notification to a specific user by userId
 */
const sendNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findByPk(userId);
    if (user && user.pushToken) {
      return await sendPushNotification(user.pushToken, title, body, data);
    }
  } catch (err) {
    console.warn('[PushNotificationService] sendNotificationToUser error:', err.message);
  }
};

/**
 * Create a new notification record in the database
 */
const createNotificationService = async ({ userId, type = 'Orders', title, message, extraData = null }) => {
  try {
    if (!userId || !title || !message) {
      throw new Error('userId, title, and message are required');
    }
    const notif = await Notification.create({
      userId,
      type: ['Orders', 'Alerts', 'System', 'General'].includes(type) ? type : 'Orders',
      title,
      message,
      isRead: false,
      extraData,
    });
    
    // Also trigger push notification in background
    sendNotificationToUser(userId, title, message, { notificationId: notif.id, ...extraData }).catch(() => {});

    return notif;
  } catch (err) {
    console.error('[NotificationService] createNotification error:', err.message);
    throw err;
  }
};

/**
 * Fetch all notifications for a specific user, with status filter ('All', 'Unread', 'Read' / 'Marked as Read').
 * Automatically syncs live orders into PostgreSQL notifications table if empty.
 */
const getUserNotificationsService = async (userId, statusFilter = null) => {
  try {
    // 1. Check if user has notifications in DB. If empty, auto-sync from Orders into PostgreSQL Notification table
    const countExisting = await Notification.count({ where: { userId } });
    if (countExisting === 0) {
      const vendor = await VendorRegistration.findOne({ where: { userId } });
      const horeca = await HorecaRegistration.findOne({ where: { userId } });

      let orders = [];
      if (vendor) {
        orders = await Order.findAll({
          where: { supplierId: vendor.id },
          include: [{ model: HorecaRegistration, as: 'owner', attributes: ['bizName'] }],
          order: [['createdAt', 'DESC']],
        });
      } else if (horeca) {
        orders = await Order.findAll({
          where: { ownerId: horeca.id },
          include: [{ model: VendorRegistration, as: 'supplier', attributes: ['bizName'] }],
          order: [['createdAt', 'DESC']],
        });
      }

      if (orders && orders.length > 0) {
        const notifsToCreate = orders.map(ord => {
          const statusLabel = ord.status === 'confirmed' ? 'Order Confirmed' : ord.status === 'processing' ? 'Order processing' : ord.status === 'packed' ? 'Order packed' : ord.status === 'shipped' ? 'Out for Delivery' : ord.status === 'delivered' ? 'Order Delivered' : `Order ${ord.status}`;
          const shortId = (ord.id || '').toString().slice(-4).toUpperCase();
          const clientName = ord.owner?.bizName || ord.supplier?.bizName || 'Chetan Cafe';

          return {
            userId,
            type: 'Orders',
            title: `New Order Update: #${shortId}`,
            message: `Customer ${clientName} placed an order worth ₹${parseFloat(ord.totalAmount || 0).toLocaleString('en-IN')}. Status: ${statusLabel}.`,
            isRead: ord.status === 'delivered',
            extraData: { orderId: ord.id },
            createdAt: ord.createdAt,
          };
        });
        await Notification.bulkCreate(notifsToCreate);
      }
    }

    const where = { userId };
    
    if (statusFilter === 'Unread') {
      where.isRead = false;
    } else if (statusFilter === 'Read' || statusFilter === 'Marked as Read') {
      where.isRead = true;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    const unreadCount = await Notification.count({
      where: { userId, isRead: false },
    });

    const readCount = await Notification.count({
      where: { userId, isRead: true },
    });

    const totalCount = await Notification.count({
      where: { userId },
    });

    return {
      notifications,
      unreadCount,
      readCount,
      totalCount,
    };
  } catch (err) {
    console.error('[NotificationService] getUserNotifications error:', err.message);
    throw err;
  }
};

/**
 * Mark all notifications as read for a user
 */
const markAllNotificationsAsReadService = async (userId) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    return await getUserNotificationsService(userId);
  } catch (err) {
    console.error('[NotificationService] markAllAsRead error:', err.message);
    throw err;
  }
};

/**
 * Toggle or explicitly update read status of a single notification
 */
const toggleNotificationReadStatusService = async (id, targetStatus = null) => {
  try {
    const notif = await Notification.findByPk(id);
    if (!notif) throw new Error('Notification not found');

    const newStatus = targetStatus !== null ? Boolean(targetStatus) : !notif.isRead;
    notif.isRead = newStatus;
    await notif.save();

    return notif;
  } catch (err) {
    console.error('[NotificationService] toggleReadStatus error:', err.message);
    throw err;
  }
};

module.exports = {
  sendPushNotification,
  sendNotificationToUser,
  createNotificationService,
  getUserNotificationsService,
  markAllNotificationsAsReadService,
  toggleNotificationReadStatusService,
};
