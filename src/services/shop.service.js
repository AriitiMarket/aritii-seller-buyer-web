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
   * Get current authenticated seller's shop.
   * The backend answers 200 with `seller: null` for an authenticated account
   * that owns no shop (buyer, or a seller who has not created one yet), so a
   * missing shop is a normal empty state — never an error.
   * @returns {Promise<Object|null>} Shop object for the seller, or null
   */
  /**
   * Open ANOTHER shop under the same business account (multi-shop sellers).
   *
   * Ownership always comes from the verified token. The backend enforces the
   * seller-type rules: an INDIVIDUAL seller is limited to one shop, and every
   * ADDITIONAL shop must name a shop category (type 'business') so the stores
   * are browsable separately.
   *
   * @param {FormData} formData - name, email, address, phoneNumber, category,
   *   description and the avatar under the `file` key (required by the API)
   * @returns {Promise<Object|null>} the created shop (status PENDING_APPROVAL)
   */
  async createShop(formData) {
    const { data } = await api.post('/shop/create-shop', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.shop || null;
  },

  /**
   * Get EVERY shop of the authenticated business.
   *
   * Returns an ARRAY — a business may own several shops. The response also
   * carries `seller` (the primary shop) for older single-shop callers.
   * @returns {Promise<Array>} shops owned by the caller (possibly empty)
   */
  async getByOwner() {
    const { data } = await api.get("/shop/getseller");
    if (Array.isArray(data.shops)) return data.shops;
    return data.seller ? [data.seller] : [];
  },

  /**
   * Owner: update one of the business's shops.
   *
   * `shopId` names the target. It is required when the business owns more than
   * one shop — the backend rejects an ambiguous write instead of guessing
   * (which is how a request could previously land on the wrong shop).
   * @param {string} shopId - shop to update
   * @param {Object} shopData - editable profile fields
   */
  async updateShopInfo(shopId, shopData) {
    const { data } = await api.put('/shop/update-shop-info', { ...shopData, shopId });
    return data?.shop || data;
  },

  /**
   * Owner: replace one shop's logo.
   * @param {string} shopId - shop to update
   * @param {FormData} formData - FormData with the `image` file
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
