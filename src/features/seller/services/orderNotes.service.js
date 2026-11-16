import api from '@/services/api';

/**
 * Seller Order Notes — buyer↔seller messaging within an order.
 * Backend: GET/POST/PATCH/DELETE /order-notes
 */
export const orderNotesService = {
  /** List notes for an order (with ?orderId=). */
  async getNotes(orderId) {
    const { data } = await api.get(`/order-notes`, { params: { orderId } });
    return data?.notes || data || [];
  },

  /** Add a note to an order (seller or buyer). */
  async addNote(orderId, message, options = {}) {
    const { data } = await api.post('/order-notes', {
      orderId,
      message,
      isPinned: options.isPinned || false,
      isInternal: false,
    });
    return data;
  },

  /** Pin/unpin a note. */
  async pinNote(noteId, isPinned) {
    const { data } = await api.patch(`/order-notes/${noteId}/pin`, {
      isPinned,
    });
    return data;
  },

  /** Delete a note (only the author can delete). */
  async deleteNote(noteId) {
    await api.delete(`/order-notes/${noteId}`);
  },
};

/**
 * Seller Order Export — CSV/JSON download.
 * Backend: GET /order-export/csv, /order-export/json/:orderId
 */
export const orderExportService = {
  /** Export orders as CSV (filters passed as query params). */
  async exportCSV(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, v);
    });
    const res = await api.get(`/order-export/csv`, { params, responseType: 'blob' });
    return res.data;
  },

  /** Export single order as JSON (packing slip). */
  async exportJSON(orderId) {
    const res = await api.get(`/order-export/json/${orderId}`, { responseType: 'json' });
    return res.data;
  },
};