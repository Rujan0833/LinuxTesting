import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', new URLSearchParams(credentials), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/users/me'),
};

export const watchAPI = {
  getAllWatches: () => api.get('/watches'),
  getWatch: (id) => api.get(`/watches/${id}`),
  createWatch: (watchData) => api.post('/watches', watchData),
  updateWatch: (id, watchData) => api.put(`/watches/${id}`, watchData),
  deleteWatch: (id) => api.delete(`/watches/${id}`),
};

export default api;
