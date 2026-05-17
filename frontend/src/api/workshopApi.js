import apiClient from './apiClient';

export const workshopApi = {
  getAll: () => apiClient.get('/Workshop'),
  getById: (id) => apiClient.get(`/Workshop/${id}`),
  create: (data) => apiClient.post('/Workshop', data),
  update: (id, data) => apiClient.put(`/Workshop/${id}`, data),
  delete: (id) => apiClient.delete(`/Workshop/${id}`),
};

export const pjesemarresApi = {
  getAll: () => apiClient.get('/Pjesemarres'),
  getById: (id) => apiClient.get(`/Pjesemarres/${id}`),
  create: (data) => apiClient.post('/Pjesemarres', data),
  update: (id, data) => apiClient.put(`/Pjesemarres/${id}`, data),
  delete: (id) => apiClient.delete(`/Pjesemarres/${id}`),
};

export const regjistrimApi = {
  getAll: () => apiClient.get('/RegjistrimWorkshop'),
  getById: (id) => apiClient.get(`/RegjistrimWorkshop/${id}`),
  create: (data) => apiClient.post('/RegjistrimWorkshop', data),
  update: (id, data) => apiClient.put(`/RegjistrimWorkshop/${id}`, data),
  delete: (id) => apiClient.delete(`/RegjistrimWorkshop/${id}`),
};