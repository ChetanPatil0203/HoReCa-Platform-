const cloudinary = require('../config/cloudinary');
const path = require('path');

const uploadStream = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
};

/**
 * Upload an image to Cloudinary as public.
 */
exports.uploadImage = async (fileBuffer, originalname, folder) => {
  const ext = path.extname(originalname);
  const nameWithoutExt = path.basename(originalname, ext);
  const options = {
    folder,
    public_id: `${nameWithoutExt}-${Date.now()}`,
    resource_type: 'image',
    type: 'upload', // public delivery type
    invalidate: true
  };
  const result = await uploadStream(fileBuffer, options);
  return {
    cloudinaryPublicId: result.public_id,
    cloudinaryAssetId: result.asset_id,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    deliveryType: result.type,
    format: result.format,
    mimeType: `${result.resource_type}/${result.format}`,
    fileSize: result.bytes,
    width: result.width,
    height: result.height,
    originalName: originalname
  };
};

/**
 * Upload a document to Cloudinary as private/authenticated.
 */
exports.uploadDocument = async (fileBuffer, originalname, folder, isRaw = false) => {
  const ext = path.extname(originalname);
  const nameWithoutExt = path.basename(originalname, ext);
  
  const options = {
    folder,
    public_id: `${nameWithoutExt}-${Date.now()}`,
    resource_type: isRaw ? 'raw' : 'image',
    type: 'authenticated', // private delivery type
    invalidate: true
  };
  
  const result = await uploadStream(fileBuffer, options);
  
  // Note: for raw resources format is usually empty or not available
  const format = result.format || ext.replace('.', '');
  
  return {
    cloudinaryPublicId: result.public_id,
    cloudinaryAssetId: result.asset_id,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    deliveryType: result.type,
    format: format,
    mimeType: isRaw ? 'application/octet-stream' : `${result.resource_type}/${format}`,
    fileSize: result.bytes,
    width: result.width || null,
    height: result.height || null,
    originalName: originalname
  };
};

/**
 * Delete an asset from Cloudinary.
 */
exports.deleteAsset = async (publicId, resourceType = 'image', deliveryType = 'upload') => {
  if (!publicId) return null;
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: deliveryType,
    invalidate: true
  });
};

/**
 * Generate a signed time-limited URL for authenticated document download/preview.
 * Uses Cloudinary private_download_url which generates a signed API-level URL
 * that automatically expires at the given timestamp.
 */
exports.getSignedDocumentUrl = ({
  publicId,
  resourceType,
  deliveryType,
  format,
  expiresInSeconds = 3600
}) => {
  if (!publicId) return null;
  const expires_at = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.utils.private_download_url(publicId, format || '', {
    resource_type: resourceType || 'image',
    type: deliveryType || 'authenticated',
    expires_at,
    attachment: false, // inline preview (not forced download)
  });
};

/**
 * Generate public URL with q_auto, f_auto delivery transformations
 */
exports.getPublicImageUrl = (publicId, format) => {
  if (!publicId) return null;
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    format: format
  });
};
