import axios from 'axios';
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, initializeToken } from '../context/tokenStore.js';

// Initialize token from storage IMMEDIATELY when this module loads
// This runs before any interceptor fires, ensuring the token is available
initializeToken();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token from storage or memory
api.interceptors.request.use((config) => {
  let token = getAccessToken();

  // Fallback 1: Check localStorage
  if (!token) {
    token = localStorage.getItem('accessToken');
  }

  // Fallback 2: Read from cookie if localStorage fails
  if (!token) {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }

  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry for auth endpoints — these return 401 for business reasons
    // (wrong credentials, missing token), NOT because an access token expired.
    // Retrying them would either cause an infinite loop (refresh-token) or
    // incorrectly mask a real auth error with a confusing refresh failure (login, register).
    const isAuthEndpoint = /\/auth\/(login|register|send-otp|refresh-token)/.test(
      originalRequest.url || ''
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from in-memory store or localStorage fallback
        const rt = getRefreshToken() || localStorage.getItem('refreshToken');
        console.log('[AXIOS REFRESH] rt available:', !!rt);

        const refreshRes = await api.post('/auth/refresh-token', { refreshToken: rt });
        const newToken = refreshRes.data?.accessToken;
        const newRefreshToken = refreshRes.headers?.['x-refresh-token'] ||
                                refreshRes.data?.refreshToken;

        if (newToken) {
          setAccessToken(newToken);
        }
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }
        processQueue(null, newToken);
        if (newToken) originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setAccessToken(null);
        setRefreshToken(null);
        // Notify the app that auth is fully gone so React can clear user state
        // and redirect to login if needed — without importing AuthContext here
        // (which would create a circular dependency).
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;