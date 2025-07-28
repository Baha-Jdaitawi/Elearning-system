// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'lms_token',
  USER: 'lms_user',
  REMEMBER_ME: 'lms_remember_me'
};

// Get item from localStorage
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return null;
  }
};

// Set item in localStorage
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

// Remove item from localStorage
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing storage item:', error);
    return false;
  }
};

// Clear all storage
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Token management
export const getToken = () => {
  return getStorageItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token) => {
  return setStorageItem(STORAGE_KEYS.TOKEN, token);
};

export const removeToken = () => {
  return removeStorageItem(STORAGE_KEYS.TOKEN);
};

// User management
export const getUser = () => {
  return getStorageItem(STORAGE_KEYS.USER);
};

export const setUser = (user) => {
  return setStorageItem(STORAGE_KEYS.USER, user);
};

export const removeUser = () => {
  return removeStorageItem(STORAGE_KEYS.USER);
};

// Remember me functionality
export const getRememberMe = () => {
  return getStorageItem(STORAGE_KEYS.REMEMBER_ME) || false;
};

export const setRememberMe = (remember) => {
  return setStorageItem(STORAGE_KEYS.REMEMBER_ME, remember);
};

// Auth data management
export const getAuthData = () => {
  return {
    token: getToken(),
    user: getUser(),
    rememberMe: getRememberMe()
  };
};

export const setAuthData = (token, user, rememberMe = false) => {
  setToken(token);
  setUser(user);
  setRememberMe(rememberMe);
};

export const clearAuthData = () => {
  removeToken();
  removeUser();
  removeStorageItem(STORAGE_KEYS.REMEMBER_ME);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole('admin');
};

// Check if user is instructor
export const isInstructor = () => {
  return hasRole('instructor');
};

// Check if user is student
export const isStudent = () => {
  return hasRole('student');
};

export default {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  getRememberMe,
  setRememberMe,
  getAuthData,
  setAuthData,
  clearAuthData,
  isAuthenticated,
  getUserRole,
  hasRole,
  isAdmin,
  isInstructor,
  isStudent
};