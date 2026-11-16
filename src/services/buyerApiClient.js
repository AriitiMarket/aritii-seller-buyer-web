import { createPortalApiClient } from './createPortalApiClient';

/**
 * Dedicated Axios client for the Buyer Portal domain.
 * Configured with domain tracing, token injection, and error toasts.
 */
export const buyerApiClient = createPortalApiClient('Buyer');

export default buyerApiClient;
