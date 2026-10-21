import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterGroup from '@/features/marketplace/components/FilterGroup';

/**
 * CategorySidebar - Product category filter with expandable subcategories
 *
 * Features:
 * - Show main categories with product counts
 * - Expandable subcategories
 * - Active category highlight (#75d04b green)
 * - Mobile: Drawer, not visible by default
 * - Desktop: Fixed left sidebar
 * - Multiple category selection with counter
 * - Clear all button
 *
 * Aritii branding:
 * - #75d04b green highlights
 * - #131921 dark headers
 * - Consistent styling with Categories and Shops pages
 */

function CategoryItem({ name, count, isActive, isSubcategory = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between group ${
        isActive
          ? 'font-bold text-[#e77600] bg-orange-50/50'
          : 'text-[#0f1111] dark:text-gray-300 hover:text-[#e77600]'
      } ${isSubcategory ? 'ml-3 text-[11px] font-normal' : ''}`}
    >
      <span className="truncate">{name}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] ml-auto flex-shrink-0 ${
          isActive ? 'text-[#e77600] font-semibold' : 'text-gray-400'
        }`}>
          ({count})
        </span>
      )}
    </button>
  );
}

function ExpandableCategory({ category, isActive, activeSubcategory, onSelect, onSubcategorySelect }) {
  const [expanded, setExpanded] = useState(isActive);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        {hasSubcategories && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-[#75d04b] transition-colors flex-shrink-0"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <span className={`text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </button>
        )}
        <div className={hasSubcategories ? '' : 'ml-5'} style={{ flex: 1 }}>
          <CategoryItem
            name={category.title || category.name}
            count={category.count}
            isActive={isActive}
            onClick={() => onSelect(category)}
          />
        </div>
      </div>

      {/* Subcategories — expanded state */}
      {expanded && hasSubcategories && (
        <div className="space-y-1 ml-2">
          {category.subcategories.map((sub, idx) => (
            <CategoryItem
              key={idx}
              name={sub}
              count={undefined}
              isActive={activeSubcategory === sub}
              isSubcategory={true}
              onClick={() => onSubcategorySelect(category, sub)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * CategorySidebar props:
 *   - products    — items used to derive the category list and its counts.
 *   - counts      — optional pre-computed { name: count } map. When provided it
 *                   wins over `products` (used by /shops, which groups by the
 *                   shop's business type instead of a product category).
 *   - title       — heading of the filter group.
 *   - allLabel    — label of the "clear filter" row.
 *   - basePath    — route the "all" row links back to.
 */
const CategorySidebar = ({
  products = [],
  basePath = '/products',
  onCategorySelect = null,
  title = 'Categories',
  allLabel = 'All Categories',
  counts = null,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get active categories from URL
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';

  // Parse product categories with counts
  const categoriesWithCounts = useMemo(() => {
    // Pre-computed counts win (e.g. /shops groups by business type).
    if (counts) {
      return Object.entries(counts)
        .map(([name, count]) => ({ title: name, count, subcategories: [] }))
        .sort((a, b) => b.count - a.count);
    }

    if (!products || products.length === 0) {
      return [];
    }

    // Group products by category and count
    const grouped = {};
    products.forEach(product => {
      const cat = product.category || 'Other';
      if (!grouped[cat]) {
        grouped[cat] = {
          title: cat,
          count: 0,
          subcategories: new Set(),
          products: [],
        };
      }
      grouped[cat].count++;
      grouped[cat].products.push(product);

      // Collect subcategories if available
      if (product.subcategory) {
        grouped[cat].subcategories.add(product.subcategory);
      }
    });

    // Convert to array and sort by count (descending)
    return Object.values(grouped)
      .map(cat => ({
        ...cat,
        subcategories: Array.from(cat.subcategories).sort(),
      }))
      .sort((a, b) => b.count - a.count);
  }, [products, counts]);

  const totalCount = counts
    ? Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0)
    : products.length;

  // Count selected categories
  const selectedCount = activeCategory ? 1 : 0;

  // Handle category selection
  const handleSelectCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    const catName = category.title || category.name;
    
    if (activeCategory === catName) {
      next.delete('category');
      next.delete('subcategory');
    } else {
      next.set('category', catName);
      next.delete('subcategory');
    }
    
    setSearchParams(next, { replace: true });
    onCategorySelect?.(catName);
  };

  // Handle subcategory selection
  const handleSelectSubcategory = (category, subcategory) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', category.title || category.name);
    next.set('subcategory', subcategory);
    setSearchParams(next, { replace: true });
    onCategorySelect?.(subcategory);
  };

  // Clear all filters
  const handleClearAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('category');
    next.delete('subcategory');
    setSearchParams(next, { replace: true });
    // Leaving the page the sidebar belongs to (e.g. a "shop type" filter
    // rendered outside /shops) must return the user to the base route.
    if (basePath && basePath !== window.location.pathname) {
      navigate(basePath, { replace: true });
    }
  };

  return (
    <aside className="w-full" aria-label="Product category filters">
      <div className="space-y-0">
        {/* Clear All Button — shown when filters are active */}
        {selectedCount > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2 mb-0">
              <span className="text-xs font-bold text-[#131921] dark:text-white">
                {selectedCount} categor{selectedCount === 1 ? 'y' : 'ies'} selected
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white bg-[#75d04b] hover:bg-[#5ac12f] rounded-lg transition-colors min-h-[32px]"
                aria-label="Clear all category filters"
              >
                ✕ Clear
              </button>
            </div>
          </div>
        )}

        {/* Categories Filter Group */}
        <FilterGroup
          title={title}
          defaultOpen={true}
          countBadge={categoriesWithCounts.length}
        >
          {categoriesWithCounts.length === 0 ? (
            <div className="text-xs text-gray-400 py-2 italic">
              No categories available
            </div>
          ) : (
            <div className="space-y-1">
              {/* All Categories link */}
              <button
                type="button"
                onClick={handleClearAll}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  !activeCategory
                    ? 'bg-[#75d04b]/10 font-bold text-[#75d04b] border-l-4 border-[#75d04b]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {allLabel}
                {totalCount > 0 && (
                  <span className={`text-xs font-medium ml-2 ${
                    !activeCategory ? 'text-[#75d04b]' : 'text-gray-400'
                  }`}>
                    ({totalCount})
                  </span>
                )}
              </button>

              {/* Main categories with subcategories */}
              {categoriesWithCounts.map((category) => {
                const isActive = activeCategory === (category.title || category.name);
                return (
                  <ExpandableCategory
                    key={category.title || category.name}
                    category={category}
                    isActive={isActive}
                    activeSubcategory={activeSubcategory}
                    onSelect={handleSelectCategory}
                    onSubcategorySelect={handleSelectSubcategory}
                  />
                );
              })}
            </div>
          )}
        </FilterGroup>
      </div>
    </aside>
  );
};

export default CategorySidebar;
