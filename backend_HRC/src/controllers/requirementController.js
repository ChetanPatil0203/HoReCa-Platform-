const {
  createRequirementService,
  getOwnerRequirementsService,
  getVendorRequirementsService,
  getPublicRequirementsService,
  updateRequirementStatusService,
  getOwnerHistoryService,
  getOwnerTrackingService,
  getVendorClientsService,
} = require('../services/requirementService');

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await createRequirementService(req.body);
    res.status(201).json({ success: true, message: 'Requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerRequirements = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requirements = await getOwnerRequirementsService(ownerId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerHistory = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const history = await getOwnerHistoryService(ownerId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.warn('getOwnerHistory note:', error?.message);
    res.status(200).json({ success: true, data: { orders: [], requirements: [] } });
  }
};

exports.getOwnerTracking = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const trackingData = await getOwnerTrackingService(ownerId);
    res.status(200).json({ success: true, data: trackingData });
  } catch (error) {
    console.warn('getOwnerTracking note:', error?.message);
    res.status(200).json({ success: true, data: { orders: [], requirements: [] } });
  }
};

exports.getVendorRequirements = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const requirements = await getVendorRequirementsService(supplierId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicRequirements = async (req, res) => {
  try {
    const { type } = req.query; // optional filter: manpower, marketing, serviceProvider
    const requirements = await getPublicRequirementsService(type);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status, submittedCandidates } = req.body;
    const requirement = await updateRequirementStatusService(requirementId, status, { submittedCandidates });
    res.status(200).json({ success: true, message: 'Status updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorClients = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const clients = await getVendorClientsService(supplierId);
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
