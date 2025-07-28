import { apiPost, apiGet, apiPut } from './api';

// Register new user
export const register = (userData) => {
  return apiPost('/auth/register', userData);
};

// Login user
export const login = (credentials) => {
  return apiPost('/auth/login', credentials);
};

// Logout user
export const logout = () => {
  return apiPost('/auth/logout');
};

// Get user profile
export const getProfile = () => {
  return apiGet('/auth/profile');
};

// Update user profile
export const updateProfile = (profileData) => {
  return apiPut('/auth/profile', profileData);
};

// Change password
export const changePassword = (passwordData) => {
  return apiPut('/auth/change-password', passwordData);
};

// Validate token
export const validateToken = () => {
  return apiGet('/auth/validate');
};

// Refresh token
export const refreshToken = () => {
  return apiPost('/auth/refresh');
};

// Check email availability
export const checkEmailAvailability = (email) => {
  return apiPost('/auth/check-email', { email });
};

// Get auth stats (admin only)
export const getAuthStats = () => {
  return apiGet('/auth/stats');
};

// Google OAuth URL
export const getGoogleAuthUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';
  return `${baseUrl}/auth/google`;
};