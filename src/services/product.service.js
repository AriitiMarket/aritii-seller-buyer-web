import api, { publicApi } from "@/services/api";
import cache from "@/services/cache";

/**
 * Product Service
 * Handles product browsing (buyers), creation, and management (sellers)
 * All product data comes from the API Gateway (Commerce Service)
 */

export const productService = {
  /**
   * Get all products — public endpoint (limited fields, no auth required)
   * @param {Object} options - { page, limit, category, search, sort } (optional)
   * @returns {Promise} - Array of products with limited fields
   *
   * Each product carries `available` (= stock − units reserved by open orders):
   * that is the number a buyer can order right now, and the only stock figure
   * the public payload exposes.
   */
  async getPublicAll(options = {}) {
    const page = await this.getPublicPage(options);
    return page.products;
  },

  /**
   * The paged public response — `{ products, total, page, limit, totalPages }`.
   *
   * The storefront needs the counts to render "1–20 of 143" and a pager; the
   * array-only helper hid them, so every grid silently assumed page 1.
   *
   * Accepts optional `zoneId` and `cityId` so the marketplace shows only
   * products from shops serving the buyer's selected delivery zone.
   */
  async getPublicPage(options = {}) {
    const { zoneId, cityId, ...rest } = options;
    const cacheKey = `products:public:${JSON.stringify({ ...rest, zoneId, cityId })}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    let params = new URLSearchParams(rest).toString();
    if (zoneId) {
      const sep = params ? '&' : '';
      params += `${sep}zoneId=${encodeURIComponent(zoneId)}`;
    }
    if (cityId) {
      const sep = params ? '&' : '';
      params += `${sep}cityId=${encodeURIComponent(cityId)}`;
    }
    const url = params ? `/product/public/all?${params}` : "/product/public/all";
    const { data } = await publicApi.get(url, { skipAuth: true });
    const page = {
      products: data.products || [],
      total: Number(data.total) || (data.products || []).length,
      page: Number(data.page) || 1,
      limit: Number(data.limit) || (data.products || []).length,
      totalPages: Number(data.totalPages) || 1,
    };
    cache.set(cacheKey, page, 2 * 60 * 1000);
    return page;
  },

  /**
   * Get a single product — public endpoint (limited fields, no auth required)
   * @param {string} productId - Product ID
   * @returns {Promise} - Product object with limited fields
   */
  async getPublicById(productId) {
    const cacheKey = `product:public:${productId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await publicApi.get(`/product/public/${productId}`, { skipAuth: true });
    const product = data.product || null;
    cache.set(cacheKey, product, 15 * 60 * 1000);
    return product;
  },

  /**
   * Get all products for marketplace browsing (authenticated — full fields)
   * @param {Object} options - { page, limit } (optional)
   * @returns {Promise} - Array of products
   */
  async getAll(options = {}) {
    const cacheKey = `products:all:${JSON.stringify(options)}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const params = new URLSearchParams(options).toString();
    const url = params ? `/product/get-all-products?${params}` : "/product/get-all-products";
    const { data } = await api.get(url);
    const products = data.products || [];
    cache.set(cacheKey, products, 2 * 60 * 1000);
    return products;
  },

  /**
   * Force refresh products (bypass cache)
   * @param {Object} options - { page, limit } (optional)
   * @returns {Promise} - Array of products
   */
  async getAllFresh(options = {}) {
    const cacheKey = `products:all:${JSON.stringify(options)}`;
    cache.delete(cacheKey);
    return this.getAll(options);
  },

  /**
   * Get detailed information about a single product
   * @param {string} productId - Product ID
   * @returns {Promise} - Product object with full details
   */
  async getById(productId) {
    const cacheKey = `product:${productId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await api.get(`/product/get-product/${productId}`);
    const product = data.product || null;
    cache.set(cacheKey, product, 15 * 60 * 1000);
    return product;
  },

  /**
   * Get all products in a specific shop.
   *
   * `includeInactive` is for the SELLER's own inventory/analytics screens: a
   * deactivated (unlisted) product must stay visible there or it could never be
   * re-activated. The backend honours the flag only for a SELLER/ADMIN token, so
   * passing it from a public/buyer screen has no effect.
   *
   * @param {string} shopId - Shop ID
   * @param {Object} [options] - { includeInactive }
   * @returns {Promise} - Array of products in the shop
   */
  async getByShop(shopId, { includeInactive = false } = {}) {
    // The visibility scope is part of the cache key, so a seller view can never
    // be served the buyer-filtered list (or vice versa).
    const cacheKey = `products:shop:${shopId}:${includeInactive ? 'all' : 'active'}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const url = includeInactive
      ? `/product/get-all-products-shop/${shopId}?includeInactive=true`
      : `/product/get-all-products-shop/${shopId}`;
    const { data } = await api.get(url);
    const products = Array.isArray(data) ? data : data.products || [];
    cache.set(cacheKey, products, 10 * 60 * 1000);
    return products;
  },

  /**
   * Create a new product (seller only)
   * @param {FormData} formData - FormData with product details and images
   * @returns {Promise} - Created product object
   */
  async create(formData) {
    const { data } = await api.post("/product/create-product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /**
   * Update product details (seller only)
   * @param {string} productId - Product ID
   * @param {Object} updateData - { name, description, price, discountPrice, stock, category }
   * @returns {Promise} - Updated product object
   */
  async update(productId, updateData) {
    const { data } = await api.put(
      `/product/update-product/${productId}`,
      updateData
    );
    cache.delete(`product:${productId}`);
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /**
   * Seller restock (+qty) — writes a StockMovement via the ledgered endpoint.
   */
  async restock(productId, quantity, note) {
    const { data } = await api.post(`/product/restock/${productId}`, { quantity, note });
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /**
   * Seller set-total stock (the backend computes the delta and writes the
   * matching StockMovement).
   */
  async adjustStock(productId, quantity, note) {
    const { data } = await api.put(`/product/adjust-stock/${productId}`, { quantity, note });
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /** Stock movement history for one owned product (ownership enforced server-side). */
  async getStockHistory(productId, limit = 50) {
    const { data } = await api.get(`/product/stock-history/${productId}?limit=${limit}`);
    return data.movements || [];
  },

  /**
   * Lifecycle transitions the seller (or an admin) owns:
   *   publish    DRAFT / ARCHIVED -> live in the marketplace (backend enforces
   *              ownership; unarchiving itself returns a DRAFT, see below)
   *   draft      live -> hidden (reversible by publishing again)
   *   archive    retire the listing for good (reversible). The row, its stock
   *              ledger and its reviews survive, which is why archiving exists
   *              as the safe alternative to deleting a product with history.
   *   unarchive  restore an archived product as a DRAFT — publishing it again
   *              stays a deliberate, separate action.
   * @param {string} productId
   * @param {'publish'|'draft'|'archive'|'unarchive'} action
   * @returns {Promise<Object|null>} updated product
   */
  async setLifecycle(productId, action) {
    const actions = ['publish', 'draft', 'archive', 'unarchive'];
    if (!actions.includes(action)) {
      throw new Error(`Unknown lifecycle action: ${action}`);
    }
    const { data } = await api.post(`/product/${action}/${productId}`);
    cache.delete(`product:${productId}`);
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /**
   * Delete a product (seller only)
   * @param {string} productId - Product ID
   * @returns {Promise}
   */
  async delete(productId) {
    const { data } = await api.delete(
      `/product/delete-shop-product/${productId}`
    );
    cache.delete(`product:${productId}`);
    cache.invalidateByPattern("products:.*");
    return data;
  },
};

export default productService;