/**
 * Product Filtering API Service
 * Handles product search and filtering for buyers
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';

class ProductService extends BaseService {
  /**
   * Filter products with advanced criteria
   * Backend: GET /product/public/all
   */
  async filterProducts(filters = {}, sortBy = 'relevance') {
    const sort = {
      relevance: '-createdAt',
      price_low: 'discountPrice',
      price_high: '-discountPrice',
      rating: '-ratings',
      newest: '-createdAt',
      popular: '-sold_out',
    }[sortBy] || '-createdAt';
    const params = {
      minPrice: filters.priceRange?.[0] || 0,
      maxPrice: filters.priceRange?.[1] || 100000,
      rating: filters.minRating || undefined,
      shopId: filters.seller || undefined,
      category: filters.categories?.[0] || undefined,
      sort,
    };

    // Remove undefined values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    return this.get('/product/public/all', params);
  }

  /**
   * Get product categories
   * Backend: GET /category
   */
  async getCategories() {
    return this.get('/category');
  }
}

export default new ProductService();
