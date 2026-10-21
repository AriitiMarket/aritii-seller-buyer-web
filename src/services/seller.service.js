import api from '@/services/api';

export const sellerService = {
  // Bulk product operations
  async bulkProductUpdate(productIds, action) {
    const { data } = await api.post('/product/bulk', {
      productIds,
      action,
    });
    return data;
  },

  // Seller returns dashboard (FIX #15)
  // Backend: GET /returns/shop/:shopId/dashboard
  async getSellerReturns(shopId) {
    if (!shopId) throw new Error('Shop ID is required');
    const { data } = await api.get(`/return/shop/${shopId}/dashboard`);
    return data;
  },

  // Seller metrics / KPIs (FIX #13)
  // Backend: GET /metrics/shop/:shopId?period=daily|weekly|monthly
  async getSellerMetrics(shopId, params = {}) {
    if (!shopId) throw new Error('Shop ID is required');
    const { data } = await api.get(`/metrics/shop/${shopId}`, { params });
    return data;
  },

  async markReturnPickedUp(returnId) {
    const { data } = await api.post(`/return/${returnId}/picked-up`);
    return data;
  },

  async confirmReturnReceived(returnId) {
    const { data } = await api.post(`/return/${returnId}/received`);
    return data;
  },

  // Product backorder/preorder
  async updateProductInventorySettings(productId, settings) {
    const { data } = await api.put(`/product/update-product/${productId}`, settings);
    return data.product;
  },

  // Get availability with backorder/preorder info
  async checkProductAvailability(productId) {
    const { data } = await api.get(`/order/product/${productId}/available-stock`);
    return data.availability;
  },

  // Seller application
  async getMyApplication() {
    const { data } = await api.get('/seller-application/me');
    return data.application;
  },
};
