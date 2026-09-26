import { tokenStore, refreshAccessToken, setOnRefreshFail } from '@/services/tokenStore';

/**
 * Shared axios interceptors for the single API client (`services/api.js`).
 *
 * Request  → attach the Bearer access token.
 * Response → on 401, refresh the access token once, replay the queued requests,
 *            and on refresh failure broadcast `auth:unauthorized` exactly once.
 *
 * Keeping this here means `api.js` stays a thin client definition and there is
 * only ever ONE place that knows about token refresh.
 */

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

let navigateFn = null;

export function setNavigate(fn) {
  navigateFn = fn;
}

function notifyUnauthorized() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/login') return;
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  if (navigateFn) {
    navigateFn('/login');
  } else {
    window.location.href = '/login';
  }
}

export function attachRequestInterceptor(client) {
  client.interceptors.request.use(
    (config) => {
      if (config.skipAuth) return config;
      const token = tokenStore.getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
  return client;
}

export function attachResponseInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest?.skipAuth) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          notifyUnauthorized();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
  return client;
}

/** Wires both interceptors plus the tokenStore refresh-failure handler. */
export function setupInterceptors(api) {
  attachRequestInterceptor(api);
  attachResponseInterceptor(api);
  setOnRefreshFail(notifyUnauthorized);
  return api;
}

export default setupInterceptors;