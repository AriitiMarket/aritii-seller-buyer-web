import api from "./api";
import cache from "./cache";

/**
 * Product Service
 * Handles product browsing (buyers), creation, and management (sellers)
 * All product data comes from the API Gateway (Commerce Service)
 */

export const productService = {
  /**
   * Get all products for marketplace browsing
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
    cache.set(cacheKey, products, 10 * 60 * 1000);
    return products;
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
   * Get all products in a specific shop (seller)
   * @param {string} shopId - Shop ID
   * @returns {Promise} - Array of products in the shop
   */
  async getByShop(shopId) {
    const cacheKey = `products:shop:${shopId}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const { data } = await api.get(`/product/get-all-products-shop/${shopId}`);
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