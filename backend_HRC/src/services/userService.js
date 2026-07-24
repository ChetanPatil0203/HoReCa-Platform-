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

  const { firstName, lastName, city, bizName, address, gstin, fssaiNo } = updateData;

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (city) user.city = city;

  await user.save();

  // Update corresponding registration table if applicable
  const horeca = await HorecaRegistration.findOne({ where: { userId } });
  if (horeca) {
    if (bizName) horeca.bizName = bizName;
    if (address) horeca.address = address;
    if (gstin) horeca.gstin = gstin;
    if (fssaiNo) horeca.fssaiNo = fssaiNo;
    await horeca.save();
  }

  const vendor = await VendorRegistration.findOne({ where: { userId } });
  if (vendor) {
    if (bizName) vendor.bizName = bizName;
    if (address) vendor.address = address;
    if (gstin) vendor.gstin = gstin;
    await vendor.save();
  }

  return exports.getUserProfileService(userId);
};
