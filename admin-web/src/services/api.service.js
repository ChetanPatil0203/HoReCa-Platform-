const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all registered HoReCa establishments from backend API
 */
export const fetchHorecaRegistrations = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/horeca-registrations`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for HoReCa registrations:', err.message);
    return null;
  }
};

/**
 * Fetch all registered vendors from backend API
 */
export const fetchVendorRegistrations = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/vendor-registrations`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for Vendor registrations:', err.message);
    return null;
  }
};

/**
 * Fetch full login logs audit history from backend API
 */
export const fetchLoginLogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login-logs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for Login logs:', err.message);
    return null;
  }
};

/**
 * Fetch aggregated dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for Dashboard stats:', err.message);
    return null;
  }
};

/**
 * Fetch Admin Team
 */
export const fetchAdminTeam = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/team`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for Admin Team:', err.message);
    return null;
  }
};

/**
 * Update verification status (Approved / Rejected) for a registration
 * @param {string} registrationId - UUID of registration
 * @param {string} type - 'horeca' | 'vendor'
 * @param {string} status - 'approved' | 'rejected'
 */
export const updateVerificationStatus = async (registrationId, type, status) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/verify-registration`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId, type, status }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Failed to update verification status on backend:', err.message);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch all system limits and quotas
 */
export const fetchSystemLimitsApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/limits`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('Backend API unreachable for System Limits:', err.message);
    return null;
  }
};

/**
 * Update system limits
 * @param {Array<{key: string, value: string}>} limits
 */
export const updateSystemLimitsApi = async (limits) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/limits`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limits }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Failed to update system limits on backend:', err.message);
    return { success: false, message: err.message };
  }
};
