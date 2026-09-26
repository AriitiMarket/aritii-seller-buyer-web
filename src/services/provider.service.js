import api from '@/services/api';
import { DELIVERY_PROVIDERS } from '@/app/config';

/**
 * Delivery Provider Service.
 *
 * The Delivery domain supports multiple providers (Aritii's own network plus
 * external providers). Providers are listed through this service so the UI never
 * hard-codes a single provider.
 *
 * CONTRACT NOTE: `/delivery/providers` is not served by the gateway yet. When it
 * is unavailable the service falls back to the two provider types the platform is
 * designed around (declared in src/config/index.js) and reports `supported:false`
 * so the UI can label them as "not yet connected" instead of pretending they are
 * live integrations.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

const FALLBACK_PROVIDERS = [
  { _id: DELIVERY_PROVIDERS.ARITII, name: 'Aritii Delivery', type: DELIVERY_PROVIDERS.ARITII },
  {
    _id: DELIVERY_PROVIDERS.EXTERNAL,
    name: 'External Delivery Provider',
    type: DELIVERY_PROVIDERS.EXTERNAL,
  },
];

export const providerService = {
  /** @returns {Promise<{providers: DeliveryProvider[], supported: boolean}>} */
  async getAll() {
    try {
      const { data } = await api.get('/delivery/providers');
      const providers = data?.providers || [];
      if (providers.length === 0) {
        return { providers: FALLBACK_PROVIDERS, supported: false };
      }
      return { providers, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { providers: FALLBACK_PROVIDERS, supported: false };
      throw error;
    }
  },

  async getById(id) {
    const { data } = await api.get(`/delivery/providers/${id}`);
    return data?.provider || data;
  },
};

export default providerService;