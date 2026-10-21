import api from './api';

const BASE_URL = '/wallet';

class WalletService {
  /**
   * Get seller wallet basic info
   * GET /wallet/:sellerId
   */
  async getWallet(sellerId) {
    try {
      const response = await api.get(`${BASE_URL}/${sellerId}`);
      return response.data?.data;
    } catch (error) {
      console.error('Get wallet error:', error);
      throw error;
    }
  }

  /**
   * Get wallet dashboard summary (balances + recent transactions)
   * GET /wallet/:sellerId/dashboard
   */
  async getWalletDashboard(sellerId) {
    try {
      const response = await api.get(`${BASE_URL}/${sellerId}/dashboard`);
      return response.data?.data;
    } catch (error) {
      console.error('Get wallet dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get transaction history with pagination and filtering
   * GET /wallet/:sellerId/transactions
   */
  async getTransactionHistory(sellerId, options = {}) {
    try {
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

      const response = await api.get(
        `${BASE_URL}/${sellerId}/transactions?${params.toString()}`
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  }

  /**
   * Get single transaction detail
   * GET /wallet/:sellerId/transaction/:transactionId
   */
  async getTransaction(sellerId, transactionId) {
    try {
      const response = await api.get(
        `${BASE_URL}/${sellerId}/transaction/${transactionId}`
      );
      return response.data?.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }

  /** List wallets for administrators. GET /wallet/admin/wallets */
  async getAllWallets(filters = {}) {
    const params = new URLSearchParams();
    for (const key of ['status', 'limit', 'offset', 'search']) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.set(key, String(filters[key]));
      }
    }
    const query = params.toString();
    const response = await api.get(`${BASE_URL}/admin/wallets${query ? `?${query}` : ''}`);
    return response.data;
  }

  /** Get platform financial summary. GET /wallet/admin/financial-summary */
  async getPlatformFinancialSummary() {
    const response = await api.get(`${BASE_URL}/admin/financial-summary`);
    return response.data?.data;
  }

  /** Suspend a seller wallet. POST /wallet/admin/wallets/:walletId/suspend */
  async suspendWallet(walletId, reason) {
    const response = await api.post(`${BASE_URL}/admin/wallets/${walletId}/suspend`, { reason });
    return response.data;
  }

  /** Create a manual admin adjustment. POST /wallet/admin/wallets/:walletId/adjustment */
  async createAdjustment(walletId, adjustment) {
    const response = await api.post(`${BASE_URL}/admin/wallets/${walletId}/adjustment`, {
      amount: Number(adjustment.amount),
      reason: adjustment.reason,
    });
    return response.data?.data;
  }

  /**
   * Request payout from available balance
   * POST /payout/request
   */
  async requestPayout(sellerId, amount, payoutMethod, payoutDetails = {}) {
    try {
      const response = await api.post('/payout/request', {
        sellerId,
        amount,
        payoutMethod,
        payoutDetails
      });
      return response.data?.data;
    } catch (error) {
      console.error('Request payout error:', error);
      throw error;
    }
  }

  /**
   * Get seller's payout requests
   * GET /payout
   */
  async getPayouts(sellerId, options = {}) {
    try {
      const { limit = 50, offset = 0, status } = options;
      const params = new URLSearchParams({
        limit: Math.min(Math.max(1, limit), 100),
        offset: Math.max(0, offset)
      });
      if (status) params.append('status', status);

      const response = await api.get(`/payout?${params.toString()}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Get payouts error:', error);
      throw error;
    }
  }

  /**
   * Get payout detail
   * GET /payout/:payoutId
   */
  async getPayout(payoutId) {
    try {
      const response = await api.get(`/payout/${payoutId}`);
      return response.data?.data;
    } catch (error) {
      console.error('Get payout error:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService();

// Export convenience functions (seller-only)
export const getWallet = (sellerId) => walletService.getWallet(sellerId);
export const getWalletDashboard = (sellerId) => walletService.getWalletDashboard(sellerId);
export const getTransactionHistory = (sellerId, options) =>
  walletService.getTransactionHistory(sellerId, options);
export const getTransaction = (sellerId, transactionId) =>
  walletService.getTransaction(sellerId, transactionId);
export const requestPayout = (sellerId, amount, payoutMethod, payoutDetails) =>
  walletService.requestPayout(sellerId, amount, payoutMethod, payoutDetails);
export const getPayouts = (sellerId, options) =>
  walletService.getPayouts(sellerId, options);
export const getPayout = (payoutId) =>
  walletService.getPayout(payoutId);
export const getAllWallets = (filters) => walletService.getAllWallets(filters);
export const getPlatformFinancialSummary = () => walletService.getPlatformFinancialSummary();
export const suspendWallet = (walletId, reason) => walletService.suspendWallet(walletId, reason);
export const createAdjustment = (walletId, adjustment) =>
  walletService.createAdjustment(walletId, adjustment);
