import api from "@/services/api";

/**
 * Order Service
 * Handles order creation, retrieval, and status updates
 * Buyer can view their own orders, seller can view shop orders and update status
 */

export const orderService = {
  /**
   * ORDER ↔ DELIVERY bridge: the shipment linked to one order.
   *
   * Authorization follows the ORDER's ownership (the buyer, the owning seller
   * or an admin), so this is safe to call from every role's screen. A 404 means
   * the order has no shipment YET (nothing was handed to delivery), which is a
   * normal state — it is reported as `linked: false`, never thrown, so a screen
   * can render an honest "not handed to delivery yet" panel.
   *
   * @param {string} orderId
   * @returns {Promise<{delivery: object|null, linked: boolean}>}
   */
  async getOrderDelivery(orderId) {
    try {
      const { data } = await api.get(`/order/${orderId}/delivery`);
      return { delivery: data?.delivery || null, linked: Boolean(data?.delivery) };
    } catch (error) {
      if (error?.response?.status === 404) return { delivery: null, linked: false };
      throw error;
    }
  },

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
  async getSellerOrders(_sellerId) {
    // Seller pages should use the identity verified from the access token.
    // `sellerId` is retained for call-site compatibility; profile/shop ids can
    // differ from the authenticated identity and trigger an avoidable 403.
    const { data } = await api.get('/order/get-all-orders/seller/me');
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
   * Update order status (seller only).
   * Canonical statuses: "Processing" -> "Confirmed" (accept) -> "Shipped" ->
   * "In Transit" -> "Delivered", or "Cancelled".
   * The Commerce Service reads `status` from the body
   * (updateOrderStatus(orderId, { status })) — sending `orderStatus` was a
   * silent no-op: 200 OK but the order never changed.
   * @param {string} orderId - Order ID
   * @param {string|Object} statusOrPayload - New status, or { status }
   * @returns {Promise} - Updated order object
   */
  async updateOrderStatus(orderId, statusOrPayload) {
    const payload = typeof statusOrPayload === 'object' && statusOrPayload !== null
      ? { status: statusOrPayload.status || statusOrPayload.orderStatus }
      : { status: statusOrPayload };
    const { data } = await api.patch(
      `/order/${orderId}/status`,
      payload
    );
    return data.order || null;
  },

  /**
   * Business/Seller: confirm that a refund has been successfully processed for the shop.
   * Backend: PUT /order/order-refund-success/:orderId
   * @param {string} orderId - Order unique identifier
   * @param {Object} [payload={}] - Refund confirmation payload
   * @returns {Promise<object>} Updated order details
   */
  async approveRefund(orderId, payload = {}) {
    const { data } = await api.put(`/order/order-refund-success/${orderId}`, payload);
    return data?.order || data;
  },

  /**
   * Request a refund for an order (buyer initiated).
   * Backend: PUT /order/refund-order/:orderId
   * @param {string} orderId - Order unique identifier
   * @param {Object} [payload={}] - Refund request details (reason, status)
   * @returns {Promise<object>} Refund request result
   */
  async refundOrder(orderId, payload = {}) {
    const { data } = await api.put(`/order/refund-order/${orderId}`, payload);
    return data?.order || data;
  },

  /**
   * Cancel an order (buyer only).
   * Only allows cancellation of orders that have not yet been shipped.
   * Backend: POST /order/:orderId/cancel
   * @param {string} orderId - Order unique identifier
   * @param {string} [reason='Order cancelled by customer'] - Cancellation reason
   * @returns {Promise<object|null>} Cancelled order record
   */
  async cancelOrder(orderId, reason = 'Order cancelled by customer') {
    const { data } = await api.post(`/order/${orderId}/cancel`, { reason });
    return data.order || null;
  },

  /**
   * Confirm receipt of a delivered order (buyer action upon receiving items).
   * Backend: POST /order/:orderId/confirm-receipt
   * @param {string} orderId - Order unique identifier
   * @returns {Promise<object|null>} Updated order record with completed delivery status
   */
  async confirmReceipt(orderId) {
    const { data } = await api.post(`/order/${orderId}/confirm-receipt`);
    return data.order || null;
  },
};

/**
 * Seller/business reports.
 *
 * All report endpoints are scoped to the authenticated seller's own shop(s)
 * by the backend; the frontend never sends a seller/shop id that the backend
 * would trust for data access.
 */
export const reportService = {
  /**
   * Fetch the seller's own business report for a reporting period.
   * @param {string} startDate - ISO date (inclusive)
   * @param {string} endDate - ISO date (inclusive)
   * @returns {Promise<{data: object}>} grossSales, refunds, netSales, orders, bestSellers, …
   */
  async getSellerStats(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const { data } = await api.get('/analytics/seller/stats', { params });
    return data?.data || data || {};
  },
};

export default orderService;
