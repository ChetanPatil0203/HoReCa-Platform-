const { Op } = require('sequelize');
const {
  ManpowerRequirement,
  HorecaRegistration,
  VendorRegistration,
  Candidate,
} = require('../models');

const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// Helper to resolve Horeca Registration ID
const resolveHorecaId = async (ownerId) => {
  if (!ownerId || !isUuid(ownerId)) return null;
  const reg = await HorecaRegistration.findOne({
    where: {
      [Op.or]: [{ id: ownerId }, { userId: ownerId }],
    },
  });
  return reg ? reg.id : ownerId;
};

// Helper to resolve Vendor Registration ID
const resolveVendorId = async (supplierId) => {
  if (!supplierId || !isUuid(supplierId)) return null;
  const reg = await VendorRegistration.findOne({
    where: {
      [Op.or]: [{ id: supplierId }, { userId: supplierId }],
    },
  });
  return reg ? reg.id : supplierId;
};

exports.createManpowerRequirement = async (data) => {
  const ownerId = await resolveHorecaId(data.ownerId);
  const supplierId = data.supplierId ? await resolveVendorId(data.supplierId) : null;

  return await ManpowerRequirement.create({
    ownerId,
    supplierId,
    requestType: data.requestType || (supplierId ? 'direct' : 'public'),
    jobRole: data.title || data.jobRole,
    numberOfStaff: data.extraData?.numberOfStaff || data.numberOfStaff,
    experience: data.extraData?.experience || data.experience,
    salaryRange: data.budget || data.salaryRange,
    employmentType: data.extraData?.employmentType || data.employmentType,
    shift: data.extraData?.shift || data.shift,
    joiningDate: data.extraData?.joiningDate || data.joiningDate,
    location: data.location,
    accommodation: data.extraData?.accommodation || data.accommodation || false,
    food: data.extraData?.food || data.food || false,
    weeklyOff: data.extraData?.weeklyOff || data.weeklyOff,
    workingHours: data.extraData?.workingHours || data.workingHours,
    urgentRequirement: data.extraData?.urgentRequirement || data.urgentRequirement || false,
    description: data.description,
    status: data.status || 'pending',
  });
};

exports.getOwnerManpowerRequirements = async (ownerId) => {
  const horecaId = await resolveHorecaId(ownerId);
  const includeSupplier = [
    { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] },
  ];

  const list = await ManpowerRequirement.findAll({
    where: { ownerId: { [Op.or]: [ownerId, horecaId] } },
    include: includeSupplier,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
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
};

exports.getVendorManpowerRequirements = async (supplierId) => {
  const vendorId = await resolveVendorId(supplierId);
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'mobile', 'address'] },
  ];

  const list = await ManpowerRequirement.findAll({
    where: {
      supplierId: { [Op.or]: [supplierId, vendorId] },
      requestType: 'direct',
    },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
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
};

exports.getPublicManpowerRequirements = async () => {
  const includeOwner = [
    { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address'] },
  ];

  const list = await ManpowerRequirement.findAll({
    where: { requestType: 'public' },
    include: includeOwner,
    order: [['createdAt', 'DESC']],
  });

  return list.map((r) => ({
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
  }));
};

exports.updateManpowerRequirementStatus = async (requirementId, status, extraPayload = {}) => {
  const record = await ManpowerRequirement.findByPk(requirementId);
  if (!record) throw new Error('Manpower requirement not found');
  record.status = status;
  if (extraPayload && extraPayload.submittedCandidates && Array.isArray(extraPayload.submittedCandidates)) {
    const jsonTag = `\n[SUBMITTED_CANDIDATES:${JSON.stringify(extraPayload.submittedCandidates)}]`;
    const existingDesc = record.description || '';
    if (!existingDesc.includes('[SUBMITTED_CANDIDATES:')) {
      record.description = existingDesc + jsonTag;
    } else {
      record.description = existingDesc.replace(/\[SUBMITTED_CANDIDATES:.*?\]/, `[SUBMITTED_CANDIDATES:${JSON.stringify(extraPayload.submittedCandidates)}]`);
    }

    try {
      if (Candidate) {
        const candIds = extraPayload.submittedCandidates.map(c => typeof c === 'object' ? (c.id || c.dbId || c.candidateCode) : c).filter(Boolean);
        if (candIds.length > 0) {
          await Candidate.update(
            { status: 'Working' },
            {
              where: {
                [Op.or]: [
                  { id: { [Op.in]: candIds } },
                  { candidateCode: { [Op.in]: candIds } }
                ]
              }
            }
          );
        }
      }
    } catch (cErr) {
      console.warn('Candidate status DB update note:', cErr.message);
    }
  }
  await record.save();
  return record;
};

exports.getManpowerDashboardSummary = async (ownerId) => {
  let horecaRegId = isUuid(ownerId) ? ownerId : null;
  let userId = isUuid(ownerId) ? ownerId : null;

  if (isUuid(ownerId)) {
    const horecaReg = await HorecaRegistration.findOne({
      where: {
        [Op.or]: [{ id: ownerId }, { userId: ownerId }]
      }
    });

    if (horecaReg) {
      horecaRegId = horecaReg.id;
      userId = horecaReg.userId;
    }
  }

  const whereClause = (horecaRegId || userId) ? {
    ownerId: { [Op.or]: [horecaRegId, userId].filter(Boolean) }
  } : {};

  const reqs = await ManpowerRequirement.findAll({
    where: whereClause,
    include: [{ model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] }],
    order: [['createdAt', 'DESC']],
  });

  const activeRequirements = reqs.filter(r => ['pending', 'active', 'open'].includes(r.status)).length;
  const agencyResponses = reqs.filter(r => ['candidates_sent', 'submitted', 'responses', 'accepted'].includes(r.status)).length;
  const shortlistedCandidates = reqs.filter(r => r.status === 'shortlisted').length;
  const selectedStaff = reqs.filter(r => ['selected', 'hired', 'confirmed', 'completed', 'filled'].includes(r.status)).length;

  const recentRequirements = reqs.slice(0, 5).map(r => ({
    id: r.id,
    reqId: `#${r.id.slice(0, 8).toUpperCase()}`,
    role: r.jobRole || 'Manpower Requirement',
    staffRequired: r.numberOfStaff || '1',
    responses: ['candidates_sent', 'submitted', 'responses', 'accepted'].includes(r.status) ? 1 : 0,
    salary: r.salaryRange || '—',
    joiningDate: r.joiningDate || 'Immediate',
    postedDate: new Date(r.createdAt).toLocaleDateString('en-IN'),
    status: (r.status === 'candidates_sent' || r.status === 'submitted') ? 'Responses' : (r.status === 'pending' ? 'Active' : (r.status.charAt(0).toUpperCase() + r.status.slice(1))),
  }));

  const topVendors = await VendorRegistration.findAll({
    where: {
      [Op.or]: [
        { vendorType: { [Op.like]: '%manpower%' } },
        { vendorType: { [Op.like]: '%Manpower%' } }
      ]
    },
    limit: 5,
    order: [['createdAt', 'DESC']],
  });

  const topAgencies = topVendors.map(v => ({
    id: v.id,
    name: v.bizName || 'Manpower Agency',
    verified: v.status === 'approved' || v.status === 'registered',
    rating: 4.8,
    location: v.city || 'Unknown',
    experience: '3+ Years',
    availableStaff: '15+',
    logo: (v.bizName || 'A').charAt(0).toUpperCase(),
    roles: v.subCategory ? v.subCategory.split(',').map(s => s.trim()) : ['Chef', 'Waiter', 'Kitchen Helper'],
    replacementPolicy: '30 Days'
  }));

  return {
    summary: {
      activeRequirements,
      agencyResponses,
      shortlistedCandidates,
      selectedStaff
    },
    recentRequirements,
    topAgencies
  };
};

