import React from 'react';
import CategoryNav from '@/shared/categories/CategoryNav';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * CategoryRail — the desktop-only chip row, for pages that have no left
 * sidebar (Best Selling).
 *
 * Layout contract for the public catalog:
 *   - >=1024px: CategorySidebar (far-left) on Products/Shops, this chip row on
 *     pages without a sidebar.
 *   - <1024px:  CategorySheet (trigger + bottom sheet) everywhere — chips that
 *     wrap either bury the grid under 4 rows or scroll categories off-screen.
 */
const CategoryRail = ({
  basePath = '/products',
  type = 'product',
  allLabel = 'All',
  counts = null,
  className = '',
}) => {
  const { categories, loading } = useCatalogCategories({ type });

  if (!loading && categories.length === 0) return null;

  return (
    <div className={`hidden lg:block ${className}`}>
      <CategoryNav
        variant="rail"
        categories={categories}
        loading={loading}
        basePath={basePath}
        allLabel={allLabel}
        counts={counts}
      />
    </div>
  );
};

export default CategoryRail;
