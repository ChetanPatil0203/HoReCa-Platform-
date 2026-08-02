const { verifyRegistrationService, getDashboardStatsService, getTeamService } = require('../services/adminService');
const {
  getHorecaRegistrationsService,
  getVendorRegistrationsService,
  getUserLoginLogsService,
} = require('../services/authService');
const { SystemLimit } = require('../models');

const DEFAULT_LIMITS = [
  { key: 'max_job_postings_monthly', title: 'Max Job Postings per Month', category: 'HORECA', value: '15', unit: 'posts/mo', description: 'Maximum job postings a HoReCa owner can create per month.' },
  { key: 'max_raw_material_products', title: 'Max Raw Material Products', category: 'VENDOR', value: '150', unit: 'products', description: 'Maximum product listings per vendor supplier.' },
  { key: 'max_document_upload_size', title: 'Max Document Upload Size', category: 'GENERAL', value: '5', unit: 'MB', description: 'Maximum file size allowed for compliance uploads.' },
  { key: 'max_quote_submissions', title: 'Max Quotes per Requirement', category: 'VENDOR', value: '25', unit: 'quotes/mo', description: 'Maximum quotes a service provider vendor can submit.' },
  { key: 'rate_limit_requests', title: 'API Rate Limit', category: 'SECURITY', value: '120', unit: 'req/min', description: 'Maximum API requests per minute per IP address.' },
];

// GET /api/admin/limits
exports.getSystemLimits = async (req, res) => {
  try {
    let limits = await SystemLimit.findAll({ order: [['category', 'ASC']] });
    if (!limits || limits.length === 0) {
      limits = await SystemLimit.bulkCreate(DEFAULT_LIMITS);
    }
    return res.status(200).json({
      success: true,
      count: limits.length,
      data: limits,
    });
  } catch (error) {
    console.error('getSystemLimits Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch system limits.',
    });
  }
};

// PUT /api/admin/limits
exports.updateSystemLimits = async (req, res) => {
  try {
    const { limits } = req.body; // Array of { key, value }
    if (!Array.isArray(limits)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: limits array required.' });
    }

    for (const item of limits) {
      if (item.key && item.value !== undefined) {
        await SystemLimit.update({ value: String(item.value) }, { where: { key: item.key } });
      }
    }

    const updatedLimits = await SystemLimit.findAll({ order: [['category', 'ASC']] });
    return res.status(200).json({
      success: true,
      message: 'System limits updated successfully.',
      data: updatedLimits,
    });
  } catch (error) {
    console.error('updateSystemLimits Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update system limits.',
    });
  }
};

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
