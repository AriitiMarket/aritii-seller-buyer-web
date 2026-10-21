/**
 * Seller Insights API Service
 * Handles dashboard insights and analytics
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class InsightsService extends BaseService {
  /**
   * Get sales trends for a shop
   * Backend: GET /insights/shop/:shopId/trends
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for trends (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Sales trends data
   */
  async getTrends(shopId, period = '30d') {
    return this.get(`/insights/shop/${shopId}/trends`, { period });
  }

  /**
   * Get top products for a shop
   * Backend: GET /insights/shop/:shopId/top-products
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @param {number} limit - Number of top products to return
   * @returns {Promise<Array>} Top products data
   */
  async getTopProducts(shopId, period = '30d', limit = 10) {
    return this.get(`/insights/shop/${shopId}/top-products`, { period, limit });
  }

  /**
   * Get customer insights for a shop
   * Backend: GET /insights/shop/:shopId/customers
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Customer insights data
   */
  async getCustomers(shopId, period = '30d') {
    return this.get(`/insights/shop/${shopId}/customers`, { period });
  }

  /**
   * Get inventory turnover insights for a shop
   * Backend: GET /insights/shop/:shopId/inventory
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Inventory insights data
   */
  async getInventory(shopId, period = '30d') {
    return this.get(`/insights/shop/${shopId}/inventory`, { period });
  }

  /**
   * Get conversion funnel for a shop
   * Backend: GET /insights/shop/:shopId/funnel
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Conversion funnel data
   */
  async getConversionFunnel(shopId, period = '30d') {
    return this.get(`/insights/shop/${shopId}/funnel`, { period });
  }

  /**
   * Get cohort analysis for a shop
   * Backend: GET /insights/shop/:shopId/cohorts
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Cohort analysis data
   */
  async getCohortAnalysis(shopId, period = '30d') {
    return this.get(`/insights/shop/${shopId}/cohorts`, { period });
  }

  /**
   * Get sales forecast for a shop
   * Backend: GET /insights/shop/:shopId/forecast
   * @param {string} shopId - The shop ID
   * @param {number} days - Number of days to forecast
   * @returns {Promise<Object>} Forecast data
   */
  async getForecast(shopId, days = 30) {
    return this.get(`/insights/shop/${shopId}/forecast`, { days });
  }

  /**
   * Get all insights at once (for dashboard)
   * Fetches all insights in parallel
   * @param {string} shopId - The shop ID
   * @param {string} period - Period for analysis (e.g., '7d', '30d', '90d', '1y')
   * @returns {Promise<Object>} Combined insights data
   */
  async getAllInsights(shopId, period = '30d') {
    const [
      trends,
      topProducts,
      customers,
      inventory,
      funnel,
      cohorts,
      forecast,
    ] = await Promise.all([
      this.getTrends(shopId, period),
      this.getTopProducts(shopId, period),
      this.getCustomers(shopId, period),
      this.getInventory(shopId, period),
      this.getConversionFunnel(shopId, period),
      this.getCohortAnalysis(shopId, period),
      this.getForecast(shopId, 30),
    ]);

    return {
      trends,
      topProducts,
      customers,
      inventory,
      funnel,
      cohorts,
      forecast,
    };
  }
}

export default new InsightsService();
