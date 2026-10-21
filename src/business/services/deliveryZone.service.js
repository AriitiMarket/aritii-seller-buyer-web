/**
 * Delivery Zone API Service
 * Handles all delivery zone-related API calls for seller portal
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class DeliveryZoneService extends BaseService {
  /**
   * Get all delivery zones for a shop
   * Backend: GET /delivery/zones/shop/:shopId
   * @param {string} shopId - The shop ID
   * @returns {Promise<Array>} Array of delivery zones
   */
  async getZones(shopId) {
    return this.get(`/delivery/zones/shop/${shopId}`);
  }

  /**
   * Create a new delivery zone for a shop
   * Backend: POST /delivery/zones
   * @param {string} shopId - The shop ID
   * @param {Object} zoneData - Zone data (name, coverageType, areas, fee, minOrderAmount, isActive)
   * @returns {Promise<Object>} Created zone object
   */
  async createZone(shopId, zoneData) {
    return this.post('/delivery/zones', { ...zoneData, shopId });
  }

  /**
   * Update an existing delivery zone
   * Backend: PATCH /delivery/zones/:zoneId
   * @param {string} zoneId - The zone ID
   * @param {Object} zoneData - Updated zone data
   * @returns {Promise<Object>} Updated zone object
   */
  async updateZone(zoneId, zoneData) {
    return this.patch(`/delivery/zones/${zoneId}`, zoneData);
  }

  /**
   * Delete a delivery zone
   * Backend: DELETE /delivery/zones/:zoneId
   * @param {string} zoneId - The zone ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteZone(zoneId) {
    return this.delete(`/delivery/zones/${zoneId}`);
  }

  /**
   * Validate zone coverage for a specific address
   * Backend: POST /delivery/zones/validate-coverage
   * @param {Object} address - Address object (street, city, state, postalCode, country)
   * @returns {Promise<Object>} Coverage validation result with matching zone and fee
   */
  async validateZoneCoverage(address) {
    return this.post('/delivery/zones/validate-coverage', address);
  }

  /**
   * Get a single delivery zone by ID
   * Backend: GET /delivery/zones/:zoneId
   * @param {string} zoneId - The zone ID
   * @returns {Promise<Object>} Zone details
   */
  async getZoneById(zoneId) {
    return this.get(`/delivery/zones/${zoneId}`);
  }
}

export default new DeliveryZoneService();