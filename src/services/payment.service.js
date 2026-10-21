/**
 * Payment API Service
 *
 * The single payment client for the whole app. It used to exist three times
 * over — an inline class in `services/index.js`, this file, and a second copy
 * under `src/buyer/services/` — each with a different constructor and a
 * different set of endpoints. One client now owns every payment call, and it
 * extends `BaseService` like every other service so the shared axios client
 * (gateway base URL + auth header + token refresh) is always used.
 */
import BaseService from '@/services/BaseService';

class PaymentService extends BaseService {
  /* ===== PAYMENT METHODS (BUYER) =====
   * Backend: GET /payment/get-active-methods  ->  { success, methods: [...] }
   */
  async getActiveMethods() {
    return this.getList('/payment/get-active-methods', 'methods');
  }

  /* ===== PAYMENT METHODS (ADMIN catalogue) =====
   * Backend: GET /payment/admin/methods  ->  { success, methods: [...] }
   */
  async getAllMethods() {
    return this.getList('/payment/admin/methods', 'methods');
  }

  async saveMethod(method) {
    return this.post('/payment/admin/methods', method);
  }

  async updateMethod(methodId, updates) {
    return this.put(`/payment/admin/methods/${methodId}`, updates);
  }

  /* There is deliberately NO `deleteMethod` here.
   *
   * It used to call `DELETE /payment/delete-payment/:id`, which DELETES A
   * PAYMENT — a financial transaction record. A buyer pressing "delete this
   * payment method" was asking the server to destroy a transaction, and the
   * only thing protecting the data was that the route is admin-only.
   *
   * Payment methods are the platform's settlement-rail catalogue (managed by
   * an administrator through `/payment/admin/methods`); a buyer has no
   * saved-instrument API to delete from, so the action was removed instead of
   * being pointed at a financial endpoint.

  /* ===== SELLER PAYMENT ACCOUNTS =====
   * Backend: GET  /payment/get-seller-accounts  ->  { success, accounts: [...] }
   *          POST /payment/seller/:sellerId/payment-accounts
   */
  async getSellerAccounts() {
    return this.getList('/payment/get-seller-accounts', 'accounts');
  }

  async addSellerAccount(sellerId, account) {
    return this.post(`/payment/seller/${sellerId}/payment-accounts`, account);
  }

  async getSellerPayments(sellerId) {
    return this.getList(`/payment/get-seller-payments/${sellerId}`, 'payments');
  }

  async getSellerAllocations(sellerId, params = {}) {
    return this.getList(`/payment/seller-allocations/${sellerId}`, 'allocations', params);
  }

  /* ===== BUYER PAYMENTS =====
   * Backend: GET /payment/get-user-payments/:buyerId -> { success, payments: [...] }
   *          GET /payment/get-payment/:paymentId
   */
  async getBuyerPayments(buyerId) {
    return this.getList(`/payment/get-user-payments/${buyerId}`, 'payments');
  }

  async getPaymentDetails(paymentId) {
    return this.get(`/payment/get-payment/${paymentId}`);
  }

  /* ===== ORDER PAYMENTS =====
   * Backend: POST /payment/create-payment
   *          GET  /payment/get-payment-by-order/:orderId
   */
  async createPayment(orderId, paymentMethod = 'COD', metadata = {}) {
    return this.post('/payment/create-payment', { orderId, paymentMethod, metadata });
  }

  async verifyChapaPayment(orderId, txRef) {
    return this.post('/payment/chapa/verify', { orderId, txRef });
  }

  async getPaymentByOrder(orderId) {
    return this.get(`/payment/get-payment-by-order/${orderId}`);
  }

  /* ===== PAYMENT LEDGER =====
   * Backend: GET /payment-ledger/:paymentId
   */
  async getPaymentLedger(paymentId) {
    return this.get(`/payment-ledger/${paymentId}`);
  }
}

export const paymentService = new PaymentService();
export default paymentService;
