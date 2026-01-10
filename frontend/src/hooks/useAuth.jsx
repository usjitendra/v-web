// hooks/useAuth.jsx
import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('adminToken');
      const admin = localStorage.getItem('adminData');

      if (token && admin) {
        const parsedAdmin = JSON.parse(admin);
        setIsAuthenticated(true);
        setAdminData(parsedAdmin);
      } else {
        setIsAuthenticated(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setAdminData(null);
      // Clear corrupted data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, admin) => {
    try {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
      setIsAuthenticated(true);
      setAdminData(admin);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
    setAdminData(null);
    navigate('/admin/login');
  };

  const updateAdminData = (newData) => {
    try {
      const updatedData = { ...adminData, ...newData };
      localStorage.setItem('adminData', JSON.stringify(updatedData));
      setAdminData(updatedData);
    } catch (error) {
      console.error('Update admin data error:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  const value = {
    isAuthenticated,
    adminData,
    loading,
    login,
    logout,
    updateAdminData,
    getToken,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
