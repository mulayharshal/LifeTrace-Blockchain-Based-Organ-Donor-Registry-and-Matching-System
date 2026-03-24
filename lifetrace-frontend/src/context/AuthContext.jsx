import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    const normalizedRole = userData.role.toUpperCase();
    // Redirect based on role
    if (normalizedRole === 'DONOR') navigate('/donor/dashboard');
    else if (normalizedRole === 'HOSPITAL') navigate('/hospital/dashboard');
    else if (normalizedRole === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
