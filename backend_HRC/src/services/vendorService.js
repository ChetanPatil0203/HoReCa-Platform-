const { VendorRegistration, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getVendorsByTypeService = async (type) => {
  const vendors = await VendorRegistration.findAll({
    where: {
      [Op.or]: [
        { vendorType: { [Op.like]: `%${type}%` } },
        { vendorType: type }
      ]
    },
    order: [['createdAt', 'DESC']],
  });
  return vendors;
};
