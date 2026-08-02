const {
  createServiceProviderRequirement,
  getOwnerServiceProviderRequirements,
  getVendorServiceProviderRequirements,
  getPublicServiceProviderRequirements,
  updateServiceProviderRequirementStatus,
  submitServiceProviderQuote,
  declineServiceProviderRequirement,
} = require('../services/serviceProviderRequirementService');

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await createServiceProviderRequirement(req.body);
    res.status(201).json({ success: true, message: 'Service Provider requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerRequirements = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requirements = await getOwnerServiceProviderRequirements(ownerId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorRequirements = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const requirements = await getVendorServiceProviderRequirements(supplierId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicRequirements = async (req, res) => {
  try {
    const requirements = await getPublicServiceProviderRequirements();
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status, extraFields } = req.body;
    const requirement = await updateServiceProviderRequirementStatus(requirementId, status, extraFields);
    res.status(200).json({ success: true, message: 'Status updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuote = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const quoteData = req.body;
    const requirement = await submitServiceProviderQuote(requirementId, quoteData);
    res.status(200).json({ success: true, message: 'Quotation submitted successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.declineRequirement = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { declineReason } = req.body;
    const requirement = await declineServiceProviderRequirement(requirementId, declineReason);
    res.status(200).json({ success: true, message: 'Requirement declined successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
