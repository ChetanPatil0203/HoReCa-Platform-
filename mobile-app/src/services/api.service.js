import axios from 'axios';
import { Platform } from 'react-native';
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
 * Upload a KYC/registration document or profile photo to Cloudinary via backend.
 * Works on both web (blob) and mobile (RN file object).
 * @param {object} file - Expo DocumentPicker asset { uri, name, mimeType, file? }
 * @param {string} docKey - 'profile_photo' | 'pan' | 'gst' | 'fssai' | etc.
 * @param {string} token  - JWT Bearer token
 * @returns {object} Full API response { success, data: { fileUrl, cloudinaryPublicId, ... } }
 */
export const uploadDocumentApi = async (file, docKey, token) => {
  const formData = new FormData();
  if (Platform.OS === 'web') {
    if (file.file) {
      // Native File object from web input
      formData.append('file', file.file);
    } else {
      try {
        const res = await fetch(file.uri);
        const blob = await res.blob();
        formData.append('file', blob, file.name || `${docKey}.jpg`);
      } catch (err) {
        console.error('Failed to resolve local web file blob:', err);
        throw err;
      }
    }
  } else {
    formData.append('file', {
      uri: file.uri,
      name: file.name || file.fileName || `${docKey}.jpg`,
      type: file.mimeType || file.type || 'application/octet-stream',
    });
  }
  formData.append('docKey', docKey);
  formData.append('docName', file.name || file.fileName || docKey);

  try {
    const currentBaseUrl = api.defaults.baseURL || API_BASE_URL;
    const response = await fetch(`${currentBaseUrl}/auth/upload-document`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Return the full response so callers can access Cloudinary metadata
    return data;
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
          const uploadRes = await uploadDocumentApi(fileAsset, docKey, token);
          const fileUrl = uploadRes?.data?.fileUrl;
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

export const fetchOwnerMainDashboardSummary = async (ownerId) => {
  try {
    const response = await api.get(`/users/owner-dashboard/${ownerId || ''}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch owner main dashboard summary:', error?.message);
    return { success: false, data: null };
  }
};

export const submitServiceProviderQuoteApi = async (requirementId, quoteData) => {
  const response = await api.post(`/service-provider-requirements/${requirementId}/quote`, quoteData);
  return response.data;
};

export const declineServiceProviderRequirementApi = async (requirementId, declineReason) => {
  const response = await api.post(`/service-provider-requirements/${requirementId}/decline`, { declineReason });
  return response.data;
};

// Vendor Offered Services APIs
export const fetchVendorServicesApi = async (vendorId) => {
  try {
    const response = await api.get(`/vendors/services/${vendorId || ''}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch vendor services:', error?.message);
    return { success: false, data: [] };
  }
};

export const saveVendorServiceApi = async (serviceData) => {
  const response = await api.post('/vendors/services', serviceData);
  return response.data;
};

export const updateVendorServiceApi = async (id, serviceData) => {
  const response = await api.put(`/vendors/services/${id}`, serviceData);
  return response.data;
};

export const deleteVendorServiceApi = async (id) => {
  const response = await api.delete(`/vendors/services/${id}`);
  return response.data;
};

export const fetchPublicServiceProviderRequirementsApi = async () => {
  try {
    const response = await api.get('/service-provider-requirements/public');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch public service provider requirements:', error?.message);
    return { success: false, data: [] };
  }
};

export const updateServiceProviderRequirementStatusApi = async (requirementId, status, extraFields = {}) => {
  const response = await api.patch(`/service-provider-requirements/${requirementId}/status`, { status, extraFields });
  return response.data;
};

export const registerPushTokenApi = async (pushToken, userId) => {
  try {
    const response = await api.post('/users/push-token', { pushToken, userId });
    return response.data;
  } catch (error) {
    console.warn('Failed to register push token:', error?.message);
    return { success: false, message: error?.message };
  }
};

// --- Marketing Agency Vendor APIs ---
export const submitMarketingProposalApi = async (proposalData) => {
  const response = await api.post('/requirements/marketing/proposals', proposalData);
  return response.data;
};

export const fetchMarketingProposalsApi = async (requirementId) => {
  const response = await api.get(`/requirements/marketing/proposals/${requirementId}`);
  return response.data;
};

export const acceptMarketingProposalApi = async (proposalId) => {
  const response = await api.patch(`/requirements/marketing/proposals/${proposalId}/accept`);
  return response.data;
};

export const submitMarketingCreativeApi = async (creativeData) => {
  const response = await api.post('/requirements/marketing/creatives', creativeData);
  return response.data;
};

export const fetchMarketingCreativesApi = async (requirementId) => {
  const response = await api.get(`/requirements/marketing/creatives/${requirementId}`);
  return response.data;
};

export const updateMarketingCreativeStatusApi = async (creativeId, statusData) => {
  const response = await api.patch(`/requirements/marketing/creatives/${creativeId}/status`, statusData);
  return response.data;
};

export const fetchMarketingTeamApi = async (supplierId) => {
  const response = await api.get(`/requirements/marketing/team/${supplierId}`);
  return response.data;
};

export const saveMarketingTeamMemberApi = async (memberData) => {
  if (memberData.id) {
    const response = await api.put(`/requirements/marketing/team/${memberData.id}`, memberData);
    return response.data;
  } else {
    const response = await api.post('/requirements/marketing/team', memberData);
    return response.data;
  }
};

export const deleteMarketingTeamMemberApi = async (id) => {
  const response = await api.delete(`/requirements/marketing/team/${id}`);
  return response.data;
};

export const fetchMarketingRevenueAnalyticsApi = async (supplierId) => {
  const response = await api.get(`/requirements/marketing/revenue/${supplierId}`);
  return response.data;
};

// --- Chatbot Backend APIs ---
export const createChatSessionApi = async (title) => {
  const response = await api.post('/chat/session', { title });
  return response.data;
};

export const fetchChatSessionsApi = async () => {
  const response = await api.get('/chat/sessions');
  return response.data;
};

export const deleteChatSessionApi = async (sessionId) => {
  const response = await api.delete(`/chat/sessions/${sessionId}`);
  return response.data;
};

export const fetchSessionMessagesApi = async (sessionId) => {
  const response = await api.get(`/chat/sessions/${sessionId}/messages`);
  return response.data;
};

export const sendChatMessageApi = async (sessionId, text) => {
  const response = await api.post('/chat/message', { sessionId, text });
  return response.data;
};

// --- Cloudinary Upload APIs ---

/**
 * Upload product image to Cloudinary via backend (Public delivery).
 * Works on both web (blob) and mobile (RN file object).
 */
export const uploadProductImageApi = async (file, token) => {
  const formData = new FormData();
  if (Platform.OS === 'web') {
    if (file.file) {
      formData.append('file', file.file);
    } else {
      try {
        const res = await fetch(file.uri);
        const blob = await res.blob();
        formData.append('file', blob, file.name || file.fileName || 'product-image.jpg');
      } catch (err) {
        console.error('Failed to resolve product image blob:', err);
        throw err;
      }
    }
  } else {
    formData.append('file', {
      uri: file.uri,
      name: file.name || file.fileName || 'product-image.jpg',
      type: file.mimeType || file.type || 'image/jpeg',
    });
  }

  const currentBaseUrl = api.defaults.baseURL || API_BASE_URL;
  const response = await fetch(`${currentBaseUrl}/raw-materials/products/upload-image`, {
    method: 'POST',
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

/**
 * Upload compliance document to Cloudinary via backend (Authenticated/private delivery).
 * Works on both web (blob) and mobile (RN file object).
 */
export const uploadComplianceApi = async (file, token) => {
  const formData = new FormData();
  if (Platform.OS === 'web') {
    if (file.file) {
      formData.append('file', file.file);
    } else {
      try {
        const res = await fetch(file.uri);
        const blob = await res.blob();
        formData.append('file', blob, file.name || file.fileName || 'compliance-doc.pdf');
      } catch (err) {
        console.error('Failed to resolve compliance doc blob:', err);
        throw err;
      }
    }
  } else {
    formData.append('file', {
      uri: file.uri,
      name: file.name || file.fileName || 'compliance-doc.pdf',
      type: file.mimeType || file.type || 'application/pdf',
    });
  }

  const currentBaseUrl = api.defaults.baseURL || API_BASE_URL;
  const response = await fetch(`${currentBaseUrl}/documents/upload-compliance`, {
    method: 'POST',
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export default api;
