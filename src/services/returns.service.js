import api from '@/services/api';

class ReturnsService {
  /**
   * Request return for an order item
   * @param {string} orderId - Order ID
   * @param {Object} returnData - Return request details
   * @returns {Promise<{returnId: string, return: Object}>}
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
   * Get return details
   * @param {string} returnId - Return ID
   * @returns {Promise<{return: Object}>}
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
   * List buyer's returns
   * @param {Object} params - Query parameters
   * @returns {Promise<{returns: Array, total: number}>}
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
   * Approve return (seller only)
   * @param {string} returnId - Return ID
   * @param {Object} approvalData - Approval details
   * @returns {Promise<{return: Object}>}
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
   * Reject return (seller only)
   * @param {string} returnId - Return ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<{return: Object}>}
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
   * Process refund (seller/admin)
   * @param {string} returnId - Return ID
   * @param {Object} refundData - Refund details
   * @returns {Promise<{return: Object, refund: Object}>}
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
   * Get return status
   * @param {string} returnId - Return ID
   * @returns {Promise<{status: string, steps: Array}>}
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
   * Track return shipping
   * @param {string} returnId - Return ID
   * @returns {Promise<{trackingNumber: string, events: Array}>}
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
   * Get seller returns dashboard metrics
   * @param {string} shopId - Shop ID
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
