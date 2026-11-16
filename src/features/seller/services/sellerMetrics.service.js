/**
 * Seller Metrics API Service
 * Handles KPI and dashboard data (FIX #13)
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class SellerMetricsService extends BaseService {
  /**
   * Get metrics for a shop (FIX #13)
   * Backend: GET /metrics/shop/:shopId
   */
  async getMetrics(shopId, options = {}) {
    const { period = 'daily', startDate, endDate } = options;
    return this.get(`/metrics/shop/${shopId}`, { period, startDate, endDate });
  }

  /**
   * Get dashboard summary (quick view, FIX #13)
   * Backend: GET /metrics/shop/:shopId/dashboard
   */
  async getDashboardSummary(shopId, options = {}) {
    return this.get(`/metrics/shop/${shopId}/dashboard`, options);
  }
}

export default new SellerMetricsService();
