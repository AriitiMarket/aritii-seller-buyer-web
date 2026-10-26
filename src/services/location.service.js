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
  /**
   * Get the full location hierarchy tree (regions, cities, sub-cities).
   * Backend: GET /delivery/location/hierarchy
   * @returns {Promise<Array<object>>} Nested location tree
   */
  async getHierarchy() {
    const { data } = await publicApi.get('/delivery/location/hierarchy', { skipAuth: true });
    return data.hierarchy || [];
  },

  /**
   * List locations with optional filtering by type or parentId.
   * Backend: GET /delivery/location
   * @param {object} [params={}] - Query parameters (e.g., type, parentId)
   * @returns {Promise<Array<object>>} List of matching location records
   */
  async list(params = {}) {
    const { data } = await publicApi.get('/delivery/location', { params, skipAuth: true });
    return data.locations || [];
  },

  /**
   * Retrieve a single location record by its unique ID.
   * Backend: GET /delivery/location/:id
   * @param {string} id - Location identifier
   * @returns {Promise<object|null>} Location object or null if invalid
   */
  async get(id) {
    if (!id || id === 'undefined' || id === 'null') return null;
    const { data } = await publicApi.get(`/delivery/location/${id}`, { skipAuth: true });
    return data.location;
  },

  /**
   * Retrieve children of a location for cascading/dependent dropdown selectors.
   * Backend: GET /delivery/location/:parentId/children
   * @param {string} parentId - Parent location identifier
   * @returns {Promise<Array<object>>} Child locations list
   */
  async getChildren(parentId) {
    if (!parentId || parentId === 'undefined' || parentId === 'null') return [];
    const { data } = await publicApi.get(`/delivery/location/${parentId}/children`, { skipAuth: true });
    return data.children || [];
  },

  /**
   * Search locations by keyword or name.
   * Backend: GET /delivery/location/search?q=:query
   * @param {string} query - Keyword search term
   * @returns {Promise<Array<object>>} Matching locations list
   */
  async search(query) {
    if (!query) return [];
    const { data } = await publicApi.get('/delivery/location/search', {
      params: { q: query },
      skipAuth: true,
    });
    return data.locations || [];
  },

  /**
   * Determine which delivery zone covers a given location.
   * Backend: GET /delivery/zone/location/:locationId
   * @param {string} locationId - Target location identifier
   * @returns {Promise<Array<object>>} Delivery zones covering this location
   */
  async findZone(locationId) {
    if (!locationId || locationId === 'undefined' || locationId === 'null') return [];
    const { data } = await publicApi.get(`/delivery/zone/location/${locationId}`, { skipAuth: true });
    return data.zones || [];
  },

  /**
   * List all public delivery zones for checkout selection.
   * Backend: GET /delivery/zone/public
   * @returns {Promise<Array<object>>} List of active delivery zones
   */
  async listZones() {
    const { data } = await publicApi.get('/delivery/zone/public', { skipAuth: true });
    return data.zones || [];
  },

  /**
   * List business sectors from commerce service, with optional city filter.
   * Backend: GET /sector
   * @param {string} [cityName] - City name to filter sectors by
   * @returns {Promise<Array<object>>} List of sectors
   */
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

  /**
   * Request server-calculated checkout delivery fee quotation.
   * Backend: GET /delivery/zone/fee-quote
   * @param {string} zoneId - Delivery zone identifier
   * @param {number} quantity - Item quantity
   * @param {string} [locationId] - Destination location identifier
   * @returns {Promise<object>} Fee quote with rate breakdown
   */
  async quoteDeliveryFee(zoneId, quantity, locationId) {
    const { data } = await publicApi.get('/delivery/zone/fee-quote', {
      params: { zoneId: zoneId || undefined, locationId: locationId || undefined, quantity },
      skipAuth: true,
    });
    return data;
  },

  /**
   * List public delivery ports / pickup hubs.
   * Backend: GET /delivery/port/public
   * @param {object} [params={}] - Optional filters (e.g. zoneId, locationId)
   * @returns {Promise<Array<object>>} Delivery ports list
   */
  async listPorts(params = {}) {
    try {
      const { data } = await publicApi.get('/delivery/port/public', { params, skipAuth: true });
      return data.ports || [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieve active pickup ports for a specific delivery zone.
   * Backend: GET /delivery/port/zone/:zoneId
   * @param {string} zoneId - Delivery zone identifier
   * @returns {Promise<Array<object>>} Ports within the specified zone
   */
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
