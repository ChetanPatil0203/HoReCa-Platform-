import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const registerApi = async (registrationData) => {
  const response = await api.post('/auth/register', registrationData);
  return response.data;
};

export const verifyOTPApi = async (otp, token) => {
  const response = await api.post(
    '/auth/verify-otp',
    { otp },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default api;
