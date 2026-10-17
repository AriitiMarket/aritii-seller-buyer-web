/**
 * CategorySheet - Sheet component for displaying categories
 * Displays a grid or list of categories
 */
import React from 'react'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'

const CategorySheet = ({ 
  type = 'product', 
  title = 'Categories',
  allLabel = 'All',
  className = '' 
}) => {
  const { categories, loading } = useCatalogCategories({ type });

  if (loading) {
    return <div className="space-y-2">Loading categories…</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {categories.map((category) => (
        <div
          key={category._id || category.id || category}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

export default CategorySheet