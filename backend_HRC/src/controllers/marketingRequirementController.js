const service = require('../services/marketingRequirementService');

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await service.createMarketingRequirement(req.body);
    res.status(201).json({ success: true, message: 'Marketing requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerRequirements = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requirements = await service.getOwnerMarketingRequirements(ownerId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorRequirements = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const requirements = await service.getVendorMarketingRequirements(supplierId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicRequirements = async (req, res) => {
  try {
    const requirements = await service.getPublicMarketingRequirements();
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status } = req.body;
    const requirement = await service.updateMarketingRequirementStatus(requirementId, status);
    res.status(200).json({ success: true, message: 'Status updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const summary = await service.getMarketingDashboardSummary(ownerId);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Marketing Proposals ---
exports.createProposal = async (req, res) => {
  try {
    const proposal = await service.createMarketingProposalService(req.body);
    res.status(201).json({ success: true, message: 'Proposal submitted successfully', data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRequirementProposals = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const proposals = await service.getRequirementProposalsService(requirementId);
    res.status(200).json({ success: true, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const proposal = await service.acceptMarketingProposalService(proposalId);
    res.status(200).json({ success: true, message: 'Proposal accepted successfully', data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Marketing Creatives ---
exports.createCreative = async (req, res) => {
  try {
    const creative = await service.createMarketingCreativeService(req.body);
    res.status(201).json({ success: true, message: 'Creative submitted successfully', data: creative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRequirementCreatives = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const creatives = await service.getRequirementCreativesService(requirementId);
    res.status(200).json({ success: true, data: creatives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCreativeStatus = async (req, res) => {
  try {
    const { creativeId } = req.params;
    const creative = await service.updateCreativeStatusService(creativeId, req.body);
    res.status(200).json({ success: true, message: 'Creative status updated', data: creative });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Agency Team Roster ---
exports.createTeamMember = async (req, res) => {
  try {
    const member = await service.createTeamMemberService(req.body);
    res.status(201).json({ success: true, message: 'Team member added', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorTeamMembers = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const members = await service.getVendorTeamMembersService(supplierId);
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await service.updateTeamMemberService(id, req.body);
    res.status(200).json({ success: true, message: 'Team member updated', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteTeamMemberService(id);
    res.status(200).json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Agency Revenue Analytics ---
exports.getVendorRevenueAnalytics = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const analytics = await service.getVendorRevenueAnalyticsService(supplierId);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

