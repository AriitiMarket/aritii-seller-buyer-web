import axios from "axios";
import { tokenStore, refreshAccessToken, setOnRefreshFail } from "./tokenStore";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const backend_url = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach Bearer access token to every request.
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by attempting token refresh once.
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried, attempt refresh.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Dispatch unauthorized event for the app to handle.
        if (window.location.pathname !== '/login') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Set up refresh failure handler — redirect to login.
setOnRefreshFail(() => {
  if (window.location.pathname !== '/login') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    window.location.href = '/login';
  }
});

export default api;
