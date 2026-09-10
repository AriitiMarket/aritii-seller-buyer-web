import api from "./api";

/**
 * Shop service — thin wrapper around the central API client.
 * Provides public shop marketplace data (no private account fields
 * are returned to the buyer view beyond what the API exposes; the
 * UI layer only renders business-facing fields).
 */
export const shopService = {
  async getAll() {
    const { data } = await api.get("/shop/get-all-shops");
    return data.shops || [];
  },

  /**
   * Fetch a single shop's public info by id.
   * Returns the full shop doc from the backend; the caller should
   * render only business fields (name, avatar, address, description,
   * productCount, ratings) and never expose ownerId/email/balances.
   */
  async getById(shopId) {
    const { data } = await api.get(`/shop/get-shop-info/${shopId}`);
    return data.shop || null;
  },

  async getByOwner() {
    const { data } = await api.get("/shop/getseller");
    return data.seller || null;
  },
};

export default shopService;