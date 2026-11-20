import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobyatra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jobyatra_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('jobyatra_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth token expired or invalid', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('jobyatra_token', jwtToken);
    localStorage.setItem('jobyatra_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    // Registration creates the account but does NOT auto-authenticate
    // The user will be redirected to the login page to sign in
    return res.data?.user || res.data;
  };

  const socialLogin = async ({ provider = 'GOOGLE', email, name, avatar, role = 'CANDIDATE', socialId }) => {
    const res = await api.post('/auth/social', { provider, email, name, avatar, role, socialId });
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('jobyatra_token', jwtToken);
    localStorage.setItem('jobyatra_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jobyatra_token');
    localStorage.removeItem('jobyatra_user');
  };

  const quickDemoLogin = async (role = 'CANDIDATE') => {
    let email = 'candidate@jobyatra.in';
    if (role === 'EMPLOYER') email = 'employer@jobyatra.in';
    if (role === 'ADMIN') email = 'admin@jobyatra.in';
    return await login(email, 'Pass@1234');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'CANDIDATE',
        isEmployer: user?.role === 'EMPLOYER',
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        socialLogin,
        logout,
        quickDemoLogin,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
