import api from '@/services/api';

/**
 * Delivery Service — the Delivery domain's data access.
 *
 * Delivery is INDEPENDENT of Buyer and Business (see docs/DELIVERY.md). It must
 * support more than one provider:
 *   - ARITII    → Aritii's own riders
 *   - EXTERNAL  → an external delivery provider
 *
 * Every path below is a REAL route of the Delivery Service, mounted under
 * `/delivery/...` (services/delivery-service/src/app/routes/app.js) and reached
 * through the gateway's `/delivery` prefix:
 *
 *   /delivery/request    requests (what a seller/buyer asks to be shipped)
 *   /delivery/delivery   shipments + their status
 *   /delivery/assignment courier assignments (+ accept/reject)
 *   /delivery/tracking   location history per shipment
 *   /delivery/provider   delivery providers (availability)
 *
 * The previous version of this file called invented paths
 * (`/delivery/get-assignments`, `/delivery/get-orders`, `/delivery/dashboard`)
 * that no service implements. Reads now report `supported: false` only when the
 * domain genuinely answers 404/501, and nothing here fabricates delivery data.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const deliveryService = {
  async getProviderWallet() {
    const { data } = await api.get('/delivery/provider-wallet/me');
    return data;
  },

  async saveProviderPayoutAccount(account) {
    const { data } = await api.put('/delivery/provider-wallet/me/payout-account', account);
    return data;
  },

  async requestProviderPayout(amount) {
    const { data } = await api.post('/delivery/provider-wallet/me/payouts', { amount });
    return data.payout;
  },
  /** Delivery assignments (paged). Filters: status, providerId, page, limit. */
  async getAssignments(params = {}) {
    try {
      const { data } = await api.get('/delivery/assignment', { params });
      const assignments = data?.assignments || [];
      return { assignments, count: data?.count ?? assignments.length, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { assignments: [], count: 0, supported: false };
      throw error;
    }
  },

  /** One assignment. */
  async getAssignment(assignmentId) {
    const { data } = await api.get(`/delivery/assignment/${assignmentId}`);
    return data?.assignment || null;
  },

  /**
   * Accept or reject an assignment. The backend contract is `accepted: boolean`
   * (the old `{ provider }` body was ignored, so the courier's answer never
   * reached the assignment).
   */
  async respondToAssignment(assignmentId, accepted, reason = '') {
    const { data } = await api.post(`/delivery/assignment/${assignmentId}/respond`, {
      accepted: Boolean(accepted),
      reason,
    });
    return data?.assignment || null;
  },

  /**
   * Move a delivery forward on the assignment the provider holds:
   * `pickup` → `in_transit` → `delivered`.
   *
   * The grouped (multi-order) dispatch flow has its own endpoints; this is the
   * equivalent for a SINGLE assignment, so a rider with one order is not left
   * unable to progress it.
   */
  async advanceAssignment(assignmentId, status, extra = {}) {
    const { data } = await api.post(`/delivery/assignment/${assignmentId}/advance`, {
      status,
      note: extra.note || '',
      proofOfDelivery: extra.proofOfDelivery || extra.proof || undefined,
    });
    return data?.delivery || data;
  },

  /** Shipments — the delivery queue. Filters: status, sellerId, buyerId, providerId. */
  async getDeliveries(params = {}) {
    try {
      const { data } = await api.get('/delivery/delivery', { params });
      const deliveries = data?.deliveries || [];
      return {
        deliveries,
        count: data?.count ?? deliveries.length,
        total: data?.total ?? deliveries.length,
        totalPages: data?.totalPages ?? 1,
        supported: true,
      };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { deliveries: [], count: 0, total: 0, totalPages: 0, supported: false };
      throw error;
    }
  },

  /** One shipment by its delivery id. */
  async getDelivery(deliveryId) {
    const { data } = await api.get(`/delivery/delivery/${deliveryId}`);
    return data?.delivery || null;
  },

  /**
   * The shipment for ONE marketplace order. Server-side this is the delivery
   * service's own record keyed by `orderId` — Commerce exposes the same link on
   * the ORDER ↔ DELIVERY bridge (see services/order.service.js
   * `getOrderDelivery`), which is what order screens should prefer.
   */
  async getDeliveryByOrder(orderId) {
    try {
      const { data } = await api.get(`/delivery/delivery/order/${orderId}`);
      return { delivery: data?.delivery || null, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { delivery: null, supported: false };
      throw error;
    }
  },

  /**
   * The delivery's own history — the milestone timeline plus the tracking
   * events the provider recorded. This is what makes a buyer's tracking screen
   * show the parcel's real journey instead of only the order's status.
   */
  async getDeliveryHistory(deliveryId) {
    try {
      const { data } = await api.get(`/delivery/delivery/${deliveryId}/history`);
      return {
        timeline: data?.timeline || [],
        trackingEvents: data?.trackingEvents || [],
        supported: true,
      };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { timeline: [], trackingEvents: [], supported: false };
      throw error;
    }
  },

  /** Delivery requests. Filters: sellerId, buyerId, page, limit. */
  async getRequests(params = {}) {
    try {
      const { data } = await api.get('/delivery/request', { params });
      const requests = data?.requests || [];
      return { requests, count: data?.count ?? requests.length, supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { requests: [], count: 0, supported: false };
      throw error;
    }
  },

  /** One delivery request. */
  async getRequest(requestId) {
    const { data } = await api.get(`/delivery/request/${requestId}`);
    return data?.request || null;
  },

  /** Ask the Delivery Service whether an address is serviceable. */
  async validateAddress(payload) {
    const { data } = await api.post('/delivery/request/validate-address', payload);
    return data;
  },

  /** Location history for a shipment (tracking points). */
  async getTracking(deliveryId) {
    try {
      const { data } = await api.get(`/delivery/tracking/${deliveryId}`);
      return { events: data?.events || data?.tracking || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { events: [], supported: false };
      throw error;
    }
  },

  /** The most recent known position of a shipment. */
  async getLatestLocation(deliveryId) {
    const { data } = await api.get(`/delivery/tracking/${deliveryId}/latest`);
    return data?.location || data?.tracking || null;
  },

  /**
   * A delivery provider toggles their own availability.
   *
   * The body field is `isOnline` (`PUT /delivery/provider/:id/online`). It used
   * to be sent as `online`, which the service read as `undefined` — so tapping
   * "go online" actually took the provider OFFLINE (and made them permanently
   * ineligible for assignments, since eligibility requires `isOnline`).
   */
  async setOnline(providerId, online) {
    const { data } = await api.put(`/delivery/provider/${providerId}/online`, { isOnline: Boolean(online) });
    return data?.provider || data?.partner || data;
  },

  /** Rider's grouped dispatch assignments and state transitions. */
  async getMyDispatchBatches(params = {}) {
    const { data } = await api.get('/delivery/dispatch/mine', { params });
    return data || {};
  },
  async getMyDispatchBatch(batchId) {
    try {
      const { data } = await api.get(`/delivery/dispatch/batches/${batchId}`);
      return data?.assignment || null;
    } catch (err) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },
  async respondToDispatchBatch(batchId, accepted, reason = '') {
    const { data } = await api.post(`/delivery/dispatch/batches/${batchId}/respond`, { accepted, reason });
    return data?.assignment || null;
  },
  async startDispatchPickup(batchId) {
    const { data } = await api.post(`/delivery/dispatch/batches/${batchId}/pickup/start`);
    return data?.assignment || null;
  },
  async confirmDispatchPickup(batchId, sellerId) {
    const { data } = await api.post(`/delivery/dispatch/batches/${batchId}/pickup/${sellerId}/confirm`);
    return data?.assignment || null;
  },
  async startDispatchTransit(batchId) {
    const { data } = await api.post(`/delivery/dispatch/batches/${batchId}/transit/start`);
    return data?.assignment || null;
  },
  async confirmDispatchDelivery(batchId, orderId, proof = {}) {
    const { data } = await api.post(`/delivery/dispatch/batches/${batchId}/orders/${encodeURIComponent(orderId)}/deliver`, proof);
    return data?.assignment || null;
  },
};

export default deliveryService;
