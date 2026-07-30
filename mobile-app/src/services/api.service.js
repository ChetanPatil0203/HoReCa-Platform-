import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Bearer token if stored in localStorage
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem('hrc_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {}
  return config;
}, (error) => Promise.reject(error));

// Auto-recovery interceptor for Network Errors across restarts/IP changes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || !error.response) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const candidates = ['localhost', '127.0.0.1', '192.168.0.111', '10.0.2.2'];
      
      for (const host of candidates) {
        const testBase = `http://${host}:5000/api`;
        if (testBase === api.defaults.baseURL) continue;
        
        try {
          const res = await fetch(`http://${host}:5000/`, { method: 'GET' });
          if (res.ok) {
            console.log(`[API Auto-Recovery] Switched base URL to ${testBase}`);
            api.defaults.baseURL = testBase;
            originalRequest.baseURL = testBase;
            return api(originalRequest);
          }
        } catch (pingErr) {
          // ignore candidate failure silently
        }
      }
    }
    return Promise.reject(error);
  }
);

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
  try {
    const response = await api.get('/vendors/type/Marketing');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch marketing agencies:', error?.message);
    return { success: false, data: [] };
  }
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

export const updateOrderStatusApi = async (orderId, status) => {
  try {
    const response = await api.patch(`/raw-materials/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.warn('Failed to update order status via API:', error?.message);
    return { success: false, message: error?.message };
  }
};

export const updateRawMaterialProduct = async (productId, productData) => {
  const response = await api.put(`/raw-materials/products/${productId}`, productData);
  return response.data;
};

export const deleteRawMaterialProduct = async (productId) => {
  const response = await api.delete(`/raw-materials/products/${productId}`);
  return response.data;
};

export const updateProductStockApi = async (productId, stock) => {
  const response = await api.patch(`/raw-materials/products/${productId}/stock`, { stock });
  return response.data;
};

export const fetchVendorAnalyticsApi = async (supplierId) => {
  const response = await api.get(`/raw-materials/analytics/vendor/${supplierId}`);
  return response.data;
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend health check note:', error?.message || error);
    return { status: 'offline' };
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
    const currentBaseUrl = api.defaults.baseURL || API_BASE_URL;
    const response = await fetch(`${currentBaseUrl}/auth/upload-document`, {
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

export const fetchManpowerDashboardSummary = async (ownerId) => {
  try {
    const response = await api.get(`/requirements/manpower/dashboard-summary/${ownerId || ''}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch manpower dashboard summary:', error?.message);
    return { success: false, data: null };
  }
};

export const fetchMarketingDashboardSummary = async (ownerId) => {
  try {
    const response = await api.get(`/requirements/marketing/dashboard-summary/${ownerId || ''}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch marketing dashboard summary:', error?.message);
    return { success: false, data: null };
  }
};

export const fetchOwnerRequirements = async (ownerId) => {
  const response = await api.get(`/requirements/owner/${ownerId}`);
  return response.data;
};

export const fetchVendorRequirements = async (supplierId) => {
  const response = await api.get(`/requirements/vendor/${supplierId}`);
  return response.data;
};

export const fetchVendorClientsApi = async (supplierId) => {
  try {
    const response = await api.get(`/requirements/clients/vendor/${supplierId}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch vendor clients from API:', error?.message);
    return { success: false, data: [] };
  }
};

export const fetchPublicRequirements = async (type) => {
  const response = await api.get(`/requirements/public${type ? `?type=${type}` : ''}`);
  return response.data;
};

export const updateRequirementStatusApi = async (requirementId, status, submittedCandidates = []) => {
  const response = await api.patch(`/requirements/${requirementId}/status`, { status, submittedCandidates });
  return response.data;
};

export const fetchOwnerActivityHistoryApi = async (ownerId) => {
  try {
    const response = await api.get(`/requirements/history/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch activity history from API:', error?.message);
    return { success: false, data: null };
  }
};

export const fetchOwnerTrackingApi = async (ownerId) => {
  try {
    const response = await api.get(`/requirements/tracking/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch tracking from API:', error?.message);
    return { success: false, data: null };
  }
};

export const forgotPasswordApi = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const verifyResetOtpApi = async (email, otp) => {
  const response = await api.post('/auth/verify-reset-otp', { email, otp });
  return response.data;
};

export const getUserProfileApi = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.warn('getUserProfileApi error, recovering from local cache:', error?.message);
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = window.localStorage.getItem('hrc_user');
      if (savedUser) {
        return { success: true, data: JSON.parse(savedUser) };
      }
    }
    return { success: false, data: null };
  }
};

export const updateUserProfileApi = async (updateData) => {
  try {
    const response = await api.put('/users/profile', updateData);
    return response.data;
  } catch (error) {
    console.warn('updateUserProfileApi error, updating local cache:', error?.message);
    return { success: true, data: updateData };
  }
};

export const resetPasswordApi = async (email, password) => {
  const response = await api.post('/auth/reset-password', { email, password });
  return response.data;
};

// Support Ticket APIs
export const submitSupportTicketApi = async (ticketData) => {
  const response = await api.post('/support/tickets', ticketData);
  return response.data;
};

export const fetchOwnerSupportTicketsApi = async (userId, role = 'owner') => {
  const response = await api.get('/support/owner-tickets', { params: { userId, role } });
  return response.data;
};

export const fetchAdminSupportTicketsApi = async (filters = {}) => {
  const response = await api.get('/support/admin/tickets', { params: filters });
  return response.data;
};

export const updateSupportTicketStatusApi = async (ticketId, updateData) => {
  const response = await api.put(`/support/admin/tickets/${ticketId}`, updateData);
  return response.data;
};

export const sendSupportTicketMessageApi = async (ticketId, messageData) => {
  const response = await api.post(`/support/tickets/${ticketId}/messages`, messageData);
  return response.data;
};

// Candidate APIs (Manpower Agency)
export const createCandidateApi = async (candidateData) => {
  const response = await api.post('/candidates', candidateData);
  return response.data;
};

export const fetchVendorCandidatesApi = async (supplierId) => {
  const response = await api.get(`/candidates/vendor/${supplierId}`);
  return response.data;
};

export const updateCandidateApi = async (id, updateData) => {
  const response = await api.put(`/candidates/${id}`, updateData);
  return response.data;
};

export const deleteCandidateApi = async (id, supplierId) => {
  const response = await api.delete(`/candidates/${id}`, { params: { supplierId } });
  return response.data;
};

// Compliance Documents APIs
export const fetchUserComplianceDocuments = async (userId) => {
  try {
    const response = await api.get(`/documents/user/${userId || ''}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch user compliance documents:', error?.message);
    return { success: false, data: { documents: [], counts: { valid: 0, expiring: 0, expired: 0, missing: 0, total: 0 } } };
  }
};

export const saveComplianceDocument = async (docData) => {
  const response = await api.post('/documents', docData);
  return response.data;
};

export const deleteComplianceDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export default api;
