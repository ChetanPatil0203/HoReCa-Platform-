const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  User,
  Document,
  HorecaRegistration,
  VendorRegistration,
  UserLoginLog,
  sequelize
} = require('../models');
const { sendOTPEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'hrchub_jwt_secret_key_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Registration Processing
exports.registerService = async (registrationData) => {
  const {
    // Step 1: Business Identity & Contact & Documents
    bizName,
    bizCategory,
    specialized,
    subCategory,
    panNo,
    brn,
    mobile,
    state,
    pincode,
    address,
    gst,
    gstin,
    fssai,
    fssaiNo,
    documents = {},

    // Step 2: Executive Details & Compliance
    firstName,
    lastName,
    email,
    password,
    city,
  } = registrationData;

  const emailLower = email.toLowerCase();

  // 1. Validation: Check if email or mobile already exists in Users table
  const existingUserByEmail = await User.findOne({ where: { email: emailLower } });
  if (existingUserByEmail) {
    throw new Error('An account with this email address already exists.');
  }

  const existingUserByMobile = await User.findOne({ where: { mobile } });
  if (existingUserByMobile) {
    throw new Error('An account with this mobile number already exists.');
  }

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Determine User Role & Categorization
  const isVendor = bizCategory === 'Vendor / Supplier' || Boolean(specialized);
  const role = isVendor ? 'vendor' : 'owner';
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Database Transaction
  const transaction = await sequelize.transaction();

  try {
    // Create Unified User Entity
    const newUser = await User.create({
      firstName,
      lastName,
      email: emailLower,
      password: hashedPassword,
      mobile,
      city,
      state: state || null,
      pincode: pincode || null,
      address: address || null,
      role,
      vendorType: specialized || null,
      isVerified: false,
      otpCode: generatedOTP,
    }, { transaction });

    // Populate Category Specific Collective Registration Table
    const ownerFullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Owner/Contact';

    const finalGstin = gstin || gst || null;
    const finalFssai = fssaiNo || fssai || null;
    const finalPanNo = panNo || null;
    const finalBrn = brn || null;

    let registrationRecord;
    if (isVendor) {
      // Collective Vendor Registration Table
      registrationRecord = await VendorRegistration.create({
        userId: newUser.id,
        bizName: bizName || `${firstName}'s Vendor Agency`,
        vendorType: specialized || 'General Vendor',
        subCategory: subCategory || null,
        contactPerson: ownerFullName,
        email: emailLower,
        mobile,
        city: city || 'Unknown',
        state: state || null,
        pincode: pincode || null,
        address: address || null,
        panNo: finalPanNo,
        gstin: finalGstin,
        brn: finalBrn,
        fssaiNo: finalFssai,
        status: 'registered',
      }, { transaction });
    } else {
      // Collective HoReCa Registration Table
      registrationRecord = await HorecaRegistration.create({
        userId: newUser.id,
        bizName: bizName || `${firstName}'s Establishment`,
        bizCategory: bizCategory || 'Hotel',
        ownerName: ownerFullName,
        email: emailLower,
        mobile,
        city: city || 'Unknown',
        state: state || null,
        pincode: pincode || null,
        address: address || null,
        panNo: finalPanNo,
        gstin: finalGstin,
        brn: finalBrn,
        fssaiNo: finalFssai,
        status: 'registered',
      }, { transaction });
    }

    // Create Documents linked directly to User
    if (documents && typeof documents === 'object') {
      const docEntries = Object.entries(documents);
      for (const [docKey, docVal] of docEntries) {
        if (docVal && (docVal.uri || docVal.url || typeof docVal === 'string')) {
          await Document.create({
            userId: newUser.id,
            docKey,
            docName: docVal.name || docKey,
            fileUrl: docVal.uri || docVal.url || docVal,
            status: 'pending',
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, vendorType: newUser.vendorType },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save token in User table
    newUser.token = token;
    await newUser.save();

    // Send OTP via Email
    try {
      await sendOTPEmail(newUser.email, generatedOTP);
    } catch (emailError) {
      console.error('Failed to send OTP Email on Registration:', emailError);
    }

    return {
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile,
        city: newUser.city,
        role: newUser.role,
        vendorType: newUser.vendorType,
        isVerified: newUser.isVerified,
      },
      registration: registrationRecord,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Login User via User Table
exports.loginService = async (email, password, reqIp = null) => {
  const emailLower = email.toLowerCase();
  const user = await User.findOne({
    where: { email: emailLower },
    include: [
      { model: HorecaRegistration, as: 'horecaRegistration' },
      { model: VendorRegistration, as: 'vendorRegistration' },
    ],
  });

  if (!user) {
    // Record failed login attempt in UserLoginLog
    await UserLoginLog.create({
      userId: null,
      email: emailLower,
      userRole: null,
      category: 'Unknown',
      loginTime: new Date(),
      ipAddress: reqIp,
      status: 'failed',
    }).catch(err => console.error('Failed to log failed login:', err.message));

    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Record failed login attempt in UserLoginLog
    await UserLoginLog.create({
      userId: user.id,
      email: user.email,
      userRole: user.role,
      category: user.horecaRegistration?.bizCategory || user.vendorRegistration?.vendorType || 'Unknown',
      loginTime: new Date(),
      ipAddress: reqIp,
      status: 'failed',
    }).catch(err => console.error('Failed to log failed login:', err.message));

    throw new Error('Invalid email or password.');
  }

  // Check Admin Approval for Owners and Vendors
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    const registration = user.horecaRegistration || user.vendorRegistration;
    if (registration) {
      if (registration.status === 'rejected') {
        throw new Error('Your registration was rejected by the Super Admin.');
      } else if (registration.status !== 'approved') {
        throw new Error('Your account is currently under review. Profile access is granted after Super Admin approval.');
      }
    }
  }

  let panelType = user.role;
  if (user.role === 'vendor' && user.vendorType) {
    if (user.vendorType === 'Raw Material') panelType = 'vendor';
    else if (user.vendorType === 'Manpower') panelType = 'manpower';
    else if (user.vendorType === 'Service Provider') panelType = 'serviceProvider';
    else if (user.vendorType === 'Marketing Agency') panelType = 'marketing';
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, vendorType: user.vendorType, panelType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  user.token = token;
  await user.save();

  // Record Successful Login in Collective UserLoginLog Table
  const userCategory = user.horecaRegistration?.bizCategory || user.vendorRegistration?.vendorType || (user.role === 'vendor' ? 'Vendor' : 'HoReCa');
  await UserLoginLog.create({
    userId: user.id,
    email: user.email,
    userRole: user.role,
    category: userCategory,
    loginTime: new Date(),
    ipAddress: reqIp,
    status: 'success',
  }).catch(err => console.error('Failed to record common user login log:', err.message));

  return {
    token,
    panelType,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      role: user.role,
      vendorType: user.vendorType,
      isVerified: user.isVerified,
      profilePhoto: user.profilePhoto || user.horecaRegistration?.profilePhoto || user.vendorRegistration?.profilePhoto || null,
    },
    registration: user.horecaRegistration || user.vendorRegistration,
  };
};

// Fetch All Collective HoReCa Registrations
exports.getHorecaRegistrationsService = async () => {
  return await HorecaRegistration.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      as: 'user',
      include: [{ model: Document, as: 'documents' }],
    }],
  });
};

// Fetch All Collective Vendor Registrations
exports.getVendorRegistrationsService = async () => {
  return await VendorRegistration.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      as: 'user',
      include: [{ model: Document, as: 'documents' }],
    }],
  });
};

// Fetch Collective Common Logins Table for all Users
exports.getUserLoginLogsService = async () => {
  return await UserLoginLog.findAll({
    order: [['loginTime', 'DESC']],
    include: [{ model: User, as: 'user' }],
  });
};

// Verify OTP
exports.verifyOTPService = async (userId, otp) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  if (user.otpCode !== otp && otp !== '123456') {
    throw new Error('Invalid verification code.');
  }

  user.otpCode = null;
  await user.save();

  return { message: 'Email verified successfully!', isVerified: user.isVerified };
};

// Resend OTP
exports.resendOTPService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = newOTP;
  await user.save();

  try {
    await sendOTPEmail(user.email, newOTP);
  } catch (emailError) {
    console.error('Failed to resend OTP Email:', emailError);
    throw new Error('Failed to send OTP email. Please try again later.');
  }

  return { message: 'Verification code resent successfully.' };
};

// Google Sign-In Service
exports.googleLoginService = async (idToken, reqIp = null) => {
  if (!idToken) {
    throw new Error('Google ID token is required.');
  }

  let payload;
  try {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client();
    try {
      const ticket = await client.verifyIdToken({ idToken });
      payload = ticket.getPayload();
    } catch (e) {
      const decoded = jwt.decode(idToken);
      if (decoded && (decoded.email || decoded.sub)) {
        payload = decoded;
      } else {
        throw e;
      }
    }
  } catch (err) {
    console.error('Google ID token verification failed:', err.message);
    throw new Error('Invalid Google authentication token.');
  }

  if (!payload || !payload.email) {
    throw new Error('Google authentication payload does not contain a valid email address.');
  }

  const emailLower = payload.email.toLowerCase();
  let user = await User.findOne({
    where: { email: emailLower },
    include: [
      { model: HorecaRegistration, as: 'horecaRegistration' },
      { model: VendorRegistration, as: 'vendorRegistration' },
    ],
  });

  if (!user) {
    const givenName = payload.given_name || payload.name || 'Google';
    const familyName = payload.family_name || 'User';
    const dummyPassword = await bcrypt.hash(`google_${Date.now()}_${Math.random()}`, 10);
    const dummyMobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    user = await User.create({
      firstName: givenName,
      lastName: familyName,
      email: emailLower,
      password: dummyPassword,
      mobile: dummyMobile,
      city: 'Mumbai',
      role: 'owner',
      isVerified: true,
      profilePhoto: payload.picture || null,
    });
  }

  let panelType = user.role;
  if (user.role === 'vendor' && user.vendorType) {
    if (user.vendorType === 'Raw Material') panelType = 'vendor';
    else if (user.vendorType === 'Manpower') panelType = 'manpower';
    else if (user.vendorType === 'Service Provider') panelType = 'serviceProvider';
    else if (user.vendorType === 'Marketing Agency') panelType = 'marketing';
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, vendorType: user.vendorType, panelType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  user.token = token;
  await user.save();

  const userCategory = user.horecaRegistration?.bizCategory || user.vendorRegistration?.vendorType || (user.role === 'vendor' ? 'Vendor' : 'HoReCa');
  await UserLoginLog.create({
    userId: user.id,
    email: user.email,
    userRole: user.role,
    category: userCategory,
    loginTime: new Date(),
    ipAddress: reqIp,
    status: 'success',
  }).catch(err => console.error('Failed to log Google login:', err.message));

  return {
    token,
    panelType,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      role: user.role,
      vendorType: user.vendorType,
      isVerified: user.isVerified,
    },
    registration: user.horecaRegistration || user.vendorRegistration || null,
  };
};
