import apiClient from './apiClient';

export const biletatApi = {
  getAll:   ()         => apiClient.get('/Bileta'),
  getById:  (id)       => apiClient.get(`/Bileta/${id}`),
  create:   (data)     => apiClient.post('/Bileta', data),
  update:   (id, data) => apiClient.put(`/Bileta/${id}`, data),
  delete:   (id)       => apiClient.delete(`/Bileta/${id}`),
};