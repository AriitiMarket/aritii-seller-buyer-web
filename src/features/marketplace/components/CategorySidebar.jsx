import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import FilterGroup from '@/features/marketplace/components/FilterGroup';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * CategorySidebar - Product category filter with expandable subcategories
 *
 * Connected directly to real backend catalog categories via `useCatalogCategories`
 * with live product counts and polished Aritii marketplace styling.
 */

function CategoryItem({ name, count, isActive, isSubcategory = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between group ${
        isActive
          ? 'font-bold text-[#131921] dark:text-white bg-[#75d04b]/20 border-l-3 border-[#75d04b] shadow-xs'
          : 'text-gray-700 dark:text-gray-300 hover:text-[#131921] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${isSubcategory ? 'ml-3 text-[11px] font-normal pl-2' : ''}`}
    >
      <span className="truncate pr-1">{name}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] ml-auto px-1.5 py-0.5 rounded-full flex-shrink-0 transition-colors ${
            isActive
              ? 'bg-[#75d04b] text-white font-bold'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ExpandableCategory({ category, isActive, activeSubcategory, onSelect, onSubcategorySelect }) {
  const [expanded, setExpanded] = useState(isActive);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        {hasSubcategories ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-[#75d04b] transition-colors flex-shrink-0 rounded"
            aria-label={expanded ? 'Collapse subcategories' : 'Expand subcategories'}
          >
            <span className={`text-[10px] transition-transform duration-200 ${expanded ? 'rotate-90 text-[#75d04b]' : ''}`}>
              ▶
            </span>
          </button>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
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
        <div className="space-y-0.5 ml-4 pl-2 border-l border-gray-200 dark:border-gray-700 my-1">
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
 *   - products        — items used to derive category counts.
 *   - counts          — optional pre-computed { name: count } map.
 *   - type            — catalog type: 'product' (default) | 'business' | 'shop'.
 *   - title           — heading of the filter group.
 *   - allLabel        — label of the "all" row.
 *   - basePath        — route the "all" row links back to.
 *   - onCategorySelect— callback on category click.
 */
const CategorySidebar = ({
  products = [],
  basePath = '/products',
  type = 'product',
  onCategorySelect = null,
  title = 'Categories',
  allLabel = 'All Categories',
  counts = null,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filterTerm, setFilterTerm] = useState('');

  // Fetch real categories from the backend commerce service
  const { categories: backendCategories = [], loading: categoriesLoading } = useCatalogCategories({ type });

  // Get active categories from URL
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';

  // Parse product categories with counts merged with real backend categories
  const categoriesWithCounts = useMemo(() => {
    // If pre-computed counts are passed (e.g. from Shops page by business type)
    if (counts) {
      return Object.entries(counts)
        .map(([name, count]) => ({ title: name, count, subcategories: [] }))
        .sort((a, b) => b.count - a.count);
    }

    // Map counts and subcategories from current products list
    const productCounts = {};
    const productSubcategories = {};
    (products || []).forEach((product) => {
      const cat = typeof product.category === 'object' ? product.category?.name || product.category?.title : product.category || 'Other';
      productCounts[cat] = (productCounts[cat] || 0) + 1;
      if (product.subcategory) {
        if (!productSubcategories[cat]) productSubcategories[cat] = new Set();
        productSubcategories[cat].add(product.subcategory);
      }
    });

    const items = [];
    const seenTitles = new Set();

    // 1. Add all official backend categories
    backendCategories.forEach((cat) => {
      const title = typeof cat === 'string' ? cat : (cat.title || cat.name || '');
      if (!title || seenTitles.has(title.toLowerCase())) return;
      seenTitles.add(title.toLowerCase());

      const subcats = Array.isArray(cat.subcategories)
        ? cat.subcategories.map((s) => (typeof s === 'string' ? s : s.title || s.name))
        : (productSubcategories[title] ? Array.from(productSubcategories[title]) : []);

      items.push({
        _id: cat._id || cat.id,
        title,
        count: productCounts[title] || 0,
        subcategories: subcats.filter(Boolean),
        slug: cat.slug,
      });
    });

    // 2. Include any extra categories found in products
    Object.keys(productCounts).forEach((catTitle) => {
      if (!seenTitles.has(catTitle.toLowerCase())) {
        seenTitles.add(catTitle.toLowerCase());
        items.push({
          title: catTitle,
          count: productCounts[catTitle],
          subcategories: productSubcategories[catTitle] ? Array.from(productSubcategories[catTitle]) : [],
        });
      }
    });

    // Sort by count (highest first), then alphabetically
    return items.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.title.localeCompare(b.title);
    });
  }, [backendCategories, products, counts]);

  const totalCount = counts
    ? Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0)
    : products.length;

  const selectedCount = activeCategory ? 1 : 0;

  // Filter categories by local in-sidebar search input
  const filteredCategories = useMemo(() => {
    if (!filterTerm.trim()) return categoriesWithCounts;
    const term = filterTerm.toLowerCase().trim();
    return categoriesWithCounts.filter((cat) =>
      cat.title.toLowerCase().includes(term) ||
      cat.subcategories?.some((sub) => sub.toLowerCase().includes(term))
    );
  }, [categoriesWithCounts, filterTerm]);

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

  // Clear all category filters
  const handleClearAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('category');
    next.delete('subcategory');
    setSearchParams(next, { replace: true });
    if (basePath && basePath !== window.location.pathname) {
      navigate(basePath, { replace: true });
    }
  };

  return (
    <aside className="w-full" aria-label="Product category filters">
      <div className="space-y-0">
        {/* Clear Filter Bar — shown when category is selected */}
        {selectedCount > 0 && (
          <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#131921] dark:text-white">
                Filtered by category
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#75d04b] hover:bg-[#5ac12f] rounded-md transition-colors"
                aria-label="Clear category filter"
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
          {/* Quick search if more than 5 categories */}
          {categoriesWithCounts.length > 5 && (
            <div className="relative mb-2">
              <AiOutlineSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#75d04b] focus:border-[#75d04b]"
              />
              {filterTerm && (
                <button
                  type="button"
                  onClick={() => setFilterTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <AiOutlineClose size={12} />
                </button>
              )}
            </div>
          )}

          {categoriesLoading && categoriesWithCounts.length === 0 ? (
            <div className="space-y-1.5 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-xs text-gray-400 py-2 italic text-center">
              No categories match "{filterTerm}"
            </div>
          ) : (
            <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
              {/* All Categories row */}
              {!filterTerm && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-between ${
                    !activeCategory
                      ? 'bg-[#75d04b] text-white shadow-xs font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-[#131921] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{allLabel}</span>
                  {totalCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        !activeCategory
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}
                    >
                      {totalCount}
                    </span>
                  )}
                </button>
              )}

              {/* Real Categories list */}
              {filteredCategories.map((category) => {
                const isActive = activeCategory === (category.title || category.name);
                return (
                  <ExpandableCategory
                    key={category._id || category.title || category.name}
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
