const {
  getVendorsByTypeService,
  getVendorOfferedServices,
  createVendorOfferedService,
  updateVendorOfferedService,
  deleteVendorOfferedService,
} = require('../services/vendorService');

exports.getVendorsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const vendors = await getVendorsByTypeService(type);
    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vendors by type.',
    });
  }
};

// GET /api/vendors/services/:vendorId
exports.getOfferedServices = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const services = await getVendorOfferedServices(vendorId);
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/vendors/services
exports.createOfferedService = async (req, res) => {
  try {
    const service = await createVendorOfferedService(req.body);
    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/vendors/services/:id
exports.updateOfferedService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await updateVendorOfferedService(id, req.body);
    res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/vendors/services/:id
exports.deleteOfferedService = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteVendorOfferedService(id);
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
