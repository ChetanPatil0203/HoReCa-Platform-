const { Op } = require('sequelize');
const {
  ServiceProviderRequirement,
  HorecaRegistration,
  VendorRegistration,
} = require('../models');

// Helper to resolve Horeca Registration ID
const resolveHorecaId = async (ownerId) => {
  if (!ownerId) return null;
  const reg = await HorecaRegistration.findOne({
    where: {
      [Op.or]: [{ id: ownerId }, { userId: ownerId }],
    },
  });
  return reg ? reg.id : ownerId;
};

// Helper to resolve Vendor Registration ID
const resolveVendorId = async (supplierId) => {
  if (!supplierId) return null;
  const reg = await VendorRegistration.findOne({
    where: {
      [Op.or]: [{ id: supplierId }, { userId: supplierId }],
    },
  });
  return reg ? reg.id : supplierId;
};

exports.createServiceProviderRequirement = async (data) => {
  const ownerId = await resolveHorecaId(data.ownerId);
  const supplierId = data.supplierId ? await resolveVendorId(data.supplierId) : null;

  return await ServiceProviderRequirement.create({
    ownerId,
    supplierId,
    requestType: data.requestType || (supplierId ? 'direct' : 'public'),
    category: data.extraData?.category || data.category,
    serviceType: data.title || data.serviceType,
    date: data.extraData?.date || data.date,
    time: data.extraData?.time || data.time,
    urgency: data.extraData?.urgency || data.urgency,
    budget: data.budget,
    location: data.location,
    description: data.description,
    status: data.status || 'pending',
  });
};

exports.getOwnerServiceProviderRequirements = async (ownerId) => {
  const horecaId = await resolveHorecaId(ownerId);
  const includeSupplier = [
    { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] },
  ];

  const list = await ServiceProviderRequirement.findAll({
    where: { ownerId: { [Op.or]: [ownerId, horecaId] } },
    include: includeSupplier,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    ownerId: r.ownerId,
    supplierId: r.supplierId,
    type: 'serviceProvider',
    requestType: r.requestType,
    title: r.serviceType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: {
      category: r.category,
      date: r.date,
      time: r.time,
      urgency: r.urgency,
    },
    supplier: r.supplier,
  }));
};

exports.getVendorServiceProviderRequirements = async (supplierId) => {
  const vendorId = await resolveVendorId(supplierId);
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'mobile', 'address'] },
  ];

  const list = await ServiceProviderRequirement.findAll({
    where: {
      supplierId: { [Op.or]: [supplierId, vendorId] },
      requestType: 'direct',
    },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    type: 'serviceProvider',
    title: r.serviceType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: { category: r.category, date: r.date },
    owner: r.owner,
  }));
};

exports.getPublicServiceProviderRequirements = async () => {
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address'] },
  ];

  const list = await ServiceProviderRequirement.findAll({
    where: { requestType: 'public' },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    type: 'serviceProvider',
    title: r.serviceType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: { category: r.category, date: r.date, urgency: r.urgency },
    owner: r.owner,
  }));
};

exports.updateServiceProviderRequirementStatus = async (requirementId, status) => {
  const record = await ServiceProviderRequirement.findByPk(requirementId);
  if (!record) throw new Error('Service Provider requirement not found');
  record.status = status;
  await record.save();
  return record;
};
