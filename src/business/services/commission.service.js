/**
 * Commission API Service
 * Handles all commission-related API calls for seller portal
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class CommissionService extends BaseService {
  /**
   * Get commission breakdown for a specific order
   * Backend: GET /commission/order/:orderId/breakdown
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} Commission breakdown details
   */
  async getCommissionBreakdown(orderId) {
    return this.get(`/commission/order/${orderId}/breakdown`);
  }

  /**
   * Get current commission rates
   * Backend: GET /commission/rates
   * @returns {Promise<Object>} Commission rates configuration
   */
  async getCommissionRates() {
    return this.get('/commission/rates');
  }

  /**
   * Get commission audit for a seller over a period
   * Backend: GET /commission/audit/:sellerId
   * @param {string} sellerId - The seller ID
   * @param {string} period - Period for audit (e.g., 'monthly', 'quarterly', 'yearly')
   * @returns {Promise<Object>} Commission audit details
   */
  async getCommissionAudit(sellerId, period) {
    return this.get(`/commission/audit/${sellerId}`, { period });
  }

  /**
   * Get settlement schedule for a seller
   * Backend: GET /settlement/schedule/:sellerId
   * @param {string} sellerId - The seller ID
   * @returns {Promise<Object>} Settlement schedule details
   */
  async getSettlementSchedule(sellerId) {
    return this.get(`/settlement/schedule/${sellerId}`);
  }

  /**
   * Get commission summary for a seller over a period
   * Backend: GET /commission/summary/:sellerId
   * @param {string} sellerId - The seller ID
   * @param {string} period - Period for summary (e.g., 'monthly', 'quarterly', 'yearly')
   * @returns {Promise<Object>} Commission summary details
   */
  async getCommissionSummary(sellerId, period) {
    return this.get(`/commission/summary/${sellerId}`, { period });
  }
}

export default new CommissionService();