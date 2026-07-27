const {
  HorecaRegistration,
  VendorRegistration,
  User,
  Document,
  sequelize,
} = require('../models');
const { sendApprovalEmail } = require('../utils/emailService');

/**
 * Verify / approve / reject a HoReCa or Vendor registration
 * @param {Object} params
 * @param {string} params.registrationId - UUID of the registration
 * @param {string} params.type - 'horeca' | 'vendor'
 * @param {string} params.status - 'approved' | 'rejected'
 */
exports.verifyRegistrationService = async ({ registrationId, type, status }) => {
  if (!registrationId) {
    throw new Error('registrationId is required.');
  }
  if (!type || !['horeca', 'vendor'].includes(type.toLowerCase())) {
    throw new Error("Invalid type. Must be 'horeca' or 'vendor'.");
  }
  if (!status) {
    throw new Error('status is required.');
  }

  const normalizedType = type.toLowerCase();
  const normalizedStatus = status.toLowerCase();

  const transaction = await sequelize.transaction();

  try {
    let registration;
    if (normalizedType === 'horeca') {
      registration = await HorecaRegistration.findByPk(registrationId, { transaction });
    } else {
      registration = await VendorRegistration.findByPk(registrationId, { transaction });
    }

    if (!registration) {
      throw new Error(`Registration record not found for ID ${registrationId}.`);
    }

    registration.status = normalizedStatus;
    await registration.save({ transaction });

    const user = await User.findByPk(registration.userId, { transaction });
    if (user) {
      const isApproved = normalizedStatus === 'approved';
      user.isVerified = isApproved;
      await user.save({ transaction });

      // Update documents status linked to user if approving/rejecting
      if (isApproved) {
        await Document.update(
          { status: 'approved' },
          { where: { userId: user.id }, transaction }
        );
      } else if (normalizedStatus === 'rejected') {
        await Document.update(
          { status: 'rejected' },
          { where: { userId: user.id }, transaction }
        );
      }
    }

    await transaction.commit();

    // Send Approval Email if status is 'approved'
    if (normalizedStatus === 'approved' && user && user.email) {
      // Background email sending
      sendApprovalEmail(user.email, user.firstName || 'User');
    }

    // Re-fetch registration with user and documents for clean response
    let updatedRegistration;
    if (normalizedType === 'horeca') {
      updatedRegistration = await HorecaRegistration.findByPk(registrationId, {
        include: [{ model: User, as: 'user', include: [{ model: Document, as: 'documents' }] }],
      });
    } else {
      updatedRegistration = await VendorRegistration.findByPk(registrationId, {
        include: [{ model: User, as: 'user', include: [{ model: Document, as: 'documents' }] }],
      });
    }

    return updatedRegistration;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get aggregated dashboard statistics
 */
exports.getDashboardStatsService = async () => {
  const totalHoreca = await HorecaRegistration.count();
  const totalVendors = await VendorRegistration.count();
  
  const pendingHoreca = await HorecaRegistration.count({ where: { status: 'pending' } });
  const pendingVendors = await VendorRegistration.count({ where: { status: 'pending' } });
  
  const suspendedHoreca = await HorecaRegistration.count({ where: { status: 'suspended' } });
  const suspendedVendors = await VendorRegistration.count({ where: { status: 'suspended' } });
  
  return {
    totalHoreca,
    totalVendors,
    pendingVerifications: pendingHoreca + pendingVendors,
    activeOrders: 0, // Placeholder
    openComplaints: 0, // Placeholder
    suspendedAccounts: suspendedHoreca + suspendedVendors
  };
};

/**
 * Get Admin Team
 */
exports.getTeamService = async () => {
  const team = await User.findAll({
    where: { role: 'superadmin' },
    attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'role', 'isVerified', 'createdAt']
  });
  return team;
};
