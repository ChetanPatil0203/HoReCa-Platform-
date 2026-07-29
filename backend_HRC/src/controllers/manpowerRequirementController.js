const {
  createManpowerRequirement,
  getOwnerManpowerRequirements,
  getVendorManpowerRequirements,
  getPublicManpowerRequirements,
  updateManpowerRequirementStatus,
} = require('../services/manpowerRequirementService');

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await createManpowerRequirement(req.body);
    res.status(201).json({ success: true, message: 'Manpower requirement created successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerRequirements = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requirements = await getOwnerManpowerRequirements(ownerId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorRequirements = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const requirements = await getVendorManpowerRequirements(supplierId);
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicRequirements = async (req, res) => {
  try {
    const requirements = await getPublicManpowerRequirements();
    res.status(200).json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status } = req.body;
    const requirement = await updateManpowerRequirementStatus(requirementId, status);
    res.status(200).json({ success: true, message: 'Status updated successfully', data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
