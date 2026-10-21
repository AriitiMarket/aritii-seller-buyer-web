/**
 * Orders API Service
 * Handles all order-related API calls for seller portal
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class OrdersService extends BaseService {
  /**
   * Get all orders for a shop with pagination (FIX #7)
   * Backend: GET /order/shop/:shopId
   */
  async getShopOrders(shopId, options = {}) {
    const { page = 1, limit = 20, status, sortBy, sortOrder } = options;
    return this.get(`/order/shop/${shopId}`, { page, limit, status, sortBy, sortOrder });
  }

  /**
   * Confirm order (FIX #1, #10, #12)
   * Backend: POST /order/:orderId/confirm
   */
  async confirmOrder(orderId) {
    return this.post(`/order/${orderId}/confirm`);
  }

  async verifyPickup(orderId, code) {
    return this.post(`/order/${orderId}/verify-pickup`, { code });
  }

  /**
   * Update order status (FIX #4, #8)
   * Backend: PATCH /order/:orderId/status
   */
  async updateOrderStatus(orderId, status, reason) {
    return this.patch(`/order/${orderId}/status`, { status, reason });
  }

  /**
   * Get order timeline (FIX #8)
   * Backend: GET /order/:orderId/timeline
   */
  async getOrderTimeline(orderId) {
    return this.get(`/order/${orderId}/timeline`);
  }

  /**
   * Cancel order
   * Backend: POST /order/:orderId/cancel
   */
  async cancelOrder(orderId, reason) {
    return this.post(`/order/${orderId}/cancel`, { reason });
  }

  /**
   * Bulk order action (FIX #14)
   * Backend: POST /order/bulk-action
   */
  async bulkOrderAction(orderIds, action) {
    return this.post('/order/bulk-action', { orderIds, action });
  }

  /**
   * Get available stock for product (FIX #2)
   * Backend: GET /order/product/:productId/available-stock
   */
  async getAvailableStock(productId) {
    return this.get(`/order/product/${productId}/available-stock`);
  }

  // ==================== NEW CRITICAL METHODS ====================

  /**
   * Hold an order - prevents further processing
   * Backend: POST /order/:orderId/hold
   * @param {string} orderId - The order ID
   * @param {string} reason - Reason for holding the order
   * @returns {Promise<Object>} Updated order with hold status
   */
  async holdOrder(orderId, reason) {
    return this.post(`/order/${orderId}/hold`, { reason });
  }

  /**
   * Release a held order - resume processing
   * Backend: POST /order/:orderId/release
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} Updated order with released status
   */
  async releaseOrder(orderId) {
    return this.post(`/order/${orderId}/release`);
  }

  /**
   * Set order priority - adjust processing priority
   * Backend: PATCH /order/:orderId/priority
   * @param {string} orderId - The order ID
   * @param {string} priority - Priority level (low, normal, high, urgent)
   * @returns {Promise<Object>} Updated order with new priority
   */
  async setOrderPriority(orderId, priority) {
    return this.patch(`/order/${orderId}/priority`, { priority });
  }

  /**
   * Clone an existing order - create a duplicate for reorder
   * Backend: POST /order/:orderId/clone
   * @param {string} orderId - The order ID to clone
   * @returns {Promise<Object>} New cloned order
   */
  async cloneOrder(orderId) {
    return this.post(`/order/${orderId}/clone`);
  }

  /**
   * Get packing slip as blob (PDF/document)
   * Backend: GET /order/:orderId/packing-slip
   * @param {string} orderId - The order ID
   * @returns {Promise<Blob>} Packing slip document as blob
   */
  async getPackingSlip(orderId) {
    // Use api directly for blob response (bypasses JSON envelope extraction)
    const response = await this.api.get(`/order/${orderId}/packing-slip`, { responseType: 'blob' });
    return response.data;
  }

  /**
   * Get order SLA (Service Level Agreement) details
   * Backend: GET /order/:orderId/sla
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} SLA information including deadlines, status
   */
  async getOrderSLA(orderId) {
    return this.get(`/order/${orderId}/sla`);
  }
}

export default new OrdersService();
