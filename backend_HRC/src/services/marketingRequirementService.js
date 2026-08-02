const { Op } = require('sequelize');
const {
  MarketingRequirement,
  HorecaRegistration,
  VendorRegistration,
  MarketingProposal,
  MarketingCreative,
  MarketingTeamMember,
  MarketingCampaignMetric,
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

exports.getMarketingDashboardSummary = async (ownerId) => {
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

  const reqs = await MarketingRequirement.findAll({
    where: whereClause,
    include: [{ model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] }],
    order: [['createdAt', 'DESC']],
  });

  const activeReq = reqs.filter(r => ['pending', 'active', 'open', 'in_progress', 'submitted'].includes(r.status)).length;
  const proposals = reqs.filter(r => ['candidates_sent', 'submitted', 'responses', 'proposal_received', 'shortlisted'].includes(r.status) || r.supplierId).length;
  const campaigns = reqs.filter(r => ['active', 'running', 'in_progress', 'campaign_started'].includes(r.status)).length;
  const completed = reqs.filter(r => ['completed', 'finished', 'closed'].includes(r.status)).length;

  const myRequirements = reqs.map(r => ({
    id: `#${r.id.slice(0, 8).toUpperCase()}`,
    _rawId: r.id,
    title: r.campaignType || 'Marketing Campaign',
    service: r.services || r.businessType || 'Marketing Service',
    status: r.status === 'pending' ? 'Open' : (r.status.charAt(0).toUpperCase() + r.status.slice(1)),
    budget: r.budget || '—',
    proposals: ['submitted', 'responses', 'proposal_received'].includes(r.status) || r.supplierId ? 1 : 0,
    createdAt: r.createdAt
  }));

  const recentProposals = reqs.filter(r => r.supplier || r.supplierId).map(r => ({
    id: r.id,
    initials: (r.supplier?.bizName || 'MA').substring(0, 2).toUpperCase(),
    agencyName: r.supplier?.bizName || 'Verified Marketing Agency',
    verified: true,
    rating: '4.9',
    reqName: r.campaignType || 'Marketing Campaign',
    amount: r.budget || 'Market Rate',
    duration: r.duration || 'Monthly',
  }));

  return {
    metrics: {
      activeReq,
      proposals,
      campaigns,
      completed
    },
    myRequirements,
    recentProposals
  };
};

// --- Marketing Proposals ---
exports.createMarketingProposalService = async (data) => {
  const supplierId = await resolveVendorId(data.supplierId);
  const proposal = await MarketingProposal.create({
    requirementId: data.requirementId || null,
    supplierId,
    amount: String(data.amount || '0'),
    strategy: data.strategy,
    services: data.services,
    deliverables: data.deliverables,
    duration: data.duration,
    startDate: data.startDate,
    completionDate: data.completionDate,
    teamSize: data.teamSize,
    paymentTerms: data.paymentTerms,
    revisionLimit: data.revisionLimit,
    notes: data.notes,
    onlineFields: typeof data.onlineFields === 'object' ? JSON.stringify(data.onlineFields) : data.onlineFields,
    offlineFields: typeof data.offlineFields === 'object' ? JSON.stringify(data.offlineFields) : data.offlineFields,
    status: 'submitted',
  });

  if (data.requirementId) {
    await MarketingRequirement.update({ status: 'proposal_received', supplierId }, { where: { id: data.requirementId } });
  }

  return proposal;
};

exports.getRequirementProposalsService = async (requirementId) => {
  return await MarketingProposal.findAll({
    where: { requirementId },
    include: [{ model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] }],
    order: [['createdAt', 'DESC']],
  });
};

exports.acceptMarketingProposalService = async (proposalId) => {
  const proposal = await MarketingProposal.findByPk(proposalId);
  if (!proposal) throw new Error('Proposal not found');

  proposal.status = 'accepted';
  await proposal.save();

  if (proposal.requirementId) {
    await MarketingRequirement.update(
      { status: 'active', supplierId: proposal.supplierId },
      { where: { id: proposal.requirementId } }
    );
  }

  return proposal;
};

// --- Marketing Creatives & Approvals ---
exports.createMarketingCreativeService = async (data) => {
  const supplierId = await resolveVendorId(data.supplierId);
  return await MarketingCreative.create({
    requirementId: data.requirementId || null,
    supplierId,
    title: data.title,
    type: data.type || 'Social Post',
    version: data.version || 'v1.0',
    description: data.description,
    fileUrl: data.fileUrl,
    notes: data.notes,
    status: 'pending',
  });
};

exports.getRequirementCreativesService = async (requirementId) => {
  return await MarketingCreative.findAll({
    where: { requirementId },
    order: [['createdAt', 'DESC']],
  });
};

exports.updateCreativeStatusService = async (creativeId, { status, clientFeedback }) => {
  const creative = await MarketingCreative.findByPk(creativeId);
  if (!creative) throw new Error('Creative not found');

  if (status) creative.status = status;
  if (clientFeedback !== undefined) creative.clientFeedback = clientFeedback;
  await creative.save();

  return creative;
};

// --- Agency Team Roster ---
exports.createTeamMemberService = async (data) => {
  const supplierId = await resolveVendorId(data.supplierId);
  return await MarketingTeamMember.create({
    supplierId,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    activeCampaigns: typeof data.activeCampaigns === 'object' ? JSON.stringify(data.activeCampaigns) : data.activeCampaigns,
    status: data.status || 'Active',
  });
};

exports.getVendorTeamMembersService = async (supplierId) => {
  const vendorId = await resolveVendorId(supplierId);
  const searchIds = [supplierId, vendorId].filter(id => isUuid(id));
  if (searchIds.length === 0) return [];
  return await MarketingTeamMember.findAll({
    where: { supplierId: { [Op.in]: searchIds } },
    order: [['createdAt', 'DESC']],
  });
};

exports.updateTeamMemberService = async (id, updateData) => {
  const member = await MarketingTeamMember.findByPk(id);
  if (!member) throw new Error('Team member not found');
  if (updateData.activeCampaigns && typeof updateData.activeCampaigns === 'object') {
    updateData.activeCampaigns = JSON.stringify(updateData.activeCampaigns);
  }
  await member.update(updateData);
  return member;
};

exports.deleteTeamMemberService = async (id) => {
  const member = await MarketingTeamMember.findByPk(id);
  if (!member) throw new Error('Team member not found');
  await member.destroy();
  return { success: true };
};

// --- Revenue Analytics & Metrics ---
exports.getVendorRevenueAnalyticsService = async (supplierId) => {
  const vendorId = await resolveVendorId(supplierId);
  const searchIds = [supplierId, vendorId].filter(id => isUuid(id));
  
  if (searchIds.length === 0) {
    return {
      totalRevenue: 0,
      activeRetainersCount: 0,
      acceptedProposalsCount: 0,
      recentEarnings: [],
    };
  }

  const acceptedProposals = await MarketingProposal.findAll({
    where: {
      supplierId: { [Op.in]: searchIds },
      status: 'accepted',
    },
  });

  const totalRevenue = acceptedProposals.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const activeRetainersCount = acceptedProposals.filter(p => p.duration && p.duration.toLowerCase().includes('month')).length;

  return {
    totalRevenue,
    activeRetainersCount,
    acceptedProposalsCount: acceptedProposals.length,
    recentEarnings: acceptedProposals.map(p => ({
      proposalId: p.id,
      amount: p.amount,
      date: p.updatedAt,
    })),
  };
};

