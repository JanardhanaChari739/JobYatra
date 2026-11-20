import axios from 'axios';

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

// Response interceptor to handle unauthenticated sessions
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest.url.includes('/auth/login')) {
        localStorage.removeItem('jobyatra_token');
        localStorage.removeItem('jobyatra_user');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
