const { Document, User, HorecaRegistration, VendorRegistration } = require('../models');
const { Op } = require('sequelize');
const cloudinaryService = require('./cloudinary.service');

const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

exports.getUserComplianceDocuments = async (userId) => {
  if (!userId || !isUuid(userId)) {
    return {
      documents: [],
      counts: { valid: 0, expiring: 0, expired: 0, missing: 0, total: 0 }
    };
  }

  let userIds = [userId];

  const horeca = await HorecaRegistration.findOne({
    where: { [Op.or]: [{ id: userId }, { userId }] }
  });
  if (horeca) {
    if (horeca.id && !userIds.includes(horeca.id)) userIds.push(horeca.id);
    if (horeca.userId && !userIds.includes(horeca.userId)) userIds.push(horeca.userId);
  }

  const vendor = await VendorRegistration.findOne({
    where: { [Op.or]: [{ id: userId }, { userId }] }
  });
  if (vendor) {
    if (vendor.id && !userIds.includes(vendor.id)) userIds.push(vendor.id);
    if (vendor.userId && !userIds.includes(vendor.userId)) userIds.push(vendor.userId);
  }

  const docs = await Document.findAll({
    where: { userId: { [Op.in]: userIds } },
    order: [['createdAt', 'DESC']],
  });

  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  const mapped = docs.map((doc) => {
    let computedStatus = 'Valid';
    if (doc.expiryDate) {
      const exp = new Date(doc.expiryDate);
      if (!isNaN(exp.getTime())) {
        const diff = exp.getTime() - now.getTime();
        if (diff < 0) {
          computedStatus = 'Expired';
        } else if (diff <= thirtyDays) {
          computedStatus = 'Expiring Soon';
        }
      }
    }
    if (!doc.fileUrl && !doc.docNumber) {
      computedStatus = 'Missing';
    }

    const docTypeClean = doc.docName || doc.docKey || 'Document';

    // For private/authenticated documents, generate a signed temporary URL
    let accessFileUrl = doc.fileUrl || '';
    let urlExpiresAt = null;
    if (doc.deliveryType === 'authenticated' && doc.cloudinaryPublicId) {
      accessFileUrl = cloudinaryService.getSignedDocumentUrl({
        publicId: doc.cloudinaryPublicId,
        resourceType: doc.resourceType || 'image',
        deliveryType: doc.deliveryType,
        format: doc.format,
        expiresInSeconds: 3600,
      });
      urlExpiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
    }

    return {
      id: doc.id,
      name: docTypeClean,
      type: docTypeClean,
      licenseNumber: doc.docNumber || '',
      status: doc.status && ['Valid', 'Expiring Soon', 'Expired', 'Missing'].includes(doc.status) ? doc.status : computedStatus,
      issueDate: doc.issueDate || '',
      expiryDate: doc.expiryDate || '',
      uploadedFile: doc.originalName || (doc.fileUrl ? doc.fileUrl.split('/').pop() : ''),
      fileUrl: accessFileUrl,
      ...(urlExpiresAt ? { urlExpiresAt } : {}),
      notes: doc.notes || '',
      verification: doc.verification || (doc.status === 'approved' ? 'Verified' : 'Pending Verification'),
      uploadedDate: doc.createdAt ? new Date(doc.createdAt).toISOString().split('T')[0] : '',
      history: [
        { event: 'Submitted for Verification', date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN') : 'Recent' }
      ]
    };
  });

  // Synthesize registration document entries if not present in DB
  const existingNames = mapped.map(m => m.name.toLowerCase());
  const regId = horeca?.id || vendor?.id || userId;
  const regCreated = horeca?.createdAt || vendor?.createdAt;

  if (horeca?.fssaiNo || vendor?.fssaiNo) {
    if (!existingNames.some(n => n.includes('fssai'))) {
      mapped.push({
        id: `reg-fssai-${regId}`,
        name: 'FSSAI Licence',
        type: 'FSSAI Licence',
        licenseNumber: horeca?.fssaiNo || vendor?.fssaiNo,
        status: 'Valid',
        issueDate: '',
        expiryDate: '',
        uploadedFile: 'fssai_licence.pdf',
        fileUrl: '',
        verification: 'Verified',
        uploadedDate: regCreated ? new Date(regCreated).toISOString().split('T')[0] : '',
        history: [{ event: 'Verified during Registration', date: 'Registration' }]
      });
    }
  }

  if (horeca?.gstin || vendor?.gstin) {
    if (!existingNames.some(n => n.includes('gst'))) {
      mapped.push({
        id: `reg-gstin-${regId}`,
        name: 'GST Registration',
        type: 'GST Registration',
        licenseNumber: horeca?.gstin || vendor?.gstin,
        status: 'Valid',
        issueDate: '',
        expiryDate: '',
        uploadedFile: 'gst_registration.pdf',
        fileUrl: '',
        verification: 'Verified',
        uploadedDate: regCreated ? new Date(regCreated).toISOString().split('T')[0] : '',
        history: [{ event: 'Verified during Registration', date: 'Registration' }]
      });
    }
  }

  if (horeca?.panNo || vendor?.panNo || horeca?.brn || vendor?.brn) {
    if (!existingNames.some(n => n.includes('pan') || n.includes('business'))) {
      mapped.push({
        id: `reg-pan-${regId}`,
        name: 'Business Registration',
        type: 'Business Registration',
        licenseNumber: horeca?.panNo || horeca?.brn || vendor?.panNo || vendor?.brn,
        status: 'Valid',
        issueDate: '',
        expiryDate: '',
        uploadedFile: 'business_registration.pdf',
        fileUrl: '',
        verification: 'Verified',
        uploadedDate: regCreated ? new Date(regCreated).toISOString().split('T')[0] : '',
        history: [{ event: 'Verified during Registration', date: 'Registration' }]
      });
    }
  }

  // Mandatory Recommended Compliance List
  const RECOMMENDED = ['FSSAI Licence', 'GST Registration', 'Shop & Establishment Licence', 'Fire Safety Certificate / NOC'];
  RECOMMENDED.forEach(recName => {
    const isPresent = mapped.some(m => m.name.toLowerCase().includes(recName.toLowerCase().split(' ')[0]));
    if (!isPresent) {
      mapped.push({
        id: `missing-${recName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: recName,
        type: recName,
        licenseNumber: '',
        status: 'Missing',
        issueDate: '',
        expiryDate: '',
        uploadedFile: '',
        fileUrl: '',
        verification: 'Pending Verification',
        uploadedDate: '',
        history: []
      });
    }
  });

  const counts = {
    valid: mapped.filter(d => d.status === 'Valid').length,
    expiring: mapped.filter(d => d.status === 'Expiring Soon').length,
    expired: mapped.filter(d => d.status === 'Expired').length,
    missing: mapped.filter(d => d.status === 'Missing').length,
    total: mapped.length
  };

  return { documents: mapped, counts };
};

exports.saveUserComplianceDocument = async (data) => {
  const {
    userId, docType, docNumber, issueDate, expiryDate, notes, fileName, fileUrl,
    cloudinaryPublicId, cloudinaryAssetId, secureUrl, resourceType, deliveryType,
    format, mimeType, fileSize, width, height, originalName
  } = data;
  if (!userId || !isUuid(userId)) {
    throw new Error('Valid userId is required');
  }

  const docKey = (docType || 'other').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  let status = 'Valid';

  if (expiryDate) {
    const exp = new Date(expiryDate);
    if (!isNaN(exp.getTime())) {
      const diff = exp.getTime() - now.getTime();
      if (diff < 0) status = 'Expired';
      else if (diff <= thirtyDays) status = 'Expiring Soon';
    }
  }

  // Resolve the stored URL: use Cloudinary secureUrl if available, else fallback
  const resolvedFileUrl = secureUrl || fileUrl || (fileName ? `/uploads/${fileName}` : null);

  const [record, created] = await Document.findOrCreate({
    where: { userId, docKey },
    defaults: {
      userId,
      docKey,
      docName: docType,
      docNumber,
      fileUrl: resolvedFileUrl,
      cloudinaryPublicId: cloudinaryPublicId || null,
      cloudinaryAssetId: cloudinaryAssetId || null,
      secureUrl: secureUrl || null,
      resourceType: resourceType || null,
      deliveryType: deliveryType || null,
      format: format || null,
      mimeType: mimeType || null,
      fileSize: fileSize || null,
      width: width || null,
      height: height || null,
      originalName: originalName || fileName || null,
      issueDate,
      expiryDate,
      notes,
      verification: 'Pending Verification',
      status,
    }
  });

  if (!created) {
    record.docName = docType || record.docName;
    record.docNumber = docNumber || record.docNumber;
    if (resolvedFileUrl) {
      // Delete old Cloudinary asset if replacing
      if (cloudinaryPublicId && record.cloudinaryPublicId && record.cloudinaryPublicId !== cloudinaryPublicId) {
        try {
          await cloudinaryService.deleteAsset(
            record.cloudinaryPublicId,
            record.resourceType || 'image',
            record.deliveryType || 'authenticated'
          );
        } catch (delErr) {
          console.warn('[Cloudinary] Compliance old asset cleanup warning:', delErr.message);
        }
      }
      record.fileUrl = resolvedFileUrl;
      record.cloudinaryPublicId = cloudinaryPublicId || record.cloudinaryPublicId;
      record.cloudinaryAssetId = cloudinaryAssetId || record.cloudinaryAssetId;
      record.secureUrl = secureUrl || record.secureUrl;
      record.resourceType = resourceType || record.resourceType;
      record.deliveryType = deliveryType || record.deliveryType;
      record.format = format || record.format;
      record.mimeType = mimeType || record.mimeType;
      record.fileSize = fileSize || record.fileSize;
      record.width = width || record.width;
      record.height = height || record.height;
      record.originalName = originalName || fileName || record.originalName;
    }
    if (issueDate) record.issueDate = issueDate;
    if (expiryDate) record.expiryDate = expiryDate;
    if (notes) record.notes = notes;
    record.status = status;
    record.verification = 'Pending Verification';
    await record.save();
  }

  return record;
};

exports.deleteUserComplianceDocument = async (id) => {
  const record = await Document.findByPk(id);
  if (!record) throw new Error('Document not found');

  // Delete from Cloudinary if applicable
  if (record.cloudinaryPublicId) {
    try {
      await cloudinaryService.deleteAsset(
        record.cloudinaryPublicId,
        record.resourceType || 'image',
        record.deliveryType || 'authenticated'
      );
    } catch (delErr) {
      console.warn('[Cloudinary] Compliance doc Cloudinary delete warning (continuing DB delete):', delErr.message);
    }
  }

  await record.destroy();
  return { success: true, message: 'Document deleted' };
};
