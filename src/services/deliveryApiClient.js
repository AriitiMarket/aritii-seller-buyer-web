import { createPortalApiClient } from './createPortalApiClient';

/**
 * Dedicated Axios client for the Delivery Center / Provider domain.
 * Configured with domain tracing, token injection, and error toasts.
 */
export const deliveryApiClient = createPortalApiClient('Delivery');

export default deliveryApiClient;
