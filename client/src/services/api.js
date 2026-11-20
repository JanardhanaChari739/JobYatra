import axios from 'axios';
import { handleMockRequest } from './mockFallback';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobyatra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions & static deployment fallback
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const config = error.config;
    // On static hosts like GitHub Pages (where /api/v1 returns 405 or 404) or network failures:
    const isStaticDeploy =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
        error.response?.status === 405 ||
        error.response?.status === 404 ||
        !error.response);

    if (isStaticDeploy && config) {
      try {
        let reqData = config.data;
        if (typeof reqData === 'string') {
          try {
            reqData = JSON.parse(reqData);
          } catch (e) {}
        }
        const mockRes = handleMockRequest(config.method, config.url, reqData, config.params);
        return Promise.resolve(mockRes);
      } catch (mockErr) {
        console.warn('Mock fallback execution error:', mockErr);
      }
    }

    if (error.response?.status === 401) {
      if (!config?.url?.includes('/auth/login')) {
        localStorage.removeItem('jobyatra_token');
        localStorage.removeItem('jobyatra_user');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
