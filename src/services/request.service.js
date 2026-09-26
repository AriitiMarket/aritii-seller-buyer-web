import api from '@/services/api';

/**
 * Customer Request Service — buyer-initiated requests (e.g. sourcing a product
 * a buyer wants a shop to stock, or a support request tied to an order).
 *
 * Backed by the Commerce request module. A request always belongs to an account
 * (there is no anonymous surface) and the author is derived from the token
 * server-side. Sellers read and answer the requests addressed to their own shop.
 *
 * A 404/501 is still treated as "not available" so the UI renders an honest
 * empty state against a deployment that has not shipped the module.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const requestService = {
  /** @returns {Promise<{requests: object[], supported: boolean}>} */
  async getMine() {
    try {
      const { data } = await api.get('/request', { params: { /* customer requests */ } });
      return { requests: data?.requests || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { requests: [], supported: false };
      throw error;
    }
  },

  async create(payload) {
    const { data } = await api.post('/request', payload);
    return data?.request || data;
  },

  async get(id) { const { data } = await api.get(`/request/${id}`); return data?.request || data; },
  async getMessages(id) { const { data } = await api.get(`/request/${id}/messages`); return data?.messages || []; },
  async sendMessage(id, payload) { const { data } = await api.post(`/request/${id}/messages`, payload); return data?.message || data; },
  async makeOffer(id, payload) { const { data } = await api.post(`/request/${id}/offers`, payload); return data?.request || data; },
  async acceptOffer(id) { const { data } = await api.post(`/request/${id}/accept`); return data?.request || data; },
  /**
   * Confirm THIS side of the agreement (buyer or seller). An order can only be
   * created once both confirmations exist (`agreement.confirmedAt`).
   */
  async confirmAgreement(id, payload = {}) { const { data } = await api.post(`/request/${id}/agreement/confirm`, payload); return data?.request || data; },
  /** Either side reports the request to the platform (abuse, no-show, …). */
  async reportRequest(id, payload) { const { data } = await api.post(`/request/${id}/report`, payload); return data?.request || data; },
  /**
   * Customer rejects the live seller offer. The request stays NEGOTIATING — the
   * two sides keep talking; only `cancelRequest` closes the request itself.
   */
  async declineOffer(id, payload = {}) { const { data } = await api.post(`/request/${id}/offers/decline`, payload); return data?.request || data; },
  /** Seller acknowledges an incoming request (PENDING → REVIEWING). */
  async acceptRequest(id) { const { data } = await api.post(`/request/${id}/accept-request`); return data?.request || data; },
  /**
   * Seller links a catalogue product to an offer. An order can only be created
   * from a real product (the backend re-prices from the catalogue), so this is
   * what makes an agreement convertible — including one reached without one.
   */
  async attachOfferProduct(id, payload) { const { data } = await api.post(`/request/${id}/offers/product`, payload); return data?.request || data; },
  async declineRequest(id) { const { data } = await api.post(`/request/${id}/decline`); return data?.request || data; },
  async convertToOrder(id, payload) { const { data } = await api.post(`/request/${id}/convert-to-order`, payload); return data; },
  async cancelRequest(id) { const { data } = await api.post(`/request/${id}/cancel`); return data?.request || data; },

  async listAdmin(params = {}) { const { data } = await api.get('/request/admin', { params }); return data?.requests || []; },
  /** Admin: request pipeline counters (per status). */
  async getAdminStats() { const { data } = await api.get('/request/admin/stats'); return data || {}; },
  /** Admin: close an abusive/reported request. */
  async closeRequest(id, payload = {}) { const { data } = await api.post(`/request/admin/${id}/close`, payload); return data?.request || data; },
  /** Admin: suspend/restore a request (all writes freeze while suspended). */
  async suspendRequest(id, payload = {}) { const { data } = await api.post(`/request/admin/${id}/suspend`, payload); return data?.request || data; },
  async restoreRequest(id) { const { data } = await api.post(`/request/admin/${id}/restore`); return data?.request || data; },
  /** Admin: remove one attachment from a reported request. */
  async removeAttachment(id, index) { const { data } = await api.post(`/request/admin/${id}/attachments/remove`, { index }); return data?.request || data; },
  /** Admin: resolve or dismiss a report (`status: RESOLVED | DISMISSED`). */
  async reviewReport(id, reportId, payload = {}) { const { data } = await api.post(`/request/admin/${id}/reports/${reportId}/review`, payload); return data?.request || data; },
  /** Admin: platform-wide user restrictions on requests (create/list/lift). */
  async listRestrictions(params = {}) { const { data } = await api.get('/request/admin/restrictions', { params }); return data?.restrictions || []; },
  async createRestriction(payload) { const { data } = await api.post('/request/admin/restrictions', payload); return data?.restriction || data; },
  async liftRestriction(restrictionId, payload = {}) { const { data } = await api.post(`/request/admin/restrictions/${restrictionId}/lift`, payload); return data?.restriction || data; },

  /**
   * Seller: requests addressed to one of my shops.
   * The backend proves shop ownership, so a non-owner gets 403.
   * @param {string} shopId
   * @returns {Promise<{requests: object[], canManage?: boolean}>}
   */
  async getForShop(shopId) {
    const { data } = await api.get(`/request/shop/${shopId}`);
    return { requests: data?.requests || [], supported: true };
  },
};

export default requestService;