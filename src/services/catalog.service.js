import api from "@/services/api";

/**
 * Catalog Service
 * Handles category and event management for marketplace
 * Coupons removed from MVP - separate module
 */

export const catalogService = {
  /**
   * Get active categories for ONE type. Screens must always name a type —
   * the type-less endpoint mixed product and business categories together,
   * which is how business chips ended up on the products strip.
   * @param {string} type - 'product' | 'business' | 'shop' | 'event'
   * @returns {Promise} - Array of category objects
   */
  async getCategoriesByType(type) {
    const { data } = await api.get(`/category/active/${type}`);
    return data.categories || [];
  },

  /**
   * Get all promotional events
   * @returns {Promise} - Array of event objects
   */
  async getEvents() {
    const { data } = await api.get("/event/get-all-events");
    return data.events || [];
  },
};

export default catalogService;