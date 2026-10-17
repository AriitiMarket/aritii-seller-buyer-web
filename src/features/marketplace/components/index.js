/**
 * Marketplace Feature Components
 *
 * Re-usable UI components for the public marketplace.
 * These components support a `variant` prop to differentiate
 * between public marketplace ("public") and buyer usage ("default").
 *
 * Import from '@/features/marketplace/components' to use marketplace-specific
 * versions, or use '@/shared/components' for the base components.
 */

// Re-export shared components with marketplace variant support
export { ProductCard } from '@/shared/components/ProductCard';
export { ShopCard } from '@/shared/components/ShopCard';

// Marketplace-specific layout/components
export { SectionHeader } from '@/shared/components/SectionHeader';
export { PageHeader } from '@/shared/components/PageHeader';
export { Breadcrumbs } from '@/shared/components/Breadcrumbs';
export { StatusBadge } from '@/shared/components/StatusBadge';
export { Footer } from '@/shared/components/Footer';

// Category navigation components (marketplace-specific implementations)
export { CategorySheet } from '@/features/marketplace/components/CategorySheet';
export { CategorySidebar } from '@/features/marketplace/components/CategorySidebar';
export { CategoryIcon } from '@/features/marketplace/components/CategoryIcon';
export { categoryHref } from '@/shared/categories';

// Other marketplace UI components
export { ShoppingSteps } from '@/features/marketplace/components/ShoppingSteps';
export { HeroSection } from '@/features/marketplace/components/HeroSection';
export { TrendingProducts } from '@/features/marketplace/components/TrendingProducts';
export { Breadcrumbs } from '@/shared/components/Breadcrumbs';
export { ExperiencePageHeader } from '@/features/marketplace/components/ExperiencePageHeader';export { SubNavBar } from '@/features/marketplace/components/SubNavBar';

// Catalog chrome
export { default as ProductListItem } from '@/features/marketplace/components/ProductListItem';
export { default as FilterSidebar } from '@/features/marketplace/components/FilterSidebar';
export { default as SubNavBar } from '@/features/marketplace/components/SubNavBar';