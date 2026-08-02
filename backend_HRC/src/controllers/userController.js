const {
  getUserProfileService,
  updateUserProfileService,
} = require('../services/userService');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserProfileService(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found.',
    });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await updateUserProfileService(userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};

// GET /api/users/owner-dashboard/:ownerId
exports.getOwnerDashboardSummary = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { getOwnerMainDashboardSummary } = require('../services/userService');
    const data = await getOwnerMainDashboardSummary(ownerId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/push-token
exports.savePushToken = async (req, res) => {
  try {
    const { pushToken, userId: bodyUserId } = req.body;
    const userId = req.user?.id || bodyUserId;
    if (!pushToken) {
      return res.status(400).json({ success: false, message: 'pushToken is required.' });
    }
    const { User } = require('../models');
    if (userId) {
      await User.update({ pushToken }, { where: { id: userId } });
    }
    return res.status(200).json({ success: true, message: 'Push token saved successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to save push token.' });
  }
};
