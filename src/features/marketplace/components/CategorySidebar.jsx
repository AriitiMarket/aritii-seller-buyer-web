/**
 * CategorySidebar - Sidebar component for product categories
 * Displays category list for navigation
 */
import React from 'react'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'

const CategorySidebar = ({ 
  type = 'product', 
  title = 'Categories',
  allLabel = 'All',
  onCategorySelect 
}) => {
  const { categories, loading } = useCatalogCategories({ type });

  if (loading) {
    return <div className="space-y-2">Loading categories…</div>;
  }

  // Sticky pinning + viewport-height capping are handled by the rail column
  // in CatalogPageLayout (lg:sticky lg:top-[104px] = header 64px + sub-nav
  // 40px) — keep this list as plain content so the two never disagree.
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          key={category._id || category.id || category}
          onClick={() => onCategorySelect?.(category)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {category.icon && <>{category.icon}</>}
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {category.title || category.name || category}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CategorySidebar