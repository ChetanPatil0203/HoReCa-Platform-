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
