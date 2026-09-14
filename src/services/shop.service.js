import api from "./api";
import cache from "./cache";

/**
 * Shop Service
 * Handles shop browsing, public shop information, and shop management
 * Provides public shop marketplace data visible to buyers
 */

export const shopService = {
  /**
   * Get all shops for marketplace browsing
   * @returns {Promise} - Array of shop objects
   */
  async getAll() {
    const cacheKey = "shops:all";
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await api.get("/shop/get-all-shops");
    const shops = data.shops || [];
    cache.set(cacheKey, shops, 15 * 60 * 1000);
    return shops;
  },

  /**
   * Get a single shop's public information
   * Returns the full shop doc from backend; UI renders only business fields
   * (name, avatar, address, description, productCount, ratings)
   * Never expose: ownerId, email, balances, private fields
   * @param {string} shopId - Shop ID
   * @returns {Promise} - Shop object
   */
  async getById(shopId) {
    const cacheKey = `shop:${shopId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await api.get(`/shop/get-shop-info/${shopId}`);
    const shop = data.shop || null;
    cache.set(cacheKey, shop, 20 * 60 * 1000);
    return shop;
  },

  /**
   * Get current authenticated seller's shop
   * @returns {Promise} - Shop object for the seller
   */
  async getByOwner() {
    const { data } = await api.get("/shop/getseller");
    return data.seller || null;
  },

  /**
   * Update shop avatar/logo
   * @param {FormData} formData - FormData with 'image' field
   * @returns {Promise} - Updated shop object
   */
  async updateShopAvatar(formData) {
    const { data } = await api.put("/shop/update-shop-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.shop || null;
  },
};

export default shopService;