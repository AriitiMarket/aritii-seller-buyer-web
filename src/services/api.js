import axios from 'axios';
import { ENV } from '@/app/config';
import { setupInterceptors } from '@/services/interceptors';

export const API_BASE_URL = ENV.API_URL;
// Back-compat alias: several modules (e.g. utils/image.js) import `backend_url`.
export const backend_url = API_BASE_URL;

/**
 * The ONE axios client for the whole application.
 *
 * Component → feature service → this client → backend.
 * UI components must never call `fetch`/axios directly, and no second client
 * may be created without a documented reason.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors(api);

/**
 * Public API client — never attaches an Authorization header and never
 * triggers a token-refresh or login-redirect on 401.  Use this for
 * unauthenticated marketplace browsing endpoints.
 */
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export { publicApi };
export default api;
