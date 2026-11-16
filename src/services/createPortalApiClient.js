import axios from 'axios';
import { ENV } from '@/app/config';
import { setupInterceptors } from '@/services/interceptors';

export const DEFAULT_API_BASE_URL = ENV?.API_URL || 'http://localhost:8000/api';

/**
 * Factory for creating domain-isolated Axios client instances.
 *
 * Each portal client possesses:
 * - Domain-scoped header tagging ('X-Client-Portal')
 * - Automatic Bearer token attachment via tokenStore
 * - 401 Unauthorized handling with token refresh & session flushing
 * - 403 / 500 / Network error toast notifications via react-toastify
 */
export function createPortalApiClient(portalName = 'default', customOptions = {}) {
  const {
    baseURL = DEFAULT_API_BASE_URL,
    timeout = 30000,
    headers = {},
    enableToast = true,
    ...restConfig
  } = customOptions;

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Portal': portalName.toLowerCase(),
      ...headers,
    },
    ...restConfig,
  });

  setupInterceptors(client, { portalName, enableToast });
  return client;
}

export default createPortalApiClient;
