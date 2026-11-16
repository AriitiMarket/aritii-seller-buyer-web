import { createPortalApiClient } from './createPortalApiClient';

/**
 * Dedicated Axios client for the Seller Central / Business domain.
 * Configured with domain tracing, token injection, and error toasts.
 */
export const sellerApiClient = createPortalApiClient('Seller');

export default sellerApiClient;
