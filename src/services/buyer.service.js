import api from '@/services/api';

export const buyerService = {
  // Create return request
  async createReturnRequest(orderId, returnData) {
    const { data } = await api.post('/return', {
      orderId,
      ...returnData,
    });
    return data.return;
  },

  // Get buyer's returns
  async getMyReturns(page = 1, limit = 20) {
    const { data } = await api.get(`/return/list/mine?page=${page}&limit=${limit}`);
    return data;
  },

  // Get return details
  async getReturnDetails(returnId) {
    const { data } = await api.get(`/return/${returnId}`);
    return data.return;
  },

  // Cancel return request
  async cancelReturn(returnId) {
    const { data } = await api.post(`/return/${returnId}/cancel`, {});
    return data.return;
  },

  // Check product availability (including backorder/preorder)
  async checkProductAvailability(productId) {
    const { data } = await api.get(`/order/availability/${productId}`);
    return data.availability;
  },

  // Search products with zone filter
  async searchProducts(query, zoneId = null, cityId = null) {
    const params = new URLSearchParams({ q: query });
    if (zoneId) params.append('zoneId', zoneId);
    if (cityId) params.append('cityId', cityId);
    
    const { data } = await api.get(`/product/search?${params.toString()}`);
    return data;
  },
};
