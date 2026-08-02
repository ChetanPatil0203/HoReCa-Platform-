const { User } = require('../models');

/**
 * Send push notification to Expo Push Notification API endpoint.
 * @param {string|string[]} pushTokens - Single push token or array of push tokens (e.g. ExponentPushToken[xxx])
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

module.exports = {
  sendPushNotification,
  sendNotificationToUser,
};
