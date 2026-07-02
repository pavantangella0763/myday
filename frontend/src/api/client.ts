import axios from 'axios';

export const TOKEN_KEY = 'myday_token';

// Base URL comes from an env var so we can point at the deployed backend in production.
const baseURL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080') + '/api';

const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server rejects our token, clear it and send the user back to login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
