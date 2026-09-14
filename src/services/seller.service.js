import api from "./api";

/**
 * Seller Service
 * Handles seller-specific operations: applications, shop management, statistics, events
 */

export const sellerService = {
  /**
   * Submit application to become a seller
   * @param {Object} applicationData - { name, description, category, businessType }
   * @returns {Promise} - Application object
   */
  async submitApplication(applicationData) {
    const { data } = await api.post(
      "/seller-application",
      applicationData
    );
    return data.application || null;
  },

  /**
   * Get seller application status (admin only)
   * @returns {Promise} - Array of applications
   */
  async getApplications() {
    const { data } = await api.get("/seller-application");
    return data.applications || [];
  },

  /**
   * Approve seller application (admin only)
   * @param {string} applicationId - Application ID
   * @returns {Promise} - Updated seller object
   */
  async approveApplication(applicationId) {
    const { data } = await api.post(
      `/seller-application/${applicationId}/approve`
    );
    return data.seller || null;
  },

  /**
   * Get seller's shop info
   * @param {string} shopId - Shop ID
   * @returns {Promise} - Shop object with details
   */
  async getShopInfo(shopId) {
    const { data } = await api.get(`/shop/get-shop-info/${shopId}`);
    return data.shop || null;
  },

  /**
   * Update seller's shop information
   * @param {Object} shopData - { name, description, phone, email }
   * @returns {Promise} - Updated shop object
   */
  async updateShopInfo(shopData) {
    const { data } = await api.put("/shop/update-shop-info", shopData);
    return data.shop || null;
  },

  /**
   * Create a new event for seller's shop
   * @param {Object} eventData - { title, description, discount, startDate, endDate }
   * @returns {Promise} - Created event object
   */
  async createEvent(eventData) {
    const { data } = await api.post("/event/create-event", eventData);
    return data.event || null;
  },

  /**
   * Get all events for a specific shop
   * @param {string} shopId - Shop ID
   * @returns {Promise} - Array of events
   */
  async getShopEvents(shopId) {
    const { data } = await api.get(`/event/get-all-events/${shopId}`);
    return data.events || [];
  },

  /**
   * Delete an event from seller's shop
   * @param {string} eventId - Event ID
   * @returns {Promise} - Success message
   */
  async deleteEvent(eventId) {
    const { data } = await api.delete(`/event/delete-shop-event/${eventId}`);
    return data.message || "Event deleted";
  },
};

export default sellerService;
