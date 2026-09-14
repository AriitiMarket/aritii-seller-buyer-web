import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const backend_url = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response Interceptor - Handle Auth Errors
 * 
 * 401 Unauthorized: Token expired or invalid
 *   - Clear Redux auth state
 *   - Redirect to login page
 *   - Prevent redirect loops
 * 
 * 403 Forbidden: User lacks required permissions
 *   - Allow error to propagate to caller
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only handle 401 if not already redirecting
      if (window.location.pathname !== '/login') {
        // Import dispatch dynamically to avoid circular dependency
        // Store will handle clearing auth state and redirecting
        const event = new CustomEvent('auth:unauthorized');
        window.dispatchEvent(event);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;