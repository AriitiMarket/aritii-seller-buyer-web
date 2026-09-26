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
  /** @returns {Promise<{reviews: object[], supported: boolean}>} */
  async getByProduct(productId) {
    try {
      const { data } = await api.get(`/review/get-product-reviews/${productId}`);
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  async getByShop(shopId) {
    try {
      const { data } = await api.get(`/review/get-shop-reviews/${shopId}`);
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  async getMine() {
    try {
      const { data } = await api.get('/review/get-my-reviews');
      return { reviews: data?.reviews || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { reviews: [], supported: false };
      throw error;
    }
  },

  /** Create a review. Uses the gateway's existing product-review route. */
  async create(payload) {
    const { data } = await api.put('/product/create-new-review', payload);
    return data?.review || data;
  },
};

export default reviewService;
