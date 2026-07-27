const { getVendorsByTypeService } = require('../services/vendorService');

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
