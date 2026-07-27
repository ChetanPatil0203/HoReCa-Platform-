import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchComplaintsApi = async () => {
  const response = await api.get('/vendor/complaints');
  return response.data;
};

// --- Generic Vendor APIs ---
export const fetchManpowerVendors = async () => {
  const response = await api.get('/vendors/type/Manpower');
  return response.data;
};

export const fetchServiceProviders = async () => {
  const response = await api.get('/vendors/type/Service Provider');
  return response.data;
};

export const fetchMarketingAgencies = async () => {
  const response = await api.get('/vendors/type/Marketing Agency');
  return response.data;
};

// --- Raw Material APIs ---
export const fetchRawMaterialCategories = async () => {
  const response = await api.get('/raw-materials/categories');
  return response.data;
};

export const fetchRawMaterialProducts = async (categoryId = null, supplierId = null) => {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (supplierId) params.supplierId = supplierId;
  
  const response = await api.get('/raw-materials/products', { params });
  return response.data;
};

export const createRawMaterialProduct = async (productData) => {
  const response = await api.post('/raw-materials/products', productData);
  return response.data;
};

export const fetchRawMaterialSuppliers = async () => {
  const response = await api.get('/raw-materials/suppliers');
  return response.data;
};

export const placeRawMaterialOrder = async (orderData) => {
  const response = await api.post('/raw-materials/orders', orderData);
  return response.data;
};

export const fetchRawMaterialOrders = async (ownerId) => {
  const response = await api.get(`/raw-materials/orders/owner/${ownerId}`);
  return response.data;
};

export const fetchOrderById = async (orderId) => {
  const response = await api.get(`/raw-materials/orders/${orderId}`);
  return response.data;
};

export const cancelRawMaterialOrder = async (orderId, reason) => {
  const response = await api.patch(`/raw-materials/orders/${orderId}/cancel`, { reason });
  return response.data;
};

// Vendor: Fetch all incoming orders for a vendor
export const fetchVendorOrders = async (supplierId) => {
  const response = await api.get(`/raw-materials/orders/vendor/${supplierId}`);
  return response.data;
};

// Vendor: Accept or Reject an incoming order
export const vendorRespondOrder = async (orderId, supplierId, action) => {
  const response = await api.patch(`/raw-materials/orders/${orderId}/vendor-respond`, { supplierId, action });
  return response.data;
};

// Vendor: Update status of an order
export const updateOrderStatusApi = async (orderId, status) => {
  const response = await api.patch(`/raw-materials/orders/${orderId}/status`, { status });
  return response.data;
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};

export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Upload a single document file to the server.
 * @param {object} file - Expo DocumentPicker asset { uri, name, mimeType }
 * @param {string} docKey - e.g. 'fssai', 'gst', 'pan'
 * @param {string} token - JWT Bearer token
 * @returns {string} fileUrl - the server-hosted file URL
 */
export const uploadDocumentApi = async (file, docKey, token) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name || `${docKey}.pdf`,
    type: file.mimeType || 'application/pdf',
  });
  formData.append('docKey', docKey);
  formData.append('docName', file.name || docKey);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/upload-document`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.data?.fileUrl;
  } catch (error) {
    console.error(`Upload error for ${docKey}:`, error);
    throw error;
  }
};

/**
 * Register user: first registers to get token, then uploads documents.
 * Documents in registrationData are Expo file assets { uri, name, mimeType }.
 */
export const registerApi = async (registrationData) => {
  const { documents = {}, ...restData } = registrationData;

  // Step 1: Register without documents first to get the user token
  const registerResponse = await api.post('/auth/register', {
    ...restData,
    documents: {}, // register without docs first
  });

  const token = registerResponse.data?.data?.token;

  // Step 2: Upload each document file and collect server URLs
  if (token && Object.keys(documents).length > 0) {
    const uploadedDocs = {};
    for (const [docKey, fileAsset] of Object.entries(documents)) {
      if (fileAsset && fileAsset.uri) {
        try {
          const fileUrl = await uploadDocumentApi(fileAsset, docKey, token);
          if (fileUrl) {
            uploadedDocs[docKey] = { uri: fileUrl, name: fileAsset.name || docKey };
          }
        } catch (uploadErr) {
          console.warn(`Failed to upload doc "${docKey}":`, uploadErr.message);
        }
      }
    }
  }

  return registerResponse.data;
};

export const verifyOTPApi = async (otp, token) => {
  const response = await api.post(
    '/auth/verify-otp',
    { otp },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const resendOTPApi = async (token) => {
  const response = await api.post(
    '/auth/resend-otp',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Requirement API Module (Manpower, Marketing, Service Provider)
export const createRequirementApi = async (data) => {
  const response = await api.post('/requirements', data);
  return response.data;
};

export const fetchOwnerRequirements = async (ownerId) => {
  const response = await api.get(`/requirements/owner/${ownerId}`);
  return response.data;
};

export const fetchVendorRequirements = async (supplierId) => {
  const response = await api.get(`/requirements/vendor/${supplierId}`);
  return response.data;
};

export const fetchPublicRequirements = async (type) => {
  const response = await api.get(`/requirements/public${type ? `?type=${type}` : ''}`);
  return response.data;
};

export const updateRequirementStatusApi = async (requirementId, status) => {
  const response = await api.patch(`/requirements/${requirementId}/status`, { status });
  return response.data;
};

export default api;
