import api from '@/services/api';

/**
 * Location Service
 * Talks to Delivery Service via API Gateway at /delivery/location/*
 * Used by checkout, address forms, and seller application forms.
 */

export const locationService = {
  /** Get the full location hierarchy tree. */
  async getHierarchy() {
    const { data } = await api.get('/delivery/location/hierarchy');
    return data.hierarchy || [];
  },

  /** List locations with optional type/parentId filter. */
  async list(params = {}) {
    const { data } = await api.get('/delivery/location', { params });
    return data.locations || [];
  },

  /** Get a single location by ID. */
  async get(id) {
    const { data } = await api.get(`/delivery/location/${id}`);
    return data.location;
  },

  /** Get children of a location (for dependent dropdowns). */
  async getChildren(parentId) {
    const { data } = await api.get(`/delivery/location/${parentId}/children`);
    return data.children || [];
  },

  /** Search locations by name. */
  async search(query) {
    const { data } = await api.get('/delivery/location/search', {
      params: { q: query },
    });
    return data.locations || [];
  },

  /** Find which delivery zone covers a location. */
  async findZone(locationId) {
    const { data } = await api.get(`/delivery/zone/location/${locationId}`);
    return data.zones || [];
  },
};

export default locationService;
