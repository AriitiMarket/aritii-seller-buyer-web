import api from "./api";

/**
 * Product service — thin wrapper around the central API client.
 * All product data comes from the API Gateway (Commerce Service).
 */
export const productService = {
  async getAll() {
    const { data } = await api.get("/product/get-all-products");
    return data.products || [];
  },

  async getByShop(shopId) {
    const { data } = await api.get(`/product/get-all-products-shop/${shopId}`);
    // Response may be { products: [...] } or a bare array.
    return Array.isArray(data) ? data : data.products || [];
  },

  async create(payload) {
    const { data } = await api.post("/product/create-product", payload);
    return data;
  },
};

export default productService;