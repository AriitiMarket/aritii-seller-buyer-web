/**
 * Order Tracking API Service
 * Handles order tracking and timeline
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class TrackingService extends BaseService {
  /**
   * Get order tracking details
   * Backend: GET /delivery/delivery/order/:orderId
   */
  async getTracking(orderId) {
    return this.get(`/delivery/delivery/order/${orderId}`);
  }
}

export default new TrackingService();
