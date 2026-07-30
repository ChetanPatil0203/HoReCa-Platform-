const {
  createMarketingRequirement,
  getOwnerMarketingRequirements,
  getVendorMarketingRequirements,
  getPublicMarketingRequirements,
  updateMarketingRequirementStatus,
  getMarketingDashboardSummary,
} = require('../services/marketingRequirementService');

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await createMarketingRequirement(req.body);
    res.status(201).json({ success: true, message: 'Marketing requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerRequirements = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requirements = await getOwnerMarketingRequirements(ownerId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorRequirements = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const requirements = await getVendorMarketingRequirements(supplierId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicRequirements = async (req, res) => {
  try {
    const requirements = await getPublicMarketingRequirements();
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status } = req.body;
    const requirement = await updateMarketingRequirementStatus(requirementId, status);
    res.status(200).json({ success: true, message: 'Status updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const summary = await getMarketingDashboardSummary(ownerId);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

