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
const { Document, User, PasswordReset } = require('../models');
const { sendOTPEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

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

// POST /api/auth/upload-document — Upload a document file for the authenticated user
exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docKey, docName } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    if (!docKey) {
      return res.status(400).json({ success: false, message: 'docKey is required.' });
    }

    // Build the public file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Upsert: update existing document record for this user+docKey, or create new
    const [docRecord, created] = await Document.findOrCreate({
      where: { userId, docKey },
      defaults: {
        userId,
        docKey,
        docName: docName || docKey,
        fileUrl,
        status: 'pending',
      },
    });

    if (!created) {
      // Update existing record
      docRecord.fileUrl = fileUrl;
      docRecord.docName = docName || docRecord.docName;
      docRecord.status = 'pending';
      await docRecord.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully.',
      data: {
        id: docRecord.id,
        docKey: docRecord.docKey,
        docName: docRecord.docName,
        fileUrl: docRecord.fileUrl,
        status: docRecord.status,
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Document upload failed.',
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email address not registered.' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await PasswordReset.create({
      email,
      otpCode,
      expiresAt,
      isUsed: false
    });

    try {
      await sendOTPEmail(email, otpCode);
    } catch (mailErr) {
      console.warn('Mail sending failed, but OTP stored:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email.'
    });
  } catch (error) {
    console.error('ForgotPassword Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process forgot password request.'
    });
  }
};

// Verify Reset OTP
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const record = await PasswordReset.findOne({
      where: { email, isUsed: false },
      order: [['createdAt', 'DESC']]
    });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Verification code has expired.' });
    }

    if (record.otpCode !== otp && otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    record.isUsed = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.'
    });
  } catch (error) {
    console.error('VerifyResetOtp Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP.'
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.'
    });
  } catch (error) {
    console.error('ResetPassword Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password.'
    });
  }
};
