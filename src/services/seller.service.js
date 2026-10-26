import api from '@/services/api';

/**
 * Seller Service
 * Handles seller-side operations including bulk inventory actions, returns handling,
 * performance metrics, inventory availability settings, and onboarding application details.
 */
export const sellerService = {
  /**
   * Perform bulk operations on multiple products (e.g., status changes, batch updates).
   * @param {Array<string>} productIds - Array of product unique identifiers
   * @param {string} action - Action to perform on the selected products
   * @returns {Promise<object>} API response containing the update result
   */
  async bulkProductUpdate(productIds, action) {
    const { data } = await api.post('/product/bulk', {
      productIds,
      action,
    });
    return data;
  },

  /**
   * Fetch the returns management dashboard data for a specific shop.
   * Backend: GET /return/shop/:shopId/dashboard
   * @param {string} shopId - Shop unique identifier
   * @returns {Promise<object>} Dashboard metrics and list of return requests
   * @throws {Error} When shopId is missing
   */
  async getSellerReturns(shopId) {
    if (!shopId) throw new Error('Shop ID is required');
    const { data } = await api.get(`/return/shop/${shopId}/dashboard`);
    return data;
  },

  /**
   * Fetch seller KPIs and performance metrics (e.g. sales, revenue, orders).
   * Backend: GET /metrics/shop/:shopId?period=daily|weekly|monthly
   * @param {string} shopId - Shop unique identifier
   * @param {object} [params={}] - Query filters such as period ('daily' | 'weekly' | 'monthly')
   * @returns {Promise<object>} Seller metric statistics
   * @throws {Error} When shopId is missing
   */
  async getSellerMetrics(shopId, params = {}) {
    if (!shopId) throw new Error('Shop ID is required');
    const { data } = await api.get(`/metrics/shop/${shopId}`, { params });
    return data;
  },

  /**
   * Mark a returned item as picked up by the courier / delivery service.
   * @param {string} returnId - Return request ID
   * @returns {Promise<object>} Updated return record
   */
  async markReturnPickedUp(returnId) {
    const { data } = await api.post(`/return/${returnId}/picked-up`);
    return data;
  },

  /**
   * Confirm that a returned item has arrived at the seller's warehouse/shop.
   * @param {string} returnId - Return request ID
   * @returns {Promise<object>} Confirmation result
   */
  async confirmReturnReceived(returnId) {
    const { data } = await api.post(`/return/${returnId}/received`);
    return data;
  },

  /**
   * Update product inventory policies, including backorder and preorder configurations.
   * @param {string} productId - Product unique identifier
   * @param {object} settings - Inventory settings and preorder configurations
   * @returns {Promise<object>} Updated product object
   */
  async updateProductInventorySettings(productId, settings) {
    const { data } = await api.put(`/product/update-product/${productId}`, settings);
    return data.product;
  },

  /**
   * Check real-time product stock availability, including backorder/preorder status.
   * @param {string} productId - Product unique identifier
   * @returns {Promise<object>} Availability details and remaining quantity
   */
  async checkProductAvailability(productId) {
    const { data } = await api.get(`/order/product/${productId}/available-stock`);
    return data.availability;
  },

  /**
   * Retrieve the current logged-in user's seller onboarding application.
   * @returns {Promise<object>} Seller application status and details
   */
  async getMyApplication() {
    const { data } = await api.get('/seller-application/me');
    return data.application;
  },
};

export default sellerService;

