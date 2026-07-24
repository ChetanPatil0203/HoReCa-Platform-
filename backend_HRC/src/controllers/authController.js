const {
  registerService,
  loginService,
  verifyOTPService,
  resendOTPService,
  getHorecaRegistrationsService,
  getVendorRegistrationsService,
  getUserLoginLogsService,
} = require('../services/authService');
const { getUserProfileService } = require('../services/userService');

// Register User
exports.register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent for security verification.',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed.',
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const result = await loginService(email, password, clientIp);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials.',
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP is required.' });
    }

    const result = await verifyOTPService(userId, otp);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'OTP verification failed.',
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await resendOTPService(userId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to resend OTP.',
    });
  }
};

// Get Current Authenticated User (GET /api/auth/me)
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfileService(userId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Profile not found.',
    });
  }
};

// GET /api/auth/horeca-registrations - Fetch all HoReCa registrations
exports.getHorecaRegistrations = async (req, res) => {
  try {
    const registrations = await getHorecaRegistrationsService();
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch HoReCa registrations.',
    });
  }
};

// GET /api/auth/vendor-registrations - Fetch all Vendor registrations
exports.getVendorRegistrations = async (req, res) => {
  try {
    const registrations = await getVendorRegistrationsService();
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Vendor registrations.',
    });
  }
};

// GET /api/auth/login-logs - Fetch collective common logins table for all users
exports.getUserLoginLogs = async (req, res) => {
  try {
    const logs = await getUserLoginLogsService();
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user login logs.',
    });
  }
};
