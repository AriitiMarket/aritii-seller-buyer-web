import api from '@/services/api';

/**
 * API service for delivery provider applications.
 *
 * Follows the same contract as the seller flow
 * (src/seller-registration/api/sellerRegistrationApi.js):
 *
 *   POST   /provider-application       -> submit or amend my application
 *   GET    /provider-application/me    -> my application + review status
 *   DELETE /provider-application/me    -> withdraw (only while awaiting review)
 *
 * Every call goes through the ONE shared axios client (@/services/api) so the
 * bearer token, refresh handling and base URL stay in a single place. The old
 * implementation built its own axios instance against `VITE_API_BASE_URL`
 * (falling back to localhost:5000), which sent unauthenticated requests to a
 * port nothing listens on.
 */
const unwrap = (response) => response.data?.data || response.data;

export const providerApplicationApi = {
  /** The caller's own application, or null when they have not applied yet. */
  async getMine() {
    const result = unwrap(await api.get('/provider-application/me'));
    return result.application || null;
  },

  async submit(application) {
    const result = unwrap(await api.post('/provider-application', application));
    return result.application || null;
  },

  async withdraw() {
    return unwrap(await api.delete('/provider-application/me'));
  },

  // ── Admin review queue (the admin console owns the UI) ────────────────────
  async adminList(params) {
    const result = unwrap(await api.get('/provider-application', { params }));
    return result.applications || [];
  },

  async adminGet(id) {
    const result = unwrap(await api.get(`/provider-application/${id}`));
    return result.application;
  },

  async approve(id) {
    return unwrap(await api.post(`/provider-application/${id}/approve`, {}));
  },

  async reject(id, reason) {
    return unwrap(await api.post(`/provider-application/${id}/reject`, { reason }));
  },
};

export default providerApplicationApi;
