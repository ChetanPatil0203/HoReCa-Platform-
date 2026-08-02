const { VendorRegistration, VendorService } = require('../models');
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

const resolveVendorId = async (vendorId) => {
  if (!vendorId) return null;
  const reg = await VendorRegistration.findOne({
    where: {
      [Op.or]: [{ id: vendorId }, { userId: vendorId }],
    },
  });
  return reg ? reg.id : vendorId;
};

exports.getVendorOfferedServices = async (vendorId) => {
  const resolvedId = await resolveVendorId(vendorId);
  if (!resolvedId) return [];
  const list = await VendorService.findAll({
    where: { vendorId: resolvedId },
    order: [['createdAt', 'DESC']],
  });
  return list;
};

exports.createVendorOfferedService = async (data) => {
  const vendorId = await resolveVendorId(data.vendorId || data.supplierId || data.userId);
  if (!vendorId) throw new Error('Vendor ID is required');

  return await VendorService.create({
    vendorId,
    name: data.name,
    category: data.category,
    description: data.description,
    pricingType: data.pricingType || 'Fixed Price',
    price: data.price,
    duration: data.duration,
    availability: data.availability || 'Available Today',
    status: data.status || 'Active',
    included: data.included,
    excluded: data.excluded,
  });
};

exports.updateVendorOfferedService = async (id, data) => {
  const service = await VendorService.findByPk(id);
  if (!service) throw new Error('Vendor service not found');
  if (data.name !== undefined) service.name = data.name;
  if (data.category !== undefined) service.category = data.category;
  if (data.description !== undefined) service.description = data.description;
  if (data.pricingType !== undefined) service.pricingType = data.pricingType;
  if (data.price !== undefined) service.price = data.price;
  if (data.duration !== undefined) service.duration = data.duration;
  if (data.availability !== undefined) service.availability = data.availability;
  if (data.status !== undefined) service.status = data.status;
  if (data.included !== undefined) service.included = data.included;
  if (data.excluded !== undefined) service.excluded = data.excluded;
  await service.save();
  return service;
};

exports.deleteVendorOfferedService = async (id) => {
  const service = await VendorService.findByPk(id);
  if (!service) throw new Error('Vendor service not found');
  await service.destroy();
  return { success: true };
};
