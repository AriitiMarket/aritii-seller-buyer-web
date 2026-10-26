import api from '@/services/api';

/**
 * Returns Service
 * Handles the complete return and refund lifecycle:
 * 1. Customer initiates return request for delivered order items.
 * 2. Seller reviews and approves or rejects the return.
 * 3. Courier handles pickup and return transit tracking.
 * 4. Seller or Admin inspects item and issues monetary refund.
 */
class ReturnsService {
  /**
   * Request return for one or more order items.
   * Backend: POST /return/order/:orderId/request
   * @param {string} orderId - Associated order ID
   * @param {Object} returnData - Return request details (reason, items array)
   * @returns {Promise<{returnId: string, return: Object}>} Created return record
   * @throws {Error} If orderId, reason, or items are missing
   */
  async requestReturn(orderId, returnData) {
    if (!orderId) throw new Error('Order ID is required');
    if (!returnData?.reason) throw new Error('Return reason is required');
    if (!returnData?.items || !Array.isArray(returnData.items) || returnData.items.length === 0) {
      throw new Error('At least one item must be selected');
    }

    try {
      const { data } = await api.post(`/return/order/${orderId}/request`, returnData);
      if (!data.success) throw new Error(data.message || 'Failed to request return');
      return data.return || data;
    } catch (err) {
      throw new Error(`Return request failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Fetch single return request details by ID.
   * Backend: GET /return/:returnId
   * @param {string} returnId - Return unique ID
   * @returns {Promise<{return: Object}>} Return record details
   * @throws {Error} If returnId is missing or record is not found (404)
   */
  async getReturn(returnId) {
    if (!returnId) throw new Error('Return ID is required');

    try {
      const { data } = await api.get(`/return/${returnId}`);
      if (!data.success) throw new Error(data.message || 'Return not found');
      return data.return || data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new Error('Return not found');
      }
      throw new Error(`Fetch return failed: ${err.message}`);
    }
  }

  /**
   * List returns requested by the authenticated buyer.
   * Backend: GET /return
   * @param {Object} [params={}] - Query filters (page, limit, status)
   * @returns {Promise<{returns: Array<object>, total: number}>} List of return records and count
   */
  async listReturns(params = {}) {
    try {
      const { data } = await api.get('/return', { params });
      return {
        returns: data?.returns || [],
        total: data?.total || 0,
      };
    } catch (err) {
      throw new Error(`List returns failed: ${err.message}`);
    }
  }

  /**
   * Approve a return request (seller authorization).
   * Backend: POST /return/:returnId/approve
   * @param {string} returnId - Return request ID
   * @param {Object} [approvalData={}] - Optional approval metadata or instructions
   * @returns {Promise<{return: Object}>} Updated return record
   */
  async approveReturn(returnId, approvalData = {}) {
    if (!returnId) throw new Error('Return ID is required');

    try {
      const { data } = await api.post(`/return/${returnId}/approve`, approvalData);
      if (!data.success) throw new Error(data.message || 'Failed to approve return');
      return data.return || data;
    } catch (err) {
      throw new Error(`Approve return failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Reject a return request with explanation (seller authorization).
   * Backend: POST /return/:returnId/reject
   * @param {string} returnId - Return request ID
   * @param {string} reason - Rejection reason explanation
   * @returns {Promise<{return: Object}>} Updated return record with rejection details
   */
  async rejectReturn(returnId, reason = '') {
    if (!returnId) throw new Error('Return ID is required');
    if (!reason) throw new Error('Rejection reason is required');

    try {
      const { data } = await api.post(`/return/${returnId}/reject`, { reason });
      if (!data.success) throw new Error(data.message || 'Failed to reject return');
      return data.return || data;
    } catch (err) {
      throw new Error(`Reject return failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Issue monetary refund for an approved and received return (seller or admin).
   * Backend: POST /return/:returnId/refund
   * @param {string} returnId - Return request ID
   * @param {Object} [refundData={}] - Refund payload (amount, refundMethod)
   * @returns {Promise<{return: Object, refund: Object}>} Refund execution confirmation
   */
  async processRefund(returnId, refundData = {}) {
    if (!returnId) throw new Error('Return ID is required');

    try {
      const { data } = await api.post(`/return/${returnId}/refund`, refundData);
      if (!data.success) throw new Error(data.message || 'Failed to process refund');
      return data;
    } catch (err) {
      throw new Error(`Process refund failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Retrieve timeline and status progression steps for a return request.
   * @param {string} returnId - Return request ID
   * @returns {Promise<{status: string, steps: Array<{step: string, completed: boolean, date: string|null}>}>} Status timeline steps
   */
  async getReturnStatus(returnId) {
    if (!returnId) throw new Error('Return ID is required');

    try {
      const returnData = await this.getReturn(returnId);
      return {
        status: returnData.status,
        steps: [
          { step: 'Requested', completed: true, date: returnData.createdAt },
          { step: 'Approved', completed: returnData.status !== 'PENDING', date: returnData.approvedAt },
          { step: 'Pickup', completed: returnData.status === 'PICKED_UP', date: returnData.pickedUpAt },
          { step: 'Refunded', completed: returnData.status === 'REFUNDED', date: returnData.refundedAt },
        ],
      };
    } catch (err) {
      throw new Error(`Get return status failed: ${err.message}`);
    }
  }

  /**
   * Track return shipping and transit events.
   * Backend: GET /return/:returnId/tracking
   * @param {string} returnId - Return request ID
   * @returns {Promise<{trackingNumber: string, events: Array<object>}>} Courier tracking information
   */
  async trackReturn(returnId) {
    if (!returnId) throw new Error('Return ID is required');

    try {
      const { data } = await api.get(`/return/${returnId}/tracking`);
      return {
        trackingNumber: data?.trackingNumber,
        events: data?.events || [],
      };
    } catch (err) {
      throw new Error(`Track return failed: ${err.message}`);
    }
  }

  /**
   * Get seller returns dashboard metrics and statistics.
   * Backend: GET /return/seller/dashboard
   * @param {string} shopId - Shop unique identifier
   * @returns {Promise<object>} Returns metrics summary for the seller shop
   */
  async getSellerReturnsDashboard(shopId) {
    try {
      const { data } = await api.get('/return/seller/dashboard', { params: { shopId } });
      return data?.data ?? data;
    } catch (err) {
      throw new Error(`Get seller returns dashboard failed: ${err.response?.data?.message || err.message}`);
    }
  }
}

export const returnsService = new ReturnsService();
export default returnsService;
