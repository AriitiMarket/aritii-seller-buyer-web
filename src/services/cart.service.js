import api from '@/services/api';

class CartService {
  /**
   * Get current user's cart with all items
   * @throws {Error} Network or API error
   * @returns {Promise<{items: Array, total: number, subtotal: number}>}
   */
  async getCart() {
    try {
      const { data } = await api.get('/cart');
      return data?.cart || { items: [], total: 0, subtotal: 0 };
    } catch (err) {
      if (err.response?.status === 404) {
        return { items: [], total: 0, subtotal: 0 };
      }
      throw new Error(`Failed to fetch cart: ${err.message}`);
    }
  }

  /**
   * Add product to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} options - Optional parameters
   * @returns {Promise<{item: Object}>}
   */
  async addItem(productId, quantity = 1, options = {}) {
    if (!productId) throw new Error('Product ID is required');
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a positive integer');
    }

    try {
      const { data } = await api.post('/cart', {
        productId,
        quantity,
        ...options, // shopId, variantId, etc
      });

      if (!data.success) throw new Error(data.message || 'Failed to add item');
      return data.item || data.cart;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      throw new Error(`Add to cart failed: ${msg}`);
    }
  }

  /**
   * Update cart item quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<{item: Object}>}
   */
  async updateItem(itemId, quantity) {
    if (!itemId) throw new Error('Item ID is required');
    if (quantity < 0 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a non-negative integer');
    }

    try {
      // Quantity 0 = remove
      if (quantity === 0) {
        return this.removeItem(itemId);
      }

      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      if (!data.success) throw new Error(data.message || 'Failed to update item');
      return data.item || data.cart;
    } catch (err) {
      throw new Error(`Update cart failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   * @returns {Promise<{cart: Object}>}
   */
  async removeItem(itemId) {
    if (!itemId) throw new Error('Item ID is required');

    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      if (!data.success) throw new Error(data.message || 'Failed to remove item');
      return data.cart || { items: [], total: 0 };
    } catch (err) {
      throw new Error(`Remove item failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<{success: boolean}>}
   */
  async clearCart() {
    try {
      const { data } = await api.post('/cart/clear');
      if (!data.success) throw new Error(data.message || 'Failed to clear cart');
      return { success: true };
    } catch (err) {
      throw new Error(`Clear cart failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Checkout cart - convert to order
   * @param {Object} checkoutData - Checkout information
   * @returns {Promise<{orderId: string, order: Object}>}
   */
  async checkout(checkoutData) {
    if (!checkoutData) throw new Error('Checkout data is required');

    try {
      const { data } = await api.post('/cart/checkout', checkoutData);
      if (!data.success) throw new Error(data.message || 'Checkout failed');
      return data.order || data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      throw new Error(`Checkout failed: ${msg}`);
    }
  }

  /**
   * Add coupon/promo code to cart
   * @param {string} code - Promo code
   * @returns {Promise<{discount: number, cart: Object}>}
   */
  async applyCoupon(code) {
    if (!code || typeof code !== 'string') throw new Error('Valid promo code is required');

    try {
      const { data } = await api.post('/cart/coupon', { code: code.trim() });
      if (!data.success) throw new Error(data.message || 'Invalid coupon code');
      return data;
    } catch (err) {
      throw new Error(`Coupon error: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Remove coupon/promo code
   * @returns {Promise<{cart: Object}>}
   */
  async removeCoupon() {
    try {
      const { data } = await api.delete('/cart/coupon');
      if (!data.success) throw new Error(data.message || 'Failed to remove coupon');
      return data.cart || {};
    } catch (err) {
      throw new Error(`Remove coupon failed: ${err.response?.data?.message || err.message}`);
    }
  }

  /**
   * Validate cart before checkout
   * @returns {Promise<{valid: boolean, errors: Array}>}
   */
  async validateCart() {
    try {
      const { data } = await api.get('/cart/validate');
      return {
        valid: data?.valid !== false,
        errors: data?.errors || [],
      };
    } catch (err) {
      return {
        valid: false,
        errors: [err.response?.data?.message || 'Validation failed'],
      };
    }
  }
}

export const cartService = new CartService();
