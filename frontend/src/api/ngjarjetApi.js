import apiClient from './apiClient';

export const ngjarjetApi = {
  getAll:       ()        => apiClient.get('/Ngjarja'),
  getById:      (id)      => apiClient.get(`/Ngjarja/${id}`),
  create:       (data)    => apiClient.post('/Ngjarja', data),
  update:       (id, data)=> apiClient.put(`/Ngjarja/${id}`, data),
  delete:       (id)      => apiClient.delete(`/Ngjarja/${id}`),
};