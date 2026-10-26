import api from '@/services/api';

/**
 * Review Service - reviews of products/shops.
 *
 * Reads come from the Commerce review module (GET /review/*), which publishes
 * APPROVED reviews only. `getMine` is the deliberate exception: an author sees
 * their own reviews in EVERY state, so a just-submitted review shows as pending
 * instead of appearing to have vanished.
 *
 * Writes go through PUT /product/create-new-review, where the review is stored
 * inside the product document it belongs to. The author is resolved from the
 * verified token server-side, never from the payload.
 *
 * A 404/501 is still treated as "not available" so the UI degrades honestly
 * against a deployment that has not shipped the module.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const reviewService = {
  /**
   * Fetch approved customer reviews for a given product.
   * Backend: GET /review/get-product-reviews/:productId
   * @param {string} productId - Product unique identifier
   * @returns {Promise<{reviews: Array<object>, supported: boolean}>} Reviews array and feature availability flag
   */
  async getByProduct(productId) {
    try {
      const { data } = await api.get(`/review/get-product-reviews/${productId}`);
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  /**
   * Fetch approved customer reviews for a specific shop.
   * Backend: GET /review/get-shop-reviews/:shopId
   * @param {string} shopId - Shop unique identifier
   * @returns {Promise<{reviews: Array<object>, supported: boolean}>} Reviews array and feature availability flag
   */
  async getByShop(shopId) {
    try {
      const { data } = await api.get(`/review/get-shop-reviews/${shopId}`);
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  /**
   * Fetch reviews authored by the currently logged-in user across all states (approved & pending).
   * Backend: GET /review/get-my-reviews
   * @returns {Promise<{reviews: Array<object>, supported: boolean}>} User reviews array and feature availability flag
   */
  async getMine() {
    try {
      const { data } = await api.get('/review/get-my-reviews');
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  /**
   * Submit a new customer review for a purchased product.
   * Backend: PUT /product/create-new-review
   * @param {object} payload - Review submission payload (rating, comment, productId)
   * @returns {Promise<object>} Created review record
   */
  async create(payload) {
    const { data } = await api.put('/product/create-new-review', payload);
    return data?.review || data;
  },
};

export default reviewService;
