import api from '@/services/api';

/**
 * Promotion Service — commercial offers / campaigns.
 *
 * Promotions are an INDEPENDENT feature: they are not catalog items and not
 * events (see docs/MARKETPLACE.md § Promotions and docs/BUSINESS.md).
 *
 * Backed by the Commerce promotions module: a seller manages the offers of the
 * shops they own, while everyone else reads only the LIVE, publicly listed ones
 * (a promotion stops being public the moment its window closes, so `status` is
 * never trusted on its own).
 *
 * A 404/501 is still treated as "not available" so the UI degrades honestly
 * against a deployment that has not shipped the module.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const promotionService = {
  /** @returns {Promise<{promotions: Promotion[], supported: boolean}>} */
  async getAll() {
    try {
      const { data } = await api.get('/promotion/get-all-promotions');
      const promotions = data?.promotions || data?.data || [];
      return { promotions, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { promotions: [], supported: false };
      throw error;
    }
  },

  /** Public/marketplace view: only offers the backend marks as publicly visible. */
  async getPublic() {
    const { promotions, supported } = await this.getAll();
    return {
      supported,
      promotions: promotions.filter((p) => p.showOnPublic !== false),
    };
  },

  async getById(id) {
    const { data } = await api.get(`/promotion/get-promotion/${id}`);
    return data?.promotion || data;
  },

  async getByShop(shopId) {
    try {
      const { data } = await api.get(`/promotion/get-all-promotions/${shopId}`);
      return data?.promotions || [];
    } catch (error) {
      if (NOT_AVAILABLE(error)) return [];
      throw error;
    }
  },

  async create(payload) {
    const { data } = await api.post('/promotion/create-promotion', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/promotion/update-promotion/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/promotion/delete-promotion/${id}`);
    return data;
  },
};

export default promotionService;