import api, { publicApi } from "@/services/api";
import cache from "@/services/cache";

/**
 * Shop Service
 * Handles shop browsing, public shop information, and shop management
 * Provides public shop marketplace data visible to buyers
 */

export const shopService = {
  /**
   * Get all shops — public endpoint (limited fields, no auth required).
   * Accepts optional `zoneId` and `cityId` query params so the marketplace
   * can show only shops that serve the buyer's selected delivery zone.
   * @param {Object} [params] - { zoneId?, cityId?, limit? }
   * @returns {Promise} - Array of shop objects (each carries a `delivery` block)
   */
  async getPublicAll(params = {}) {
    const { zoneId, cityId, regionId, limit = 100 } = params;
    const cacheKey = `shops:public:all:${JSON.stringify({ zoneId, cityId, regionId, limit })}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const query = { limit };
    if (zoneId) query.zoneId = zoneId;
    if (cityId) query.cityId = cityId;
    if (regionId) query.regionId = regionId;

    const { data } = await publicApi.get('/shop/public/all', {
      params: query,
      skipAuth: true,
    });
    const shops = data.shops || [];
    cache.set(cacheKey, shops, 15 * 60 * 1000);
    return shops;
  },

  /**
   * Get public shops that serve the buyer's selected delivery zone.
   * Falls back to all shops when no zone is selected (broadcast mode).
   * @param {string|null} zoneId
   * @param {string|null} cityId
   * @returns {Promise<Array>} shops serving the zone (or all shops if no zone)
   */
  async getPublicShopsForZone(zoneId, cityId) {
    if (!zoneId && !cityId) return this.getPublicAll({});
    return this.getPublicAll({ zoneId, cityId });
  },

  /**
   * Get a single shop — public endpoint (limited fields, no auth required)
   * @param {string} shopId - Shop ID
   * @returns {Promise} - Shop object with limited fields
   */
  async getPublicById(shopId) {
    const cacheKey = `shop:public:${shopId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await publicApi.get(`/shop/public/${shopId}`, { skipAuth: true });
    const shop = data.shop || null;
    cache.set(cacheKey, shop, 20 * 60 * 1000);
    return shop;
  },

  /**
   * Get all shops for marketplace browsing (authenticated — full fields)
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
   * Open a new shop under the authenticated business account (multi-shop support).
   * Ownership is inferred from the authenticated JWT token.
   * Backend: POST /shop/create-shop (multipart/form-data)
   * @param {FormData} formData - Shop creation form data (name, email, address, category, avatar file)
   * @returns {Promise<Object|null>} Created shop object in PENDING_APPROVAL status
   */
  async createShop(formData) {
    const { data } = await api.post('/shop/create-shop', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.shop || null;
  },

  /**
   * Retrieve all shops owned by the authenticated business user.
   * Backend: GET /shop/getseller
   * @returns {Promise<Array<object>>} List of shops owned by caller
   */
  async getByOwner() {
    const { data } = await api.get("/shop/getseller");
    if (Array.isArray(data.shops)) return data.shops;
    return data.seller ? [data.seller] : [];
  },

  /**
   * Update profile and configuration for a specific shop.
   * Backend: PUT /shop/update-shop-info
   * @param {string} shopId - Shop unique identifier to update
   * @param {Object} shopData - Editable profile and contact fields
   * @returns {Promise<object>} Updated shop record
   */
  async updateShopInfo(shopId, shopData) {
    const { data } = await api.put('/shop/update-shop-info', { ...shopData, shopId });
    return data?.shop || data;
  },

  /**
   * Replace logo/avatar image for a specific shop.
   * Backend: PUT /shop/update-shop-avatar (multipart/form-data)
   * @param {string} shopId - Shop unique identifier
   * @param {FormData} formData - FormData containing the image file
   * @returns {Promise<object|null>} Updated shop record with new avatar URL
   */
  async updateShopAvatar(shopId, formData) {
    if (shopId) formData.append('shopId', shopId);
    const { data } = await api.put("/shop/update-shop-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.shop || null;
  },
};

export default shopService;
