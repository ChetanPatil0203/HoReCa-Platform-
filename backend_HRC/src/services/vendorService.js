const { VendorRegistration, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getVendorsByTypeService = async (type) => {
  const vendors = await VendorRegistration.findAll({
    where: {
      vendorType: type,
      status: 'approved'
    },
    order: [['createdAt', 'DESC']],
  });
  return vendors;
};
