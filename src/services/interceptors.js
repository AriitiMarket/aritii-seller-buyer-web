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

function notifyUnauthorized() {
  if (typeof window === 'undefined') return;
  // Dispatch the custom event; the app-level listener in useAppBootstrap
  // opens the ONE global login modal. Never do a hard window.location
  // redirect here — that bypasses the router and reloads the whole page.
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

export function attachRequestInterceptor(client) {
  client.interceptors.request.use(
    async (config) => {
      if (config.skipAuth) return config;

      // If we have an access token, use it
      const accessToken = tokenStore.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      }

      // No access token but we have a refresh token → wait for refresh to complete
      // This prevents sending unauthenticated requests that will 401 before refresh finishes
      const refreshToken = tokenStore.getRefreshToken();
      if (refreshToken) {
        // If a refresh is already in progress, wait for it
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          });
        }

        // Start a new refresh and wait for it
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          return config;
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Let the request go through without auth - it will 401 and trigger the
          // response interceptor which handles the final logout/redirect
          return config;
        } finally {
          isRefreshing = false;
        }
      }

      // No tokens at all → send as-is (will 401 if protected)
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

      // If the request interceptor already tried to refresh and it failed,
      // or if we got 401 despite having a token, handle it
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // If we already attempted refresh in the request interceptor and it failed,
        // the token store is already cleared and we should just notify unauthorized
        if (!tokenStore.getRefreshToken()) {
          notifyUnauthorized();
          return Promise.reject(error);
        }

        // Otherwise, try refresh once more (as a fallback)
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          });
        }

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