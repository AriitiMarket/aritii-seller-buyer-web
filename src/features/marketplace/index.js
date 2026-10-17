/**
 * Marketplace Feature Barrel
 *
 * This feature encapsulates the public marketplace functionality:
 * - Product listing and browsing
 * - Shop discovery and details
 * - Category navigation
 * - Public catalog services and hooks
 *
 * Import from '@/features/marketplace' to use the complete marketplace feature.
 */

export { useProducts } from '@/features/marketplace/hooks/useProducts';
export { useShops } from '@/features/marketplace/hooks/useShops';
export { useCatalogCategories } from '@/features/marketplace/hooks/useCatalogCategories';
export { useFilteredProducts } from '@/features/marketplace/hooks/useProducts';
export { useAuth } from '@/features/marketplace/hooks/useAuth';

export {
  ProductCard,
  ShopCard,
  SectionHeader,
  PageHeader,
  Breadcrumbs,
  StatusBadge,
  Footer,
} from '@/features/marketplace/components';

export {
  ProductsPage,
  ShopsPage,
  CategoriesPage,
  MarketplaceLandingPage,
} from '@/features/marketplace/pages';

export {
  CategorySheet,
  CategorySidebar,
  CategoryIcon,
  categoryHref,
} from '@/features/marketplace/components';

export { default as CategoryNav } from '@/shared/categories/CategoryNav';

export * from '@/features/marketplace/services';