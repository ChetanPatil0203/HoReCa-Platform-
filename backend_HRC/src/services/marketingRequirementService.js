const { Op } = require('sequelize');
const {
  MarketingRequirement,
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

exports.createMarketingRequirement = async (data) => {
  const ownerId = await resolveHorecaId(data.ownerId);
  const supplierId = data.supplierId ? await resolveVendorId(data.supplierId) : null;

  return await MarketingRequirement.create({
    ownerId,
    supplierId,
    requestType: data.requestType || (supplierId ? 'direct' : 'public'),
    campaignType: data.title || data.campaignType,
    businessType: data.extraData?.businessType || data.businessType,
    objective: data.extraData?.objective || data.objective,
    budget: data.budget,
    duration: data.extraData?.duration || data.duration,
    audience: data.extraData?.audience || data.audience,
    location: data.location,
    targetArea: data.extraData?.targetArea || data.targetArea,
    description: data.description,
    platforms: data.extraData?.platforms || data.platforms,
    services: data.extraData?.services || data.services,
    status: data.status || 'pending',
  });
};

exports.getOwnerMarketingRequirements = async (ownerId) => {
  const horecaId = await resolveHorecaId(ownerId);
  const includeSupplier = [
    { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] },
  ];

  const list = await MarketingRequirement.findAll({
    where: { ownerId: { [Op.or]: [ownerId, horecaId] } },
    include: includeSupplier,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    ownerId: r.ownerId,
    supplierId: r.supplierId,
    type: 'marketing',
    requestType: r.requestType,
    title: r.campaignType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: {
      businessType: r.businessType,
      objective: r.objective,
      duration: r.duration,
      audience: r.audience,
      targetArea: r.targetArea,
      platforms: r.platforms,
      services: r.services,
    },
    supplier: r.supplier,
  }));
};

exports.getVendorMarketingRequirements = async (supplierId) => {
  const vendorId = await resolveVendorId(supplierId);
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'mobile', 'address'] },
  ];

  const list = await MarketingRequirement.findAll({
    where: {
      supplierId: { [Op.or]: [supplierId, vendorId] },
      requestType: 'direct',
    },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    type: 'marketing',
    title: r.campaignType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: { duration: r.duration, objective: r.objective },
    owner: r.owner,
  }));
};

exports.getPublicMarketingRequirements = async () => {
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address'] },
  ];

  const list = await MarketingRequirement.findAll({
    where: { requestType: 'public' },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
    id: r.id,
    type: 'marketing',
    title: r.campaignType,
    description: r.description,
    budget: r.budget,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: { duration: r.duration, objective: r.objective, platforms: r.platforms },
    owner: r.owner,
  }));
};

exports.updateMarketingRequirementStatus = async (requirementId, status) => {
  const record = await MarketingRequirement.findByPk(requirementId);
  if (!record) throw new Error('Marketing requirement not found');
  record.status = status;
  await record.save();
  return record;
};
