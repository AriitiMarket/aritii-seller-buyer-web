/**
 * Gap 9: Frontend Service Layer Factory
 * Generate API service layer from configuration
 * Eliminates duplicate service files
 */

/**
 * Factory to create API service layer
 * Usage: createApiService('products', '/api/products')
 */
export function createApiService(name, baseEndpoint) {
  return {
    /**
     * Get all items
     */
    getAll: async (client, params = {}) => {
      const response = await client.get(baseEndpoint, { params });
      return response.data.data;
    },

    /**
     * Get by ID
     */
    getById: async (client, id) => {
      const response = await client.get(`${baseEndpoint}/${id}`);
      return response.data.data;
    },

    /**
     * Create new item
     */
    create: async (client, data) => {
      const response = await client.post(baseEndpoint, data);
      return response.data.data;
    },

    /**
     * Update item
     */
    update: async (client, id, data) => {
      const response = await client.put(`${baseEndpoint}/${id}`, data);
      return response.data.data;
    },

    /**
     * Delete item
     */
    delete: async (client, id) => {
      await client.delete(`${baseEndpoint}/${id}`);
      return id;
    },

    /**
     * Search/filter
     */
    search: async (client, filters) => {
      const response = await client.get(baseEndpoint, { params: filters });
      return response.data;
    },

    /**
     * Bulk operations
     */
    bulkCreate: async (client, items) => {
      const response = await client.post(`${baseEndpoint}/bulk`, { items });
      return response.data.data;
    },

    bulkUpdate: async (client, items) => {
      const response = await client.put(`${baseEndpoint}/bulk`, { items });
      return response.data.data;
    },

    bulkDelete: async (client, ids) => {
      const response = await client.delete(`${baseEndpoint}/bulk`, { data: { ids } });
      return response.data.data;
    }
  };
}

/**
 * Service configuration registry
 */
export const ServiceRegistry = {
  services: new Map(),

  register(name, service) {
    this.services.set(name, service);
  },

  get(name) {
    return this.services.get(name);
  }
};

export default createApiService;
