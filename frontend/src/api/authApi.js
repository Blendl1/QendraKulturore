import axios from 'axios';

const BASE = 'https://localhost:7278/api/Auth';

export const authApi = {
  register: (data) => axios.post(`${BASE}/register`, data),
  login:    (data) => axios.post(`${BASE}/login`, data),
  refresh:  (refreshToken) => axios.post(`${BASE}/refresh`, { refreshToken }),
  logout:   (refreshToken, accessToken) =>
    axios.post(`${BASE}/logout`,
      { refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ),
};