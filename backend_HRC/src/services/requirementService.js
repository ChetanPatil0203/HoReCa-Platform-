const {
  ManpowerRequirement,
  MarketingRequirement,
  ServiceProviderRequirement,
  Requirement,
  HorecaRegistration,
  VendorRegistration,
} = require('../models');

// Helper to resolve model based on type
const getModelByType = (type) => {
  switch (type) {
    case 'manpower':
      return ManpowerRequirement;
    case 'marketing':
      return MarketingRequirement;
    case 'serviceProvider':
      return ServiceProviderRequirement;
    default:
      return Requirement;
  }
};

exports.createRequirementService = async (data) => {
  const TargetModel = getModelByType(data.type);

  if (data.type === 'manpower') {
    return await TargetModel.create({
      ownerId: data.ownerId,
      supplierId: data.supplierId || null,
      requestType: data.requestType || 'public',
      jobRole: data.title,
      numberOfStaff: data.extraData?.numberOfStaff,
      experience: data.extraData?.experience,
      salaryRange: data.budget,
      employmentType: data.extraData?.employmentType,
      shift: data.extraData?.shift,
      joiningDate: data.extraData?.joiningDate,
      location: data.location,
      accommodation: data.extraData?.accommodation || false,
      food: data.extraData?.food || false,
      weeklyOff: data.extraData?.weeklyOff,
      workingHours: data.extraData?.workingHours,
      urgentRequirement: data.extraData?.urgentRequirement || false,
      description: data.description,
      status: data.status || 'pending',
    });
  }

  if (data.type === 'marketing') {
    return await TargetModel.create({
      ownerId: data.ownerId,
      supplierId: data.supplierId || null,
      requestType: data.requestType || 'public',
      campaignType: data.title,
      businessType: data.extraData?.businessType,
      objective: data.extraData?.objective,
      budget: data.budget,
      duration: data.extraData?.duration,
      audience: data.extraData?.audience,
      location: data.location,
      targetArea: data.extraData?.targetArea,
      description: data.description,
      platforms: data.extraData?.platforms,
      services: data.extraData?.services,
      status: data.status || 'pending',
    });
  }

  if (data.type === 'serviceProvider') {
    return await TargetModel.create({
      ownerId: data.ownerId,
      supplierId: data.supplierId || null,
      requestType: data.requestType || 'public',
      category: data.extraData?.category,
      serviceType: data.title,
      date: data.extraData?.date,
      time: data.extraData?.time,
      urgency: data.extraData?.urgency,
      budget: data.budget,
      location: data.location,
      description: data.description,
      status: data.status || 'pending',
    });
  }

  // Fallback to legacy Requirement table if unknown type
  return await Requirement.create({
    ownerId: data.ownerId,
    supplierId: data.supplierId || null,
    type: data.type,
    requestType: data.requestType || 'public',
    title: data.title,
    description: data.description,
    budget: data.budget,
    location: data.location,
    status: data.status || 'pending',
    extraData: data.extraData || {},
  });
};

exports.getOwnerRequirementsService = async (ownerId) => {
  const includeSupplier = [
    { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] }
  ];

  const [mp, mk, sp, gen] = await Promise.all([
    ManpowerRequirement.findAll({ where: { ownerId }, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    MarketingRequirement.findAll({ where: { ownerId }, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    ServiceProviderRequirement.findAll({ where: { ownerId }, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    Requirement.findAll({ where: { ownerId }, include: includeSupplier, order: [['createdAt', 'DESC']] }),
  ]);

  // Format to unified structure for frontend rendering
  const mappedMp = mp.map(r => ({
    id: r.id,
    ownerId: r.ownerId,
    supplierId: r.supplierId,
    type: 'manpower',
    requestType: r.requestType,
    title: r.jobRole,
    description: r.description,
    budget: r.salaryRange,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: {
      numberOfStaff: r.numberOfStaff,
      experience: r.experience,
      employmentType: r.employmentType,
      shift: r.shift,
      joiningDate: r.joiningDate,
      accommodation: r.accommodation,
      food: r.food,
      weeklyOff: r.weeklyOff,
      workingHours: r.workingHours,
      urgentRequirement: r.urgentRequirement,
    },
    supplier: r.supplier,
  }));

  const mappedMk = mk.map(r => ({
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

  const mappedSp = sp.map(r => ({
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

  return [...mappedMp, ...mappedMk, ...mappedSp, ...gen].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

exports.getVendorRequirementsService = async (supplierId) => {
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'mobile', 'address'] }
  ];

  const [mp, mk, sp, gen] = await Promise.all([
    ManpowerRequirement.findAll({ where: { supplierId, requestType: 'direct' }, include: includeOwner, order: [['createdAt', 'DESC']] }),
    MarketingRequirement.findAll({ where: { supplierId, requestType: 'direct' }, include: includeOwner, order: [['createdAt', 'DESC']] }),
    ServiceProviderRequirement.findAll({ where: { supplierId, requestType: 'direct' }, include: includeOwner, order: [['createdAt', 'DESC']] }),
    Requirement.findAll({ where: { supplierId, requestType: 'direct' }, include: includeOwner, order: [['createdAt', 'DESC']] }),
  ]);

  const mappedMp = mp.map(r => ({
    id: r.id,
    type: 'manpower',
    title: r.jobRole,
    description: r.description,
    budget: r.salaryRange,
    location: r.location,
    status: r.status,
    createdAt: r.createdAt,
    extraData: { numberOfStaff: r.numberOfStaff, experience: r.experience },
    owner: r.owner,
  }));

  const mappedMk = mk.map(r => ({
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

  const mappedSp = sp.map(r => ({
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

  return [...mappedMp, ...mappedMk, ...mappedSp, ...gen].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

exports.getPublicRequirementsService = async (type) => {
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address'] }
  ];

  let list = [];

  if (!type || type === 'manpower') {
    const mp = await ManpowerRequirement.findAll({ where: { requestType: 'public' }, include: includeOwner, order: [['createdAt', 'DESC']] });
    list.push(...mp.map(r => ({
      id: r.id,
      type: 'manpower',
      title: r.jobRole,
      description: r.description,
      budget: r.salaryRange,
      location: r.location,
      status: r.status,
      createdAt: r.createdAt,
      extraData: { numberOfStaff: r.numberOfStaff, experience: r.experience, shift: r.shift },
      owner: r.owner,
    })));
  }

  if (!type || type === 'marketing') {
    const mk = await MarketingRequirement.findAll({ where: { requestType: 'public' }, include: includeOwner, order: [['createdAt', 'DESC']] });
    list.push(...mk.map(r => ({
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
    })));
  }

  if (!type || type === 'serviceProvider') {
    const sp = await ServiceProviderRequirement.findAll({ where: { requestType: 'public' }, include: includeOwner, order: [['createdAt', 'DESC']] });
    list.push(...sp.map(r => ({
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
    })));
  }

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

exports.updateRequirementStatusService = async (requirementId, status) => {
  // Search across tables to find and update
  let requirement = await ManpowerRequirement.findByPk(requirementId);
  if (requirement) {
    requirement.status = status;
    await requirement.save();
    return requirement;
  }

  requirement = await MarketingRequirement.findByPk(requirementId);
  if (requirement) {
    requirement.status = status;
    await requirement.save();
    return requirement;
  }

  requirement = await ServiceProviderRequirement.findByPk(requirementId);
  if (requirement) {
    requirement.status = status;
    await requirement.save();
    return requirement;
  }

  requirement = await Requirement.findByPk(requirementId);
  if (requirement) {
    requirement.status = status;
    await requirement.save();
    return requirement;
  }

  throw new Error('Requirement not found');
};
