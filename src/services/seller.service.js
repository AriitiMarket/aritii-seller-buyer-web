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

  // Seller returns
  async getSellerReturns(page = 1, limit = 20, status = null) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    
    const { data } = await api.get(`/return/seller/list?${params.toString()}`);
    return data;
  },

  async markReturnPickedUp(returnId) {
    const { data } = await api.post(`/return/${returnId}/picked-up`, {});
    return data.return;
  },

  async confirmReturnReceived(returnId) {
    const { data } = await api.post(`/return/${returnId}/returned`, {});
    return data.return;
  },

  // Product backorder/preorder
  async updateProductInventorySettings(productId, settings) {
    const { data } = await api.put(`/product/update-product/${productId}`, settings);
    return data.product;
  },

  // Get availability with backorder/preorder info
  async checkProductAvailability(productId) {
    const { data } = await api.get(`/order/availability/${productId}`);
    return data.availability;
  },
};
