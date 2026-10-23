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
    if (!id || id === 'undefined' || id === 'null') return null;
    const { data } = await publicApi.get(`/delivery/location/${id}`, { skipAuth: true });
    return data.location;
  },

  /** Get children of a location (for dependent dropdowns). */
  async getChildren(parentId) {
    if (!parentId || parentId === 'undefined' || parentId === 'null') return [];
    const { data } = await publicApi.get(`/delivery/location/${parentId}/children`, { skipAuth: true });
    return data.children || [];
  },

  /** Search locations by name. */
  async search(query) {
    if (!query) return [];
    const { data } = await publicApi.get('/delivery/location/search', {
      params: { q: query },
      skipAuth: true,
    });
    return data.locations || [];
  },

  /** Find which delivery zone covers a location. */
  async findZone(locationId) {
    if (!locationId || locationId === 'undefined' || locationId === 'null') return [];
    const { data } = await publicApi.get(`/delivery/zone/location/${locationId}`, { skipAuth: true });
    return data.zones || [];
  },

  /** List all public delivery zones (for the location selector). */
  async listZones() {
    const { data } = await publicApi.get('/delivery/zone/public', { skipAuth: true });
    return data.zones || [];
  },

  /** List sectors from commerce service (/sector), optionally filtered by city name. */
  async listSectors(cityName) {
    try {
      const { data } = await publicApi.get('/sector', { skipAuth: true });
      const allSectors = data.sectors || [];
      if (!cityName) return allSectors;
      const normalizedCity = String(cityName).trim().toLowerCase();
      const filtered = allSectors.filter((s) => {
        const sCity = String(s.city || '').trim().toLowerCase();
        return sCity.includes(normalizedCity) || normalizedCity.includes(sCity);
      });
      return filtered.length > 0 ? filtered : allSectors;
    } catch {
      return [];
    }
  },

  /** Server-calculated checkout fee for a zone and shipment item quantity. */
  async quoteDeliveryFee(zoneId, quantity, locationId) {
    const { data } = await publicApi.get('/delivery/zone/fee-quote', {
      params: { zoneId: zoneId || undefined, locationId: locationId || undefined, quantity },
      skipAuth: true,
    });
    return data;
  },

  /** List public delivery ports, optionally filtered by zoneId or locationId. */
  async listPorts(params = {}) {
    try {
      const { data } = await publicApi.get('/delivery/port/public', { params, skipAuth: true });
      return data.ports || [];
    } catch {
      return [];
    }
  },

  /** Get active ports for a specific delivery zone. */
  async getPortsByZone(zoneId) {
    if (!zoneId) return [];
    try {
      const { data } = await publicApi.get(`/delivery/port/zone/${zoneId}`, { skipAuth: true });
      return data.ports || [];
    } catch {
      try {
        const { data } = await publicApi.get('/delivery/port/public', { params: { zoneId }, skipAuth: true });
        return data.ports || [];
      } catch {
        return [];
      }
    }
  },
};

export default locationService;
