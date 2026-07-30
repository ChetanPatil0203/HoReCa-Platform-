const { User, Document, HorecaRegistration, VendorRegistration } = require('../models');

// Get Current User Profile with Registration and Documents
exports.getUserProfileService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'otpCode'] },
    include: [
      {
        model: HorecaRegistration,
        as: 'horecaRegistration',
      },
      {
        model: VendorRegistration,
        as: 'vendorRegistration',
      },
      {
        model: Document,
        as: 'documents',
      },
    ],
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

// Update Profile
exports.updateUserProfileService = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  const {
    firstName,
    lastName,
    city,
    state,
    pincode,
    address,
    bizName,
    gstin,
    panNo,
    fssaiNo,
    profilePhoto,
    bankName,
    accountNumber,
    ifscCode,
    accountHolderName,
    deliveryRadius,
    minOrderValue,
    paymentTerms,
    notificationSettings
  } = updateData;

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (city !== undefined) user.city = city;
  if (state !== undefined) user.state = state;
  if (pincode !== undefined) user.pincode = pincode;
  if (address !== undefined) user.address = address;
  if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
  if (bankName !== undefined) user.bankName = bankName;
  if (accountNumber !== undefined) user.accountNumber = accountNumber;
  if (ifscCode !== undefined) user.ifscCode = ifscCode;
  if (accountHolderName !== undefined) user.accountHolderName = accountHolderName;
  if (deliveryRadius !== undefined) user.deliveryRadius = deliveryRadius;
  if (minOrderValue !== undefined) user.minOrderValue = minOrderValue;
  if (paymentTerms !== undefined) user.paymentTerms = paymentTerms;
  if (notificationSettings !== undefined) {
    user.notificationSettings = typeof notificationSettings === 'object' 
      ? JSON.stringify(notificationSettings) 
      : notificationSettings;
  }

  await user.save();

  // Update corresponding registration table if applicable
  const horeca = await HorecaRegistration.findOne({ where: { userId } });
  if (horeca) {
    if (bizName !== undefined) horeca.bizName = bizName;
    if (address !== undefined) horeca.address = address;
    if (city !== undefined) horeca.city = city;
    if (state !== undefined) horeca.state = state;
    if (pincode !== undefined) horeca.pincode = pincode;
    if (gstin !== undefined) horeca.gstin = gstin;
    if (panNo !== undefined) horeca.panNo = panNo;
    if (fssaiNo !== undefined) horeca.fssaiNo = fssaiNo;
    if (profilePhoto !== undefined) horeca.profilePhoto = profilePhoto;
    if (bankName !== undefined) horeca.bankName = bankName;
    if (accountNumber !== undefined) horeca.accountNumber = accountNumber;
    if (ifscCode !== undefined) horeca.ifscCode = ifscCode;
    if (accountHolderName !== undefined) horeca.accountHolderName = accountHolderName;
    await horeca.save();
  }

  const vendor = await VendorRegistration.findOne({ where: { userId } });
  if (vendor) {
    if (bizName !== undefined) vendor.bizName = bizName;
    if (address !== undefined) vendor.address = address;
    if (city !== undefined) vendor.city = city;
    if (state !== undefined) vendor.state = state;
    if (pincode !== undefined) vendor.pincode = pincode;
    if (gstin !== undefined) vendor.gstin = gstin;
    if (panNo !== undefined) vendor.panNo = panNo;
    if (fssaiNo !== undefined) vendor.fssaiNo = fssaiNo;
    if (profilePhoto !== undefined) vendor.profilePhoto = profilePhoto;
    if (bankName !== undefined) vendor.bankName = bankName;
    if (accountNumber !== undefined) vendor.accountNumber = accountNumber;
    if (ifscCode !== undefined) vendor.ifscCode = ifscCode;
    if (accountHolderName !== undefined) vendor.accountHolderName = accountHolderName;
    if (deliveryRadius !== undefined) vendor.deliveryRadius = deliveryRadius;
    if (minOrderValue !== undefined) vendor.minOrderValue = minOrderValue;
    if (paymentTerms !== undefined) vendor.paymentTerms = paymentTerms;
    await vendor.save();
  }

  return exports.getUserProfileService(userId);
};
