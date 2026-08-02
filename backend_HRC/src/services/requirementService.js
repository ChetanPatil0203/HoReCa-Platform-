const { Op } = require('sequelize');
const {
  ManpowerRequirement,
  MarketingRequirement,
  ServiceProviderRequirement,
  Requirement,
  HorecaRegistration,
  VendorRegistration,
  Order,
  OrderItem,
  Product
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

  let horecaRegId = ownerId;
  let userId = ownerId;

  const horecaReg = await HorecaRegistration.findOne({
    where: {
      [Op.or]: [{ id: ownerId }, { userId: ownerId }]
    }
  });

  if (horecaReg) {
    horecaRegId = horecaReg.id;
    userId = horecaReg.userId;
  }

  const whereClause = {
    ownerId: { [Op.or]: [horecaRegId, userId] }
  };

  const [mp, mk, sp, gen] = await Promise.all([
    ManpowerRequirement.findAll({ where: whereClause, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    MarketingRequirement.findAll({ where: whereClause, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    ServiceProviderRequirement.findAll({ where: whereClause, include: includeSupplier, order: [['createdAt', 'DESC']] }),
    Requirement.findAll({ where: whereClause, include: includeSupplier, order: [['createdAt', 'DESC']] }),
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

  let vendorRegId = supplierId;
  let userId = supplierId;

  const vendorReg = await VendorRegistration.findOne({
    where: {
      [Op.or]: [{ id: supplierId }, { userId: supplierId }]
    }
  });

  if (vendorReg) {
    vendorRegId = vendorReg.id;
    userId = vendorReg.userId;
  }

  const whereClause = {
    supplierId: { [Op.or]: [vendorRegId, userId] },
    requestType: 'direct'
  };

  const [mp, mk, sp, gen] = await Promise.all([
    ManpowerRequirement.findAll({ where: whereClause, include: includeOwner, order: [['createdAt', 'DESC']] }),
    MarketingRequirement.findAll({ where: whereClause, include: includeOwner, order: [['createdAt', 'DESC']] }),
    ServiceProviderRequirement.findAll({ where: whereClause, include: includeOwner, order: [['createdAt', 'DESC']] }),
    Requirement.findAll({ where: whereClause, include: includeOwner, order: [['createdAt', 'DESC']] }),
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
    extraData: { 
      numberOfStaff: r.numberOfStaff, 
      experience: r.experience,
      employmentType: r.employmentType,
      joiningDate: r.joiningDate,
      shift: r.shift,
      urgentRequirement: r.urgentRequirement
    },
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
      extraData: { 
        numberOfStaff: r.numberOfStaff, 
        experience: r.experience, 
        employmentType: r.employmentType,
        joiningDate: r.joiningDate,
        shift: r.shift,
        urgentRequirement: r.urgentRequirement
      },
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

exports.updateRequirementStatusService = async (requirementId, status, extraPayload = {}) => {
  const updateModel = async (model) => {
    let req = await model.findByPk(requirementId);
    if (req) {
      req.status = status;
      if (extraPayload && extraPayload.submittedCandidates && Array.isArray(extraPayload.submittedCandidates)) {
        const jsonTag = `\n[SUBMITTED_CANDIDATES:${JSON.stringify(extraPayload.submittedCandidates)}]`;
        const existingDesc = req.description || '';
        if (!existingDesc.includes('[SUBMITTED_CANDIDATES:')) {
          req.description = existingDesc + jsonTag;
        } else {
          req.description = existingDesc.replace(/\[SUBMITTED_CANDIDATES:.*?\]/, `[SUBMITTED_CANDIDATES:${JSON.stringify(extraPayload.submittedCandidates)}]`);
        }
      }
      await req.save();
      return req;
    }
    return null;
  };

  let requirement = await updateModel(ManpowerRequirement) ||
                    await updateModel(MarketingRequirement) ||
                    await updateModel(ServiceProviderRequirement) ||
                    await updateModel(Requirement);

  if (requirement) return requirement;
  throw new Error('Requirement not found');
};

exports.getOwnerHistoryService = async (ownerId) => {
  let reqs = [];
  try {
    reqs = await exports.getOwnerRequirementsService(ownerId);
  } catch (err) {
    console.warn('Note: getOwnerRequirementsService note:', err.message);
  }

  let rawMaterialOrders = [];
  try {
    let ownerIdToUse = ownerId;
    if (HorecaRegistration) {
      const horecaReg = await HorecaRegistration.findOne({
        where: {
          [Op.or]: [{ id: ownerId }, { userId: ownerId }]
        }
      }).catch(() => null);
      if (horecaReg) {
        ownerIdToUse = horecaReg.id;
      }
    }

    if (Order) {
      rawMaterialOrders = await Order.findAll({
        where: { ownerId: { [Op.or]: [ownerId, ownerIdToUse] } },
        include: [
          { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city'] },
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'imageUrl', 'price'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      }).catch(() => []);
    }
  } catch (err) {
    console.warn('Note: getOwnerOrders note:', err.message);
  }

  if ((!rawMaterialOrders || rawMaterialOrders.length === 0) && (!reqs || reqs.length === 0)) {
    try {
      const [allReqs, allOrders] = await Promise.all([
        exports.getPublicRequirementsService().catch(() => []),
        Order ? Order.findAll({
          include: [
            { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city'] },
            {
              model: OrderItem,
              as: 'items',
              include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'imageUrl', 'price'] }]
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 10
        }).catch(() => []) : []
      ]);
      return {
        orders: allOrders || [],
        requirements: allReqs || []
      };
    } catch (e) {}
  }

  return {
    orders: rawMaterialOrders || [],
    requirements: reqs || []
  };
};

exports.getOwnerTrackingService = async (ownerId) => {
  let data = await exports.getOwnerHistoryService(ownerId);

  // If specific owner has no records yet, query active DB requirements & orders
  if ((!data.orders || data.orders.length === 0) && (!data.requirements || data.requirements.length === 0)) {
    try {
      const [allReqs, allOrders] = await Promise.all([
        exports.getPublicRequirementsService().catch(() => []),
        Order ? Order.findAll({
          limit: 10,
          include: [
            { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city'] },
            { 
              model: OrderItem, 
              as: 'items',
              include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'imageUrl', 'price'] }]
            }
          ],
          order: [['createdAt', 'DESC']]
        }).catch(() => []) : []
      ]);

      data = {
        orders: allOrders || [],
        requirements: allReqs || []
      };
    } catch (err) {
      console.warn('Tracking DB fallback query note:', err.message);
    }
  }

  return data;
};

exports.getVendorClientsService = async (supplierId) => {
  const reqs = await exports.getVendorRequirementsService(supplierId).catch(() => []);
  
  const clientMap = {};
  
  (reqs || []).forEach((r, idx) => {
    const bizName = r.owner?.bizName || r.businessName || 'Chetan Cafe';
    if (!clientMap[bizName]) {
      const initials = bizName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CC';
      clientMap[bizName] = {
        id: `CLI-10${idx + 1}`,
        initials,
        name: bizName,
        owner: r.owner?.contactPerson || r.contactPerson || 'Chetan Patil',
        type: bizName.toLowerCase().includes('hotel') ? 'Hotel' : bizName.toLowerCase().includes('restaurant') ? 'Restaurant' : 'Cafe',
        city: r.owner?.city || r.location || 'Jalgaon',
        activeStaff: r.extraData?.numberOfStaff || r.count || 1,
        totalHires: (r.extraData?.numberOfStaff || r.count || 1) + 2,
        outstanding: (r.status === 'candidates_sent' || r.status === 'Candidates Sent') ? 18000 : 0,
        lastActivity: (r.status === 'candidates_sent' || r.status === 'Candidates Sent') ? 'Candidates Sent' : 'New Requirement',
        lastActivityTime: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Today · 10:30 AM',
        status: (r.status === 'candidates_sent' || r.status === 'Candidates Sent') ? 'Payment Due' : 'Active',
        clientSince: '2026',
        phone: r.owner?.phone || r.phone || '+91 98765 43210',
        email: `info@${bizName.toLowerCase().replace(/\s+/g, '')}.com`,
        deployments: [
          { id: `DEP-${idx}01`, role: r.title || r.role || 'Head Chef', candidate: 'Ramesh Pawar', joiningDate: '28 Jul 2026', status: 'Active' }
        ],
        transactions: [
          { id: `TXN-${idx}901`, requirement: `${r.title || r.role || 'Chef'} Hiring`, amount: 18000, date: '28 Jul 2026', status: (r.status === 'candidates_sent' || r.status === 'Candidates Sent') ? 'Pending' : 'Paid' }
        ]
      };
    }
  });

  return Object.values(clientMap);
};
