/**
 * Wallet API Service
 * Handles all wallet-related API calls for seller portal
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class WalletService extends BaseService {
  /**
   * Get seller wallet with current balances
   * Backend: GET /wallet/:sellerId
   */
  async getWallet(sellerId) {
    return this.get(`/wallet/${sellerId}`);
  }

  /**
   * Get wallet dashboard summary (balances + recent transactions)
   * Backend: GET /wallet/:sellerId/dashboard
   */
  async getWalletDashboard(sellerId) {
    return this.get(`/wallet/${sellerId}/dashboard`);
  }

  /**
   * Get wallet transaction history with pagination and filtering
   * Backend: GET /wallet/:sellerId/transactions
   */
  async getTransactions(sellerId, options = {}) {
    const { 
      limit = 50, 
      offset = 0, 
      startDate, 
      endDate,
      type,
      status,
      direction,
      search
    } = options;
    
    const params = new URLSearchParams({
      limit: Math.min(Math.max(1, limit), 100),
      offset: Math.max(0, offset)
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (direction) params.append('direction', direction);
    if (search) params.append('search', search);

    return this.get(`/wallet/${sellerId}/transactions`, Object.fromEntries(params));
  }

  /**
   * Get single transaction detail
   * Backend: GET /wallet/:sellerId/transaction/:transactionId
   */
  async getTransaction(sellerId, transactionId) {
    return this.get(`/wallet/${sellerId}/transaction/${transactionId}`);
  }

  /**
   * Request payout from available balance
   * Backend: POST /payout/request
   */
  async requestPayout(sellerId, amount, payoutMethod, payoutDetails = {}) {
    return this.post('/payout/request', { sellerId, amount, payoutMethod, payoutDetails });
  }

  /**
   * Get seller's payout requests
   * Backend: GET /payout
   */
  async getPayouts(sellerId, options = {}) {
    const { limit = 50, offset = 0, status } = options;
    const params = new URLSearchParams({
      limit: Math.min(Math.max(1, limit), 100),
      offset: Math.max(0, offset)
    });
    if (status) params.append('status', status);

    return this.get(`/payout?${params.toString()}`);
  }

  /**
   * Get payout detail
   * Backend: GET /payout/:payoutId
   */
  async getPayout(payoutId) {
    return this.get(`/payout/${payoutId}`);
  }
}

export default new WalletService();
