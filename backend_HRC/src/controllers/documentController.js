const {
  getUserComplianceDocuments,
  saveUserComplianceDocument,
  deleteUserComplianceDocument,
} = require('../services/documentService');
const cloudinaryService = require('../services/cloudinary.service');
const { Document } = require('../models');

exports.getUserDocuments = async (req, res) => {
  try {
    const requester = req.user || {};
    const userId = req.params.userId || requester.id || requester.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const data = await getUserComplianceDocuments(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching user compliance documents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveDocument = async (req, res) => {
  try {
    const doc = await saveUserComplianceDocument(req.body);
    res.status(201).json({ success: true, message: 'Document saved successfully', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Ownership check: ensure document belongs to the requesting user
    const record = await Document.findByPk(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }
    const requester = req.user || {};
    const requesterId = String(requester.id || requester.userId || '').toLowerCase().trim();
    const ownerId = String(record.userId || '').toLowerCase().trim();

    if (requester.role !== 'admin' && requesterId && ownerId && requesterId !== ownerId) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own documents.' });
    }

    const result = await deleteUserComplianceDocument(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/documents/upload-compliance — Upload compliance file to Cloudinary as private/authenticated
exports.uploadComplianceFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: 'File size must be 5MB or smaller.' });
  }

  const userId = req.user.id;
  const folder = `hrc-hub/compliance/${userId}`;
  const isRawPdf = req.file.mimetype === 'application/pdf';

  let cloudinaryResult;
  try {
    cloudinaryResult = await cloudinaryService.uploadDocument(
      req.file.buffer,
      req.file.originalname,
      folder,
      isRawPdf
    );
  } catch (uploadError) {
    console.error('Compliance file Cloudinary upload error:', uploadError);
    return res.status(500).json({ success: false, message: 'File upload to storage failed.' });
  }

  // Return signed temporary URL — never expose the permanent authenticated URL
  const signedUrl = cloudinaryService.getSignedDocumentUrl({
    publicId: cloudinaryResult.cloudinaryPublicId,
    resourceType: cloudinaryResult.resourceType,
    deliveryType: cloudinaryResult.deliveryType,
    format: cloudinaryResult.format,
    expiresInSeconds: 3600,
  });

  return res.status(200).json({
    success: true,
    message: 'Compliance file uploaded successfully.',
    data: {
      fileUrl: signedUrl,
      urlExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      cloudinaryPublicId: cloudinaryResult.cloudinaryPublicId,
      cloudinaryAssetId: cloudinaryResult.cloudinaryAssetId,
      secureUrl: cloudinaryResult.secureUrl,
      resourceType: cloudinaryResult.resourceType,
      deliveryType: cloudinaryResult.deliveryType,
      format: cloudinaryResult.format,
      mimeType: cloudinaryResult.mimeType,
      fileSize: cloudinaryResult.fileSize,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      originalName: cloudinaryResult.originalName,
    },
  });
};
