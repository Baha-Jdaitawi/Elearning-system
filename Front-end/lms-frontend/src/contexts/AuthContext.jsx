import { createContext, useContext, useState, useEffect } from 'react';
import { validateToken } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('lms_token');
        const storedUser = localStorage.getItem('lms_user');

        if (storedToken && storedUser) {
          // Validate token with backend
          const response = await validateToken();
          if (response.success) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('lms_token');
            localStorage.removeItem('lms_user');
          }
        }
      } catch (error) {
        // Token validation failed, clear storage
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('lms_token', userToken);
    localStorage.setItem('lms_user', JSON.stringify(userData));
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('lms_user', JSON.stringify(userData));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is instructor
  const isInstructor = () => {
    return hasRole('instructor');
  };

  // Check if user is student
  const isStudent = () => {
    return hasRole('student');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    loginUser,
    logoutUser,
    updateUser,
    hasRole,
    isAdmin,
    isInstructor,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
