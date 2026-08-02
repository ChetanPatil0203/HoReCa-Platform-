const { User, Document, HorecaRegistration, VendorRegistration } = require('../models');
const { Op } = require('sequelize');

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

const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

exports.getOwnerMainDashboardSummary = async (ownerId) => {
  if (!ownerId || !isUuid(ownerId)) {
    return {
      counts: {
        rawMaterial: 0,
        manpower: 0,
        service: 0,
        marketing: 0,
        ordersInProgress: 0,
        pendingResponses: 0,
        scheduledToday: 0,
        attentionNeeded: 0,
      },
      recentActivity: [
        {
          id: 'welcome-1',
          title: 'Welcome to HoReCa Hub',
          subtitle: 'Your Business Partner account is active',
          time: 'Just now',
          type: 'system',
        }
      ],
      topPartners: [],
    };
  }

  const { Requirement, Document } = require('../models');

  let userIds = [ownerId];

  const horeca = await HorecaRegistration.findOne({
    where: { [Op.or]: [{ id: ownerId }, { userId: ownerId }] }
  });
  if (horeca) {
    if (horeca.id && !userIds.includes(horeca.id)) userIds.push(horeca.id);
    if (horeca.userId && !userIds.includes(horeca.userId)) userIds.push(horeca.userId);
  }

  const requirements = await Requirement.findAll({
    where: { ownerId: { [Op.in]: userIds } },
    order: [['createdAt', 'DESC']],
  });

  const docs = await Document.findAll({
    where: { userId: { [Op.in]: userIds } },
    order: [['createdAt', 'DESC']],
  });

  const mpCount = requirements.filter(r => r.type === 'manpower' || r.type === 'Manpower').length;
  const spCount = requirements.filter(r => r.type === 'serviceProvider' || r.type === 'Service Provider').length;
  const mkCount = requirements.filter(r => r.type === 'marketing' || r.type === 'Marketing').length;

  const pendingResponsesCount = requirements.filter(r => r.supplierId || (r.extraData && r.extraData.responseCount > 0)).length;

  const topVendors = await VendorRegistration.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
  });

  const topPartners = topVendors.map((v) => ({
    id: v.id,
    name: v.bizName || v.ownerName || 'Verified Partner',
    category: v.vendorType || 'Supplier',
    rating: 4.8,
    location: v.city || 'Local',
  }));

  const activityItems = [];

  requirements.forEach((r) => {
    let title = 'Requirement Posted';
    if (r.type === 'manpower' || r.type === 'Manpower') title = 'Manpower Requirement';
    else if (r.type === 'marketing' || r.type === 'Marketing') title = 'Marketing Campaign';
    else if (r.type === 'serviceProvider' || r.type === 'Service Provider') title = 'Service Provider Request';

    const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recent';

    activityItems.push({
      id: `req-${r.id}`,
      title,
      subtitle: `${r.title || r.type} (${r.status || 'Active'})`,
      time: dateStr,
      timestamp: r.createdAt ? new Date(r.createdAt).getTime() : 0,
      type: r.type,
    });
  });

  docs.forEach((d) => {
    const dateStr = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : 'Recent';
    activityItems.push({
      id: `doc-${d.id}`,
      title: 'Compliance Document Uploaded',
      subtitle: `${d.docName || d.docKey} (${d.verification || 'Submitted'})`,
      time: dateStr,
      timestamp: d.createdAt ? new Date(d.createdAt).getTime() : 0,
      type: 'compliance',
    });
  });

  if (horeca) {
    const dateStr = horeca.createdAt ? new Date(horeca.createdAt).toLocaleDateString('en-IN') : 'Registration';
    activityItems.push({
      id: `reg-${horeca.id}`,
      title: 'Business Profile Registered',
      subtitle: `${horeca.bizName || 'HoReCa Partner'} - Business Account Active`,
      time: dateStr,
      timestamp: horeca.createdAt ? new Date(horeca.createdAt).getTime() : Date.now() - 1000,
      type: 'system',
    });

    activityItems.push({
      id: `system-compliance-${horeca.id}`,
      title: 'Compliance & Verification Status',
      subtitle: 'Business documents submitted for verification',
      time: dateStr,
      timestamp: horeca.createdAt ? new Date(horeca.createdAt).getTime() - 500 : Date.now() - 2000,
      type: 'compliance',
    });

    activityItems.push({
      id: `system-catalog-${horeca.id}`,
      title: 'Raw Material & Supplier Access',
      subtitle: 'Verified partner access granted for HoReCa operations',
      time: dateStr,
      timestamp: horeca.createdAt ? new Date(horeca.createdAt).getTime() - 1000 : Date.now() - 3000,
      type: 'system',
    });
  }

  activityItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  if (activityItems.length === 0) {
    activityItems.push({
      id: 'welcome-default',
      title: 'Welcome to HoReCa Hub',
      subtitle: 'Post manpower, marketing or service requirements to see activities',
      time: 'Just now',
      type: 'system',
    });
  }

  return {
    counts: {
      rawMaterial: 0,
      manpower: mpCount,
      service: spCount,
      marketing: mkCount,
      ordersInProgress: 0,
      pendingResponses: pendingResponsesCount,
      scheduledToday: spCount,
      attentionNeeded: 0,
    },
    recentActivity: activityItems.slice(0, 20),
    topPartners,
  };
};
