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
  /* ===== PAYMENT METHODS (BUYER) ===== */

  /**
   * Fetch all active payment methods available for buyers during checkout.
   * Backend: GET /payment/get-active-methods -> { success, methods: [...] }
   * @returns {Promise<Array<object>>} List of active payment methods
   */
  async getActiveMethods() {
    return this.getList('/payment/get-active-methods', 'methods');
  }

  /* ===== PAYMENT METHODS (ADMIN catalogue) ===== */

  /**
   * Fetch all platform payment methods catalogue (for administrative management).
   * Backend: GET /payment/admin/methods -> { success, methods: [...] }
   * @returns {Promise<Array<object>>} Full list of payment methods
   */
  async getAllMethods() {
    return this.getList('/payment/admin/methods', 'methods');
  }

  /**
   * Create and register a new payment method in the platform catalogue.
   * Backend: POST /payment/admin/methods
   * @param {object} method - Payment method definition and configuration
   * @returns {Promise<object>} Created payment method object
   */
  async saveMethod(method) {
    return this.post('/payment/admin/methods', method);
  }

  /**
   * Update settings or availability of an existing payment method.
   * Backend: PUT /payment/admin/methods/:methodId
   * @param {string} methodId - Identifier of the payment method to update
   * @param {object} updates - Modified fields and configurations
   * @returns {Promise<object>} Updated payment method object
   */
  async updateMethod(methodId, updates) {
    return this.put(`/payment/admin/methods/${methodId}`, updates);
  }

  /* Note on deleteMethod:
   * There is deliberately NO `deleteMethod` here.
   * It previously called DELETE /payment/delete-payment/:id which deletes a transaction.
   * Payment methods are platform rails managed by admins, not deletable records by buyers.
   */

  /* ===== SELLER PAYMENT ACCOUNTS ===== */

  /**
   * Retrieve payout accounts configured for the currently authenticated seller.
   * Backend: GET /payment/get-seller-accounts -> { success, accounts: [...] }
   * @returns {Promise<Array<object>>} List of seller payout accounts
   */
  async getSellerAccounts() {
    return this.getList('/payment/get-seller-accounts', 'accounts');
  }

  /**
   * Register a new payout account for a seller.
   * Backend: POST /payment/seller/:sellerId/payment-accounts
   * @param {string} sellerId - Seller unique identifier
   * @param {object} account - Bank or mobile money account details
   * @returns {Promise<object>} Created account details
   */
  async addSellerAccount(sellerId, account) {
    return this.post(`/payment/seller/${sellerId}/payment-accounts`, account);
  }

  /**
   * Retrieve transaction and payout history for a specific seller.
   * Backend: GET /payment/get-seller-payments/:sellerId -> { success, payments: [...] }
   * @param {string} sellerId - Seller unique identifier
   * @returns {Promise<Array<object>>} List of payment records for the seller
   */
  async getSellerPayments(sellerId) {
    return this.getList(`/payment/get-seller-payments/${sellerId}`, 'payments');
  }

  /**
   * Fetch revenue allocations and split breakdowns for a seller.
   * Backend: GET /payment/seller-allocations/:sellerId
   * @param {string} sellerId - Seller unique identifier
   * @param {object} [params={}] - Optional pagination and date filters
   * @returns {Promise<Array<object>>} List of allocation entries
   */
  async getSellerAllocations(sellerId, params = {}) {
    return this.getList(`/payment/seller-allocations/${sellerId}`, 'allocations', params);
  }

  /* ===== BUYER PAYMENTS ===== */

  /**
   * Retrieve all payment transactions executed by a buyer.
   * Backend: GET /payment/get-user-payments/:buyerId -> { success, payments: [...] }
   * @param {string} buyerId - Buyer unique identifier
   * @returns {Promise<Array<object>>} List of buyer transactions
   */
  async getBuyerPayments(buyerId) {
    return this.getList(`/payment/get-user-payments/${buyerId}`, 'payments');
  }

  /**
   * Fetch comprehensive payment details for a specific payment ID.
   * Backend: GET /payment/get-payment/:paymentId
   * @param {string} paymentId - Payment transaction identifier
   * @returns {Promise<object>} Payment transaction details
   */
  async getPaymentDetails(paymentId) {
    return this.get(`/payment/get-payment/${paymentId}`);
  }

  /* ===== ORDER PAYMENTS ===== */

  /**
   * Initialize or create a payment record for an order (e.g. COD, Chapa, Telebirr).
   * Backend: POST /payment/create-payment
   * @param {string} orderId - Associated order ID
   * @param {string} [paymentMethod='COD'] - Selected payment rail or provider
   * @param {object} [metadata={}] - Optional contextual metadata (e.g., return URLs)
   * @returns {Promise<object>} Payment initialization response
   */
  async createPayment(orderId, paymentMethod = 'COD', metadata = {}) {
    return this.post('/payment/create-payment', { orderId, paymentMethod, metadata });
  }

  /**
   * Verify an online payment transaction with Chapa payment gateway.
   * Backend: POST /payment/chapa/verify
   * @param {string} orderId - Associated order ID
   * @param {string} txRef - Transaction reference returned from Chapa
   * @returns {Promise<object>} Verification result and confirmation
   */
  async verifyChapaPayment(orderId, txRef) {
    return this.post('/payment/chapa/verify', { orderId, txRef });
  }

  /**
   * Retrieve the payment information associated with a particular order.
   * Backend: GET /payment/get-payment-by-order/:orderId
   * @param {string} orderId - Order identifier
   * @returns {Promise<object>} Associated payment record
   */
  async getPaymentByOrder(orderId) {
    return this.get(`/payment/get-payment-by-order/${orderId}`);
  }

  /* ===== PAYMENT LEDGER ===== */

  /**
   * Retrieve the immutable ledger audit trail for a payment transaction.
   * Backend: GET /payment-ledger/:paymentId
   * @param {string} paymentId - Payment identifier
   * @returns {Promise<object>} Ledger entry details
   */
  async getPaymentLedger(paymentId) {
    return this.get(`/payment-ledger/${paymentId}`);
  }
}

export const paymentService = new PaymentService();
export default paymentService;
