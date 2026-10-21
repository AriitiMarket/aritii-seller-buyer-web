/**
 * Seller Payments API Service
 *
 * Owns every call the seller workspace makes against the money endpoints:
 * payment accounts, payouts, wallet balance and the payment ledger.
 *
 * Every method goes through the shared axios client (`@/services/api`), so
 * the gateway base URL, the auth header and the token-refresh interceptors
 * are applied exactly once. Pages must not call `fetch()` directly — a
 * relative `fetch('/payment/...')` never reaches the API gateway and
 * silently sends no Authorization header.
 */
import BaseService from '@/services/BaseService';

class SellerPaymentsService extends BaseService {
  /* ---------------------------------------------------------------------
   * Payment accounts (seller's own bank/payment accounts)
   * Backend: GET /payment/get-seller-accounts
   * ------------------------------------------------------------------- */
  async getPaymentAccounts() {
    return this.get('/payment/get-seller-accounts');
  }

  /**
   * Create a new payment account for a seller.
   * Backend: POST /payment/seller/:sellerId/payment-accounts
   */
  async createPaymentAccount(sellerId, account) {
    return this.post(`/payment/seller/${sellerId}/payment-accounts`, account);
  }

  /**
   * Remove a payment account (the seller's own payout destination).
   * Backend: DELETE /payment/seller/payment-accounts/:id
   *
   * This used to call `DELETE /payment/delete-payment/:id`, which DELETES A
   * PAYMENT — a financial transaction record. A seller pressing "delete my
   * bank account" was asking the server to destroy a transaction.
   */
  async deletePaymentAccount(sellerId, accountId) {
    return this.delete(`/payment/seller/${sellerId}/payment-accounts/${accountId}`);
  }

  /* ---------------------------------------------------------------------
   * Payouts
   * Backend: GET /payout  |  POST /payout/request  |  GET /payout/:id
   * ------------------------------------------------------------------- */
  async getPayouts(options = {}) {
    const { status, limit = 50, offset = 0 } = options;
    const params = {
      limit: Math.min(Math.max(1, limit), 100),
      offset: Math.max(0, offset),
    };
    if (status) params.status = status;
    return this.get('/payout', params);
  }

  async requestPayout(payload) {
    return this.post('/payout/request', payload);
  }

  async getPayout(payoutId) {
    return this.get(`/payout/${payoutId}`);
  }

  /* ---------------------------------------------------------------------
   * Wallet
   * Backend: GET /wallet/:sellerId/dashboard
   * ------------------------------------------------------------------- */
  async getWalletDashboard(sellerId) {
    return this.get(`/wallet/${sellerId}/dashboard`);
  }

  async getWalletTransactions(sellerId, options = {}) {
    const { limit = 50, offset = 0, type, status, direction } = options;
    const params = {
      limit: Math.min(Math.max(1, limit), 100),
      offset: Math.max(0, offset),
    };
    if (type) params.type = type;
    if (status) params.status = status;
    if (direction) params.direction = direction;
    return this.get(`/wallet/${sellerId}/transactions`, params);
  }

  /* ---------------------------------------------------------------------
   * Buyer-facing money surfaces
   * Backend: GET /payment/get-active-methods | GET /payment-ledger/:id
   * ------------------------------------------------------------------- */
  async getActivePaymentMethods() {
    return this.get('/payment/get-active-methods');
  }

  async getPaymentLedger(paymentId) {
    return this.get(`/payment-ledger/${paymentId}`);
  }
}

export default new SellerPaymentsService();
