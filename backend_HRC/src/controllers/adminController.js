const { verifyRegistrationService, getDashboardStatsService, getTeamService } = require('../services/adminService');
const {
  getHorecaRegistrationsService,
  getVendorRegistrationsService,
  getUserLoginLogsService,
} = require('../services/authService');

// PUT /api/admin/verify-registration
exports.verifyRegistration = async (req, res) => {
  try {
    const { registrationId, type, status } = req.body;
    const updatedRegistration = await verifyRegistrationService({ registrationId, type, status });

    res.status(200).json({
      success: true,
      message: `Registration status updated to '${status}' successfully.`,
      data: updatedRegistration,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Verification update failed.',
    });
  }
};

// GET /api/admin/horeca-registrations
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

// GET /api/admin/vendor-registrations
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

// GET /api/admin/login-logs
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

// GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats.',
    });
  }
};

// GET /api/admin/team
exports.getTeam = async (req, res) => {
  try {
    const team = await getTeamService();
    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Admin team.',
    });
  }
};
