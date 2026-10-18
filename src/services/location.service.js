import { publicApi } from '@/services/api';

/**
 * Location Service
 * Talks to Delivery Service via API Gateway at /delivery/location/*
 * Used by checkout, address forms, and seller application forms.
 *
 * All reads are public reference data (regions, cities, zones) and must be
 * accessible to guests without login. Uses the public axios client which never
 * attaches an Authorization header and never triggers token-refresh /
 * logout-on-401 behaviour.
 */

export const locationService = {
  /** Get the full location hierarchy tree. */
  async getHierarchy() {
    const { data } = await publicApi.get('/delivery/location/hierarchy', { skipAuth: true });
    return data.hierarchy || [];
  },

  /** List locations with optional type/parentId filter. */
  async list(params = {}) {
    const { data } = await publicApi.get('/delivery/location', { params, skipAuth: true });
    return data.locations || [];
  },

  /** Get a single location by ID. */
  async get(id) {
    const { data } = await publicApi.get(`/delivery/location/${id}`, { skipAuth: true });
    return data.location;
  },

  /** Get children of a location (for dependent dropdowns). */
  async getChildren(parentId) {
    const { data } = await publicApi.get(`/delivery/location/${parentId}/children`, { skipAuth: true });
    return data.children || [];
  },

  /** Search locations by name. */
  async search(query) {
    const { data } = await publicApi.get('/delivery/location/search', {
      params: { q: query },
      skipAuth: true,
    });
    return data.locations || [];
  },

  /** Find which delivery zone covers a location. */
  async findZone(locationId) {
    const { data } = await publicApi.get(`/delivery/zone/location/${locationId}`, { skipAuth: true });
    return data.zones || [];
  },

  /** List all public delivery zones (for the location selector). */
  async listZones() {
    const { data } = await publicApi.get('/delivery/zone/public', { skipAuth: true });
    return data.zones || [];
  },
};

export default locationService;
