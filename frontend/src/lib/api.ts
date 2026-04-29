import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject token on each request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('appforge_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('appforge_token');
      localStorage.removeItem('appforge_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  googleLogin: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },
};

// Apps
export const appsAPI = {
  list: () => api.get('/api/apps'),
  create: (config: any) => api.post('/api/apps', { config }),
  get: (id: string) => api.get(`/api/apps/${id}`),
  update: (id: string, config: any) => api.put(`/api/apps/${id}`, { config }),
  delete: (id: string) => api.delete(`/api/apps/${id}`),
  publish: (id: string) => api.post(`/api/apps/${id}/publish`),
};

// Dynamic data
export const dataAPI = {
  list: (appId: string, collection: string, params?: Record<string, any>) =>
    api.get(`/api/data/${appId}/${collection}`, { params }),
  create: (appId: string, collection: string, data: any) =>
    api.post(`/api/data/${appId}/${collection}`, data),
  get: (appId: string, collection: string, id: string) =>
    api.get(`/api/data/${appId}/${collection}/${id}`),
  update: (appId: string, collection: string, id: string, data: any) =>
    api.put(`/api/data/${appId}/${collection}/${id}`, data),
  delete: (appId: string, collection: string, id: string) =>
    api.delete(`/api/data/${appId}/${collection}/${id}`),
};

// Notifications
export const notificationsAPI = {
  list: () => api.get('/api/notifications'),
  markRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  markAllRead: () => api.put('/api/notifications/read-all'),
};
