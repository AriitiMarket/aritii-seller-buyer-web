/**
 * API Services Index
 * Central export point for all API services
 * Import from this file to use any service in components/pages
 */

import api from "@/services/api";

export { authService } from "@/services/auth.service";
export { productService } from "@/services/product.service";
export { orderService } from "@/services/order.service";
export { reportService } from "@/services/order.service";
export { addressService } from "@/services/address.service";
export { shopService } from "@/services/shop.service";
export { sellerService } from "@/services/seller.service";
export { catalogService } from "@/services/catalog.service";
export { userService } from "@/services/user.service";
export { reviewService } from "@/services/review.service";
export { locationService } from "@/services/location.service";
export { deliveryService } from "@/services/delivery.service";
export { twoFactorService } from "@/services/twoFactor.service";

class PaymentService {
  async getActiveMethods() {
    const { data } = await api.get('/payment/get-active-methods');
    return data?.methods || [];
  }
  async getSellerAccounts() {
    const { data } = await api.get('/payment/get-seller-accounts');
    return data?.accounts || [];
  }
  async addSellerAccount(sellerId, payload) {
    const { data } = await api.post(`/payment/seller/${sellerId}/payment-accounts`, payload);
    return data?.account;
  }
  async getSellerPayments(sellerId) {
    const { data } = await api.get(`/payment/get-seller-payments/${sellerId}`);
    return data?.payments || [];
  }
  async getSellerAllocations(sellerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/payment/seller-allocations/${sellerId}${query ? '?' + query : ''}`);
    return data?.allocations || [];
  }
  async createPayment(orderId, paymentMethod = 'COD', metadata = {}) {
    const { data } = await api.post('/payment', { orderId, paymentMethod, metadata });
    return data?.payment || null;
  }
  async getPaymentByOrder(orderId) {
    const { data } = await api.get(`/payment/order/${orderId}`);
    return data?.payment || null;
  }
}
export const paymentService = new PaymentService();
export const { getSellerAllocations } = paymentService;

export { default as api } from "@/services/api";

/**
 * Usage in components:
 * 
 * import { productService, orderService, authService } from '@/services'
 * 
 * // Get all products
 * const products = await productService.getAll()
 * 
 * // Get buyer's orders
 * const orders = await orderService.getBuyerOrders(userId)
 * 
 * // Login user
 * const result = await authService.login(email, password)
 */
