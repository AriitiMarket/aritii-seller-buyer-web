/**
 * Marketplace Feature Services
 *
 * API services specific to the public marketplace.
 * These services fetch public catalog data (products, shops, categories)
 * without requiring authentication - suitable for unauthenticated browsing.
 */

// Public API client (no auth headers)
export { publicApi } from '@/services/api';

// Product service - public endpoints
export { productService } from '@/services/product.service';

// Shop service - public endpoints
export { shopService } from '@/services/shop.service';

// Catalog categories
export { catalogService } from '@/services/catalog.service';

// Promotions/discounts
export { promotionService } from '@/services/promotion.service';

// Re-export shared services for convenience
export { publicContentService } from '@/public/services/publicContentService';