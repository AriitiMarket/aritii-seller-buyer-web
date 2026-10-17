import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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

function FilterGroup({ title, children, defaultOpen = true, countBadge = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-bold text-[#131921] dark:text-white mb-2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {title}
          {countBadge && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#75d04b] text-white text-xs font-bold rounded-full">
              {countBadge}
            </span>
          )}
        </span>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>⌃</span>
      </button>
      {open && <div className="space-y-0 ml-0">{children}</div>}
    </div>
  );
}

function CategoryItem({ name, count, isActive, isSubcategory = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
        isActive
          ? 'bg-[#75d04b]/10 font-bold text-[#75d04b] border-l-4 border-[#75d04b]'
          : 'text-gray-600 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-100 dark:hover:bg-gray-800/50'
      } ${isSubcategory ? 'ml-2 text-xs font-normal border-none' : ''}`}
    >
      <span className="truncate">{name}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-xs font-medium ml-auto flex-shrink-0 ${
          isActive ? 'text-[#75d04b]' : 'text-gray-400'
        }`}>
          ({count})
        </span>
      )}
    </button>
  );
}

function ExpandableCategory({ category, isActive, onSelect, onSubcategorySelect }) {
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
              isActive={false}
              isSubcategory={true}
              onClick={() => onSubcategorySelect(category, sub)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CategorySidebar = ({ products = [], basePath = '/products', onCategorySelect = null }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active categories from URL
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  
  // Parse product categories with counts
  const categoriesWithCounts = useMemo(() => {
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
  }, [products]);

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
          title="Categories"
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
                All Categories
                {products.length > 0 && (
                  <span className={`text-xs font-medium ml-2 ${
                    !activeCategory ? 'text-[#75d04b]' : 'text-gray-400'
                  }`}>
                    ({products.length})
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
