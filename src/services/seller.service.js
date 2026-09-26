import api from "@/services/api";

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
   * Get seller application status for the signed-in applicant.
   *
   * GET /seller-application is the ADMIN reviewer list (authorize('ADMIN'));
   * the applicant-facing route is GET /seller-application/me.
   * @returns {Promise} - The caller's own application, or null
   */
  async getMyApplication() {
    const { data } = await api.get("/seller-application/me");
    return data.application || null;
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

  // Shop read/write lives in `shop.service` only (getById / updateShopInfo /
  // updateShopAvatar / getByOwner) — duplicate endpoints here drifted from the
  // multi-shop contract (missing required `shopId`).

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
