import api from "./api";

/**
 * Order Service
 * Handles order creation, retrieval, and status updates
 * Buyer can view their own orders, seller can view shop orders and update status
 */

export const orderService = {
  /**
   * Create a new order (buyer)
   * @param {Object} orderData - { cart, totalPrice, shippingAddress, user, paymentInfo }
   * @returns {Promise} - Created order(s)
   */
  async createOrder(orderData) {
    const { data } = await api.post("/order/create-order", orderData);
    return data.orders || data.order || null;
  },

  /**
   * Get all orders for a buyer
   * @param {string} userId - Buyer's user ID
   * @returns {Promise} - Array of orders
   */
  async getBuyerOrders(userId) {
    const { data } = await api.get(`/order/get-all-orders/user/${userId}`);
    return data.orders || [];
  },

  /**
   * Get all orders for a seller's shop
   * @param {string} sellerId - Seller's user ID
   * @returns {Promise} - Array of orders for seller's products
   */
  async getSellerOrders(sellerId) {
    const { data } = await api.get(
      `/order/get-all-orders/seller/${sellerId}`
    );
    return data.orders || [];
  },

  /**
   * Get detailed information about a specific order
   * @param {string} orderId - Order ID
   * @returns {Promise} - Order object with all details
   */
  async getOrderDetails(orderId) {
    const { data } = await api.get(`/order/order/${orderId}`);
    return data.order || null;
  },

  /**
   * Update order status (seller only)
   * Statuses: "Processing", "Shipped", "Delivered", "Cancelled"
   * @param {string} orderId - Order ID
   * @param {string} orderStatus - New status
   * @returns {Promise} - Updated order object
   */
  async updateOrderStatus(orderId, orderStatus) {
    const { data } = await api.put(
      `/order/update-order-status/${orderId}`,
      { orderStatus }
    );
    return data.order || null;
  },

  /**
   * Cancel an order (buyer only)
   * Only cancels orders that are not yet shipped
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason (optional)
   * @returns {Promise} - Updated order object
   */
  async cancelOrder(orderId, reason = 'Order cancelled by customer') {
    const { data } = await api.post(`/order/cancel/${orderId}`, { reason });
    return data.order || null;
  },
};

export default orderService;
