import api from "./api";

/**
 * Catalog Service
 * Handles category, event, and coupon management for marketplace
 */

export const catalogService = {
  /**
   * Get all product categories
   * @returns {Promise} - Array of category objects
   */
  async getCategories() {
    const { data } = await api.get("/category/get-all-categories");
    return data.categories || [];
  },

  /**
   * Get all promotional events
   * @returns {Promise} - Array of event objects
   */
  async getEvents() {
    const { data } = await api.get("/event/get-all-events");
    return data.events || [];
  },

  /**
   * Get coupon discount value
   * @param {string} couponCode - Coupon code to validate
   * @returns {Promise} - Coupon object with discount value or null if invalid
   */
  async getCoupon(couponCode) {
    const { data } = await api.get(
      `/coupon/get-coupon-value/${couponCode}`
    );
    return data.couponCode || null;
  },

  /**
   * Get all coupons for a seller
   * @param {string} sellerId - Seller ID
   * @returns {Promise} - Array of coupon objects
   */
  async getSellerCoupons(sellerId) {
    const { data } = await api.get(`/coupon/get-coupon/${sellerId}`);
    return data.couponCodes || [];
  },

  /**
   * Create a new coupon for seller
   * @param {Object} couponData - Coupon details
   * @returns {Promise} - Created coupon object
   */
  async createCoupon(couponData) {
    const { data } = await api.post("/coupon/create-coupon", couponData);
    return data.couponCode || null;
  },

  /**
   * Delete a coupon
   * @param {string} couponId - Coupon ID to delete
   * @returns {Promise} - Success message
   */
  async deleteCoupon(couponId) {
    const { data } = await api.delete(`/coupon/delete-coupon/${couponId}`);
    return data.message || "Coupon deleted";
  },
};

export default catalogService;
