import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('lms_token');
};

// Clear auth data
const clearAuthData = () => {
  localStorage.removeItem('lms_token');
  localStorage.removeItem('lms_user');
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      clearAuthData();
      window.location.href = '/login';
    }

    if (!error.response) {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'An unexpected error occurred';

    throw new Error(errorMessage);
  }
);

// Generic methods
export const apiGet = (url, params = {}) => apiClient.get(url, { params });
export const apiPost = (url, data = {}) => apiClient.post(url, data);
export const apiPut = (url, data = {}) => apiClient.put(url, data);
export const apiDelete = (url) => apiClient.delete(url);

// Upload method
export const apiUpload = (url, formData) =>
  apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Assignment APIs
export const assignmentAPI = {
  uploadSubmission: (formData) => apiUpload('/submissions', formData),
};

// ✅ User APIs
export const userAPI = {
  getAllUsers: () => apiGet('/users'),
  getUserStats: () => apiGet('/users/stats'),
  searchUsers: (query) => apiGet('/users/search', { q: query }), // ✅ FIXED: "q" instead of "search"
  getUsersByRole: (role) => apiGet(`/users/role/${role}`),
  getUserActivity: (id) => apiGet(`/users/${id}/activity`),
  promoteToInstructor: (id) => apiPut(`/users/${id}/promote`),
  demoteToStudent: (id) => apiPut(`/users/${id}/demote`),
  deleteUser: (id) => apiDelete(`/users/${id}`),
  updateUser: (id, data) => apiPut(`/users/${id}`, data),
  getUserById: (id) => apiGet(`/users/${id}`),
  bulkUpdateUsers: (data) => apiPost('/users/bulk-update', data),
};

export default apiClient;





