const { Candidate, VendorRegistration, User } = require('../models');
const { Op } = require('sequelize');

// Helper to resolve vendor ID
const resolveVendorId = async (idOrUserId) => {
  if (!idOrUserId) return null;
  try {
    const reg = await VendorRegistration.findOne({
      where: {
        [Op.or]: [{ id: idOrUserId }, { userId: idOrUserId }]
      }
    });
    if (reg) return reg.id;
  } catch (err) {
    console.warn('resolveVendorId query warning:', err.message);
  }
  return null;
};

exports.createCandidateService = async (data) => {
  const resolvedId = await resolveVendorId(data.supplierId);
  
  // Calculate next numeric candidate ID
  const latest = await Candidate.findOne({
    order: [['createdAt', 'DESC']],
    attributes: ['candidateCode'],
  });

  let nextNum = 1001;
  if (latest && latest.candidateCode) {
    const match = latest.candidateCode.match(/C-(\d+)/i);
    if (match && match[1]) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  let candidateCode = `C-${nextNum}`;
  let exists = await Candidate.findOne({ where: { candidateCode } });
  while (exists) {
    nextNum += 1;
    candidateCode = `C-${nextNum}`;
    exists = await Candidate.findOne({ where: { candidateCode } });
  }

  const candidate = await Candidate.create({
    supplierId: resolvedId || (data.supplierId && data.supplierId.length === 36 ? data.supplierId : null),
    candidateCode,
    name: data.name,
    mobile: data.mobile,
    role: data.role || 'Staff',
    experience: data.experience || 'Fresh / 1 Year',
    salary: data.salary || 'Market Rate',
    location: data.location || 'Local',
    status: data.status || 'Available',
    verification: data.documents && Object.keys(data.documents).length > 0 ? 'Pending Verification' : (data.verification || 'Pending'),
    skills: Array.isArray(data.skills) ? data.skills : (data.skills ? [data.skills] : []),
    documents: data.documents || {},
    notes: data.notes || null,
  });

  return candidate;
};

exports.getVendorCandidatesService = async (supplierId) => {
  const isInvalid = !supplierId || supplierId === 'undefined' || supplierId === 'null' || supplierId === 'all';
  
  if (!isInvalid) {
    const resolvedId = await resolveVendorId(supplierId);
    const searchIds = [supplierId];
    if (resolvedId && !searchIds.includes(resolvedId)) searchIds.push(resolvedId);

    const candidates = await Candidate.findAll({
      where: {
        [Op.or]: [
          { supplierId: { [Op.in]: searchIds } },
          { supplierId: null }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    if (candidates && candidates.length > 0) {
      return candidates;
    }
  }

  // Fallback: Return all candidate records
  return await Candidate.findAll({
    order: [['createdAt', 'DESC']]
  });
};

exports.updateCandidateService = async (id, supplierId, updateData) => {
  const resolvedId = await resolveVendorId(supplierId);

  const candidate = await Candidate.findOne({
    where: {
      id,
      supplierId: { [Op.or]: [resolvedId, supplierId] }
    }
  });

  if (!candidate) {
    throw new Error('Candidate not found or unauthorized');
  }

  await candidate.update(updateData);
  return candidate;
};

exports.deleteCandidateService = async (id, supplierId) => {
  const resolvedId = await resolveVendorId(supplierId);

  const candidate = await Candidate.findOne({
    where: {
      id,
      supplierId: { [Op.or]: [resolvedId, supplierId] }
    }
  });

  if (!candidate) {
    throw new Error('Candidate not found or unauthorized');
  }

  await candidate.destroy();
  return { success: true, message: 'Candidate deleted successfully' };
};
