import api from '@/services/api';

/**
 * Tracking Service — delivery tracking for an order.
 *
 * Tracking is part of the Delivery domain (not Buyer): buyers see the public
 * status, delivery actors and dispatchers see the operational detail. Buyer-
 * facing tracking reuses this service so both views agree on one status model
 * (see ORDER_STATUSES in src/config/index.js).
 *
 * Endpoints (delivery-service/src/app/routes/app.js):
 *   GET  /delivery/delivery/order/:orderId -> { delivery | null }
 *   GET  /delivery/tracking/:deliveryId    -> { events }
 *   POST /delivery/tracking/               -> { event }  (admin/dispatch)
 * The tracking resource is keyed by DELIVERY id, so an order id is resolved
 * to its delivery first — there is no `/delivery/track/:orderId`.
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

async function deliveryIdForOrder(orderId) {
  const { data } = await api.get(`/delivery/delivery/order/${orderId}`);
  const delivery = data?.delivery;
  return delivery ? delivery._id || delivery.id || null : null;
}

export const trackingService = {
  /**
   * Tracking events of the order's delivery.
   * An order that has no delivery yet is not an error: it returns no events.
   * @returns {Promise<{events: object[], supported: boolean}>}
   */
  async getByOrder(orderId) {
    try {
      const deliveryId = await deliveryIdForOrder(orderId);
      if (!deliveryId) return { events: [], supported: true };
      const { data } = await api.get(`/delivery/tracking/${deliveryId}`);
      return { events: data?.events || data?.tracking || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { events: [], supported: false };
      throw error;
    }
  },

  /** Delivery actor pushes a new tracking event for the order's delivery. */
  async push(orderId, payload = {}) {
    const deliveryId = await deliveryIdForOrder(orderId);
    if (!deliveryId) throw new Error('This order has no delivery yet');
    const { data } = await api.post('/delivery/tracking/', { ...payload, deliveryId });
    return data?.event || data;
  },
};

export default trackingService;
