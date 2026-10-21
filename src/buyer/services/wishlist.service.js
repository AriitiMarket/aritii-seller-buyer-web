/**
 * Wishlist API Service
 * Handles wishlist operations
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class WishlistService extends BaseService {
  /**
   * Get user's wishlist
   * Backend: GET /wishlist
   */
  async getWishlist() {
    return this.get('/wishlist');
  }

  /**
   * Share a wishlist item with the browser's native share sheet or clipboard.
   */
  async shareWishlist(item, url) {
    const shareData = {
      title: item?.name || 'Aritii wishlist item',
      text: item?.name || 'Check out this item',
      url,
    };
    if (navigator.share) return navigator.share(shareData);
    return navigator.clipboard.writeText(`${shareData.text}: ${url}`);
  }

  /**
   * Move a wishlist item to cart through the existing cart endpoint.
   */
  async moveToCart(productId, quantity = 1, item = {}) {
    return this.post('/cart', {
      productId,
      quantity,
      name: item.name,
      price: item.currentPrice ?? item.price,
      image: item.image,
    });
  }

  /**
   * Remove item from wishlist
   * Backend: DELETE /wishlist/:productId
   */
  async removeFromWishlist(productId) {
    return this.delete(`/wishlist/${productId}`);
  }

  /**
   * Add item to wishlist
   * Backend: POST /wishlist
   */
  async addToWishlist(productId) {
    return this.post('/wishlist', { productId });
  }
}

export default new WishlistService();
