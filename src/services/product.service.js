import api, { publicApi } from "@/services/api";
import cache from "@/services/cache";

// A body carrying files must go out as multipart so multer can read it.
// (axios drops the header itself and lets the browser set the boundary.)
const MULTIPART_CONFIG = { headers: { "Content-Type": "multipart/form-data" } };

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
   * 
   * Includes timeout protection to prevent hanging requests.
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
    
    try {
      const { data } = await publicApi.get(url, { 
        skipAuth: true,
        timeout: 30000 // 30 second timeout
      });
      
      const page = {
        products: data.products || [],
        total: Number(data.total) || (data.products || []).length,
        page: Number(data.page) || 1,
        limit: Number(data.limit) || (data.products || []).length,
        totalPages: Number(data.totalPages) || 1,
      };
      cache.set(cacheKey, page, 2 * 60 * 1000);
      return page;
    } catch (error) {
      // If timeout, return empty cache to allow graceful degradation
      if (error.code === 'ECONNABORTED') {
        console.warn('Product loading timeout, returning cached or empty results');
        return {
          products: [],
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        };
      }
      throw error;
    }
  },

  /**
   * Get public deal products — products with discountPrice < originalPrice.
   * Calls the dedicated /product/public/deals endpoint on the backend.
   * @param {Object} options - { limit }
   * @returns {Promise} - { products, total, count, page, limit, totalPages }
   */
  async getPublicDeals(options = {}) {
    const { limit = 50 } = options;
    const cacheKey = `products:public:deals:${limit}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { data } = await publicApi.get(`/product/public/deals?limit=${limit}`, {
        skipAuth: true,
        timeout: 30000,
      });

      const result = {
        products: data.products || [],
        total: Number(data.total) || (data.products || []).length,
        count: Number(data.count) || (data.products || []).length,
        page: Number(data.page) || 1,
        limit: Number(data.limit) || limit,
        totalPages: Number(data.totalPages) || 1,
      };

      cache.set(cacheKey, result, 2 * 60 * 1000);
      return result;
    } catch (error) {
      // If endpoint fails, fall back to getPublicFiltered with client-side discount calculation
      const fallback = await this.getPublicFiltered({ limit });
      const products = (fallback.products || []).filter(
        (p) => (Number(p.originalPrice) || 0) > (Number(p.discountPrice ?? p.price) || 0)
      );
      return {
        products,
        total: products.length,
        count: products.length,
        page: 1,
        limit,
        totalPages: 1,
      };
    }
  },

  /**
   * Get filtered products from the backend with all filter params
   * Falls back to getPublicAll if filtered endpoint unavailable
   * @param {Object} filters - { category, minPrice, maxPrice, rating, zoneId, cityId, search, page, limit }
   * @returns {Promise} - Paged response with products and metadata
   */
  async getPublicFiltered(filters = {}) {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      zoneId,
      cityId,
      search,
      shop,
      page = 1,
      limit = 24,
    } = filters;

    // Build cache key from filters
    const cacheKey = `products:public:filtered:${JSON.stringify({
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      zoneId,
      cityId,
      search,
      shop,
      page,
      limit,
    })}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // Build query params - only if at least one filter is specified
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (rating) params.append('rating', rating);
    if (zoneId) params.append('zoneId', zoneId);
    if (cityId) params.append('cityId', cityId);
    if (search) params.append('search', search);
    if (shop) params.append('shop', shop);
    if (page && page > 1) params.append('page', page);
    if (limit && limit !== 24) params.append('limit', limit);

    const url = `/product/public/all?${params.toString()}`;
    
    try {
      const { data } = await publicApi.get(url, { 
        skipAuth: true,
        timeout: 30000 // 30 second timeout
      });

      const result = {
        products: data.products || [],
        total: Number(data.total) || 0,
        page: Number(data.page) || 1,
        limit: Number(data.limit) || limit,
        totalPages: Math.ceil((Number(data.total) || 0) / limit),
        aggregations: data.aggregations || {},
      };

      cache.set(cacheKey, result, 2 * 60 * 1000);
      return result;
    } catch (error) {
      // If 404 or 400, endpoint doesn't exist - fall back to public all endpoint
      if (error.response?.status === 400 || error.response?.status === 404) {
        const fallbackResult = await this.getPublicPage({
          page,
          limit,
          zoneId,
          cityId,
        });
        
        // Perform client-side filtering
        let filtered = fallbackResult.products || [];
        if (category) {
          filtered = filtered.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
        }
        if (search) {
          const q = String(search).toLowerCase();
          filtered = filtered.filter(p => 
            (p.name || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q)
          );
        }
        if (minPrice) {
          filtered = filtered.filter(p => (p.discountPrice || p.price || 0) >= Number(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter(p => (p.discountPrice || p.price || 0) <= Number(maxPrice));
        }
        if (rating) {
          filtered = filtered.filter(p => (p.ratings || 0) >= Number(rating));
        }
        if (shop) {
          filtered = filtered.filter(p => (p.shop?.name || '').toLowerCase() === String(shop).toLowerCase());
        }
        
        const result = {
          products: filtered,
          total: filtered.length,
          page: 1,
          limit: filtered.length,
          totalPages: 1,
          aggregations: {},
        };
        
        cache.set(cacheKey, result, 2 * 60 * 1000);
        return result;
      }
      
      // For timeout or other errors, return empty result
      if (error.code === 'ECONNABORTED') {
        console.warn('Filtered products request timeout, returning empty results');
        return {
          products: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          aggregations: {},
        };
      }
      
      // For other errors, still return something usable
      console.error('Filtered products request error:', error.message);
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        aggregations: {},
      };
    }
  },

  /**
   * Get category metadata with product counts
   * @param {Object} filters - { zoneId, cityId }
   * @returns {Promise} - Array of categories with product counts
   */
  async getCategoryMetadata(filters = {}) {
    const { zoneId, cityId } = filters;
    const cacheKey = `categories:metadata:${zoneId || ''}:${cityId || ''}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const params = new URLSearchParams();
    if (zoneId) params.append('zoneId', zoneId);
    if (cityId) params.append('cityId', cityId);

    const url = `/category?${params.toString()}`;
    const { data } = await publicApi.get(url, { skipAuth: true });

    const categories = data.categories || [];
    cache.set(cacheKey, categories, 5 * 60 * 1000);
    return categories;
  },

  /**
   * Real keyword search against the dedicated `/product/search?q=` endpoint.
   *
   * This is the canonical, bounded + paginated search endpoint and it is
   * requester-aware: guests and signed-in buyers both get the published catalog.
   * It powers the search bar's live suggestions and signed-in searches, because
   * `/product/get-all-products` only honours a `search` filter for admins.
   *
   * @param {string} q - search term
   * @param {Object} [options] - { page, limit }
   * @returns {Promise<Array>} matching products
   */
  async searchProducts(q, { page = 1, limit = 20 } = {}) {
    const term = String(q || '').trim();
    if (!term) return [];
    const params = new URLSearchParams({ q: term, page: String(page), limit: String(limit) });
    const cacheKey = `products:search:${params.toString()}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
      const { data } = await publicApi.get(`/product/search?${params.toString()}`, {
        skipAuth: true,
        timeout: 30000,
      });
      const products = data.products || [];
      cache.set(cacheKey, products, 60 * 1000); // 60s — search results are volatile
      return products;
    } catch (error) {
      if (error.code === 'ECONNABORTED') return [];
      throw error;
    }
  },

  /**
   * Get all products for marketplace browsing (authenticated — full fields)
   * @param {Object} options - { page, limit } (optional)
   * @returns {Promise} - Array of products
   *
   * Includes timeout protection to prevent hanging requests.
   */
  async getAll(options = {}) {
    const cacheKey = `products:all:${JSON.stringify(options)}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const params = new URLSearchParams(options).toString();
    const url = params ? `/product/get-all-products?${params}` : "/product/get-all-products";
    
    try {
      const { data } = await api.get(url, { timeout: 30000 }); // 30 second timeout
      const products = data.products || [];
      cache.set(cacheKey, products, 2 * 60 * 1000);
      return products;
    } catch (error) {
      // If timeout, return empty to allow graceful degradation
      if (error.code === 'ECONNABORTED') {
        console.warn('All products loading timeout, returning empty results');
        return [];
      }
      throw error;
    }
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
   * Get detailed information about a single product — public endpoint
   * @param {string} productId - Product ID
   * @returns {Promise} - Product object with full details
   */
  async getPublicById(productId) {
    const cacheKey = `product:public:${productId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const { data } = await publicApi.get(`/product/public/${productId}`, { skipAuth: true });
      const product = data.product || data || null;
      cache.set(cacheKey, product, 15 * 60 * 1000);
      return product;
    } catch (error) {
      // Fallback to authenticated endpoint if public endpoint doesn't exist
      if (error.response?.status === 404) {
        try {
          const { data } = await api.get(`/product/get-product/${productId}`);
          const product = data.product || null;
          cache.set(cacheKey, product, 15 * 60 * 1000);
          return product;
        } catch {
          throw error; // Re-throw original 404
        }
      }
      throw error;
    }
  },

  /**
   * Get detailed information about a single product (authenticated)
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
    const { data } = await api.post("/product/create-product", formData, MULTIPART_CONFIG);
    // FIX #14: Invalidate shop products cache when new product created
    if (data.product?.shopId) {
      cache.invalidateShopCache(data.product.shopId);
    }
    cache.invalidateByPattern("products:.*");
    return data.product || null;
  },

  /**
   * Update product details (seller only)
   * @param {string} productId - Product ID
   * @param {Object|FormData} updateData - plain fields, or FormData when
   *        images are uploaded/removed (multipart: `productImg` files,
   *        `imageUrls` refs, `clearImages`)
   * @returns {Promise} - Updated product object
   */
  async update(productId, updateData) {
    // A FormData body must go out as multipart so the files reach multer.
    const isMultipart =
      typeof FormData !== 'undefined' && updateData instanceof FormData;
    const { data } = await api.put(
      `/product/update-product/${productId}`,
      updateData,
      isMultipart ? MULTIPART_CONFIG : undefined
    );
    // FIX #14: Use new cache invalidation method
    if (data.product?.shopId) {
      cache.invalidateProductCache(productId, data.product.shopId);
    } else {
      cache.delete(`product:${productId}`);
      cache.invalidateByPattern("products:.*");
    }
    return data.product || null;
  },

  /**
   * Seller restock (+qty) — writes a StockMovement via the ledgered endpoint.
   */
  async restock(productId, quantity, note) {
    const { data } = await api.post(`/product/restock/${productId}`, { quantity, note });
    // FIX #14: Invalidate product cache on stock change
    if (data.product?.shopId) {
      cache.invalidateProductCache(productId, data.product.shopId);
    }
    return data.product || null;
  },

  /**
   * Seller set-total stock (the backend computes the delta and writes the
   * matching StockMovement).
   */
  async adjustStock(productId, quantity, note) {
    const { data } = await api.put(`/product/adjust-stock/${productId}`, { quantity, note });
    // FIX #14: Invalidate product cache on stock change
    if (data.product?.shopId) {
      cache.invalidateProductCache(productId, data.product.shopId);
    }
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
