/**
 * Returns API Service
 * Handles returns/refunds API calls (FIX #3, #6, #15)
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class ReturnsService extends BaseService {
  async callRaw(request) {
    try {
      const response = await request;
      const payload = response.data;
      return payload?.success && Object.prototype.hasOwnProperty.call(payload, 'data')
        ? payload.data
        : payload;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Request return (buyer initiated)
   * Backend: POST /return/order/:orderId/request
   */
  async requestReturn(orderId, items, reason, comments) {
    return this.callRaw(this.api.post(`/return/order/${orderId}/request`, { items, reason, comments }));
  }

  /**
   * Approve return (seller action, FIX #3)
   * Backend: POST /return/:returnId/approve
   */
  async approveReturn(returnId) {
    return this.callRaw(this.api.post(`/return/${returnId}/approve`));
  }

  /**
   * Process refund (FIX #6)
   * Backend: POST /return/:returnId/refund
   */
  async processRefund(returnId, data = {}) {
    return this.callRaw(this.api.post(`/return/${returnId}/refund`, data));
  }

  /**
   * Reject return (seller action)
   * Backend: POST /return/:returnId/reject
   */
  async rejectReturn(returnId, reason) {
    return this.callRaw(this.api.post(`/return/${returnId}/reject`, { reason }));
  }

  /**
   * Get return details
   * Backend: GET /return/:returnId
   */
  async getReturn(returnId) {
    return this.callRaw(this.api.get(`/return/${returnId}`));
  }

  /**
   * Get seller returns dashboard (FIX #15)
   * Backend: GET /return/shop/:shopId/dashboard
   */
  async getSellerReturnsDashboard(shopId) {
    return this.callRaw(this.api.get(`/return/shop/${shopId}/dashboard`));
  }
}

export default new ReturnsService();
