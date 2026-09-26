import api from '@/services/api';

/**
 * Assignment Service — assigning orders to delivery actors/providers.
 *
 * Delivery assignments are independent of the business order queue: a business
 * does not decide who delivers, the Delivery domain does (dispatcher/admin side).
 */
const NOT_AVAILABLE = (error) =>
  error?.response?.status === 404 || error?.response?.status === 501;

export const assignmentService = {
  /** @returns {Promise<{assignments: DeliveryAssignment[], supported: boolean}>} */
  async getMine() {
    try {
      const { data } = await api.get('/delivery/assignments/mine');
      return { assignments: data?.assignments || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { assignments: [], supported: false };
      throw error;
    }
  },

  /** Dispatcher view: unassigned orders waiting for a delivery actor. */
  async getPending() {
    try {
      const { data } = await api.get('/delivery/assignments/pending');
      return { assignments: data?.assignments || [], supported: true };
    } catch (error) {
      if (NOT_AVAILABLE(error)) return { assignments: [], supported: false };
      throw error;
    }
  },

  async assign(orderId, payload) {
    const { data } = await api.post(`/delivery/assign/${orderId}`, payload);
    return data?.assignment || data;
  },

  async unassign(assignmentId) {
    const { data } = await api.delete(`/delivery/assignments/${assignmentId}`);
    return data;
  },
};

export default assignmentService;