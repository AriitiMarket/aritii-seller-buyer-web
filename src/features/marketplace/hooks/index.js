/**
 * Marketplace Feature Hooks
 *
 * These hooks provide marketplace-specific data fetching
 * and can be used by both the marketplace feature and other domains
 * that need public catalog data.
 */

// Product hooks (canonical implementation lives in @/shared/hooks/useProducts)
export { useProducts, useFilteredProducts } from '@/features/marketplace/hooks/useProducts';

// Shop hooks (canonical implementation lives in @/shared/hooks/useShops)
export { useShops, filterShops } from '@/features/marketplace/hooks/useShops';

// Category hooks (canonical implementation lives in @/shared/hooks/useCatalogCategories)
export { useCatalogCategories } from '@/features/marketplace/hooks/useCatalogCategories';

// Auth hook
export { useAuth } from '@/features/marketplace/hooks/useAuth';