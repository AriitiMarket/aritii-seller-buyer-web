import api from '@/services/api';

/**
 * Promotion Service — commercial offers / campaigns.
 *
 * Promotions are an INDEPENDENT feature: they are not catalog items and not
 * events (see docs/MARKETPLACE.md § Promotions and docs/BUSINESS.md).
 *
 * Backed by the Commerce promotions module: a seller manages the offers of the
 * shops they own, while everyone else reads only the LIVE, publicly listed ones
 * (a promotion stops being public the moment its window closes, so `status` is
 * never trusted on its own).
 *
 * A 404/501 is still treated as "not available" so the UI degrades honestly
 * against a deployment that has not shipped the module.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const promotionService = {
  /**
   * Fetch all active promotions and campaign offers across the platform.
   * @returns {Promise<{promotions: Array<object>, supported: boolean}>} Object containing promotions list and availability flag
   */
  async getAll() {
    try {
      const { data } = await api.get('/promotion/get-all-promotions');
      const promotions = data?.promotions || data?.data || [];
      return { promotions, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { promotions: [], supported: false };
      throw error;
    }
  },

  /**
   * Public marketplace view: returns only campaign offers marked as publicly visible.
   * @returns {Promise<{promotions: Array<object>, supported: boolean}>} Filtered public promotions
   */
  async getPublic() {
    const { promotions, supported } = await this.getAll();
    return {
      supported,
      promotions: promotions.filter((p) => p.showOnPublic !== false),
    };
  },

  /**
   * Retrieve single promotion details by its unique identifier.
   * Backend: GET /promotion/get-promotion/:id
   * @param {string} id - Promotion unique identifier
   * @returns {Promise<object>} Promotion details object
   */
  async getById(id) {
    const { data } = await api.get(`/promotion/get-promotion/${id}`);
    return data?.promotion || data;
  },

  /**
   * Retrieve all promotions associated with a specific shop.
   * Backend: GET /promotion/get-all-promotions/:shopId
   * @param {string} shopId - Shop unique identifier
   * @returns {Promise<Array<object>>} List of promotions for the shop
   */
  async getByShop(shopId) {
    try {
      const { data } = await api.get(`/promotion/get-all-promotions/${shopId}`);
      return data?.promotions || [];
    } catch (error) {
      if (NOT_AVAILABLE(error)) return [];
      throw error;
    }
  },

  /**
   * Validate a promo code for checkout application against cart contents.
   * Backend: POST /promotion/validate-code
   * @param {string} code - The promo code string to validate
   * @param {Array<object>} cartItems - Current cart line items
   * @param {number} subtotal - Cart subtotal amount before discount
   * @param {string|null} [buyerId=null] - Optional authenticated buyer user ID
   * @param {boolean} [isFirstOrder=false] - Whether this order is the buyer's first platform purchase
   * @returns {Promise<object>} Validation status, applicable discount amount, and error message if invalid
   */
  async validateCode(code, cartItems, subtotal, buyerId = null, isFirstOrder = false) {
    try {
      const { data } = await api.post('/promotion/validate-code', {
        code,
        cartItems,
        subtotal,
        buyerId,
        isFirstOrder,
      });
      return data;
    } catch (error) {
      if (NOT_AVAILABLE(error)) {
        return { valid: false, supported: false, message: 'Promotions not available' };
      }
      throw error;
    }
  },

  /**
   * Create a new promotion campaign offer.
   * Backend: POST /promotion/create-promotion
   * @param {object} payload - Promotion configuration (discount percentage, date range, rules)
   * @returns {Promise<object>} Created promotion response
   */
  async create(payload) {
    const { data } = await api.post('/promotion/create-promotion', payload);
    return data;
  },

  /**
   * Update an existing promotion's settings and duration.
   * Backend: PUT /promotion/update-promotion/:id
   * @param {string} id - Promotion unique identifier
   * @param {object} payload - Updated promotion properties
   * @returns {Promise<object>} Updated promotion result
   */
  async update(id, payload) {
    const { data } = await api.put(`/promotion/update-promotion/${id}`, payload);
    return data;
  },

  /**
   * Delete or archive a promotion.
   * Backend: DELETE /promotion/delete-promotion/:id
   * @param {string} id - Promotion unique identifier to delete
   * @returns {Promise<object>} Deletion confirmation response
   */
  async remove(id) {
    const { data } = await api.delete(`/promotion/delete-promotion/${id}`);
    return data;
  },

  /**
   * Get usage metrics and redemption statistics for a promotion.
   * Backend: GET /promotion/stats/:promotionId
   * @param {string} promotionId - The promotion unique identifier
   * @returns {Promise<{totalUsed: number, totalLimit: number|null, remaining: number|null, uniqueBuyers: number}>} Usage statistics
   */
  async getStats(promotionId) {
    try {
      const { data } = await api.get(`/promotion/stats/${promotionId}`);
      return data;
    } catch (error) {
      if (NOT_AVAILABLE(error)) {
        return { totalUsed: 0, totalLimit: null, remaining: null, uniqueBuyers: 0 };
      }
      throw error;
    }
  },
};

export default promotionService;