import React, { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import CategoryIcon from '@/shared/categories/CategoryIcon';
import { MdFirstPage, MdLastPage, MdOutlineApps } from 'react-icons/md';

const STORAGE_KEY = 'catalog-sidebar-collapsed';

const readCollapsed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * CategorySidebar - the far-left category nav on the public catalog pages.
 *
 * Design mirrors the app's other sidebars (Buyer/Seller/Admin): it collapses
 * to a 68px icon rail with hover tooltips and remembers the choice in
 * localStorage. Two browse modes exist side by side so no viewport is left
 * without category navigation:
 *   - >=1024px: this sidebar (far-left)
 *   - <1024px:  CategorySheet — a trigger + bottom sheet above the grid
 *
 * @param {string} basePath  route the links filter ('/products' | '/shops')
 * @param {string} type      category type: 'product' | 'business' (shop cats)
 * @param {string} title     card heading
 * @param {string} allLabel  label of the "no filter" link
 * @param {Object} counts    optional { [title]: number } override per category
 */
const CategorySidebar = ({
  basePath = '/products',
  type = 'product',
  title = 'Shop by Category',
  allLabel = 'All Products',
  counts = null,
}) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const { categories, loading, error } = useCatalogCategories({ type });
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* private mode — state still applies for this session */
      }
      return next;
    });
  }, []);

  const rowClass = (isActive) =>
    `flex items-center rounded-lg w-full text-sm transition-colors ${
      collapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-3 py-2.5'
    } ${
      isActive
        ? 'bg-[#75d04b]/10 text-[#75d04b] font-semibold'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  const renderRow = (name, count) => {
    const href = `${basePath}?category=${encodeURIComponent(name)}`;
    const isActive = currentCategory?.toLowerCase() === name.toLowerCase();

    return (
      <Link
        key={name}
        to={href}
        className={`group relative ${rowClass(isActive)}`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={collapsed ? name : undefined}
        title={collapsed ? name : undefined}
      >
        <CategoryIcon title={name} size={collapsed ? 20 : 17} />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{name}</span>
            {count > 0 && (
              <span
                className={`text-[11px] font-semibold ${
                  isActive ? 'text-[#75d04b]' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {count}
              </span>
            )}
          </>
        )}
        {collapsed && (
          <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {name}
          </span>
        )}
      </Link>
    );
  };

  // Nothing to navigate yet — keep the page from reserving dead space, but do
  // show a skeleton while the first request is still in flight (a hard `null`
  // while loading made the grid jump sideways when categories arrived).
  if (error && categories.length === 0) return null;

  return (
    <aside
      className={`hidden lg:block flex-shrink-0 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* `top-20` clears the sticky 64px header; the cap keeps long category
          lists scrollable inside the viewport instead of pinning off-screen. */}
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pb-1">
        <nav
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-sm"
          aria-label={title}
        >
          {/* Card header — doubles as the collapse control */}
          <div
            className={`flex items-center gap-2 px-1 pb-2 mb-1 border-b border-gray-100 dark:border-gray-800 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            {!collapsed && (
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{title}</h3>
            )}
            <button
              type="button"
              onClick={toggleCollapse}
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Expand category sidebar' : 'Collapse category sidebar'}
              title={collapsed ? 'Expand' : 'Collapse'}
              className={`flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                collapsed ? 'w-9 h-9' : 'w-7 h-7 flex-shrink-0'
              }`}
            >
              {collapsed ? <MdLastPage size={18} /> : <MdFirstPage size={16} />}
            </button>
          </div>

          {/* "No filter" row */}
          <Link
            to={basePath}
            className={`group relative ${rowClass(!currentCategory)}`}
            aria-current={!currentCategory ? 'page' : undefined}
            aria-label={collapsed ? allLabel : undefined}
            title={collapsed ? allLabel : undefined}
          >
            <MdOutlineApps size={collapsed ? 20 : 17} />
            {!collapsed && <span className="flex-1 truncate">{allLabel}</span>}
            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {allLabel}
              </span>
            )}
          </Link>

          {/* Category rows / skeleton */}
          <div className="mt-1 space-y-0.5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                  aria-hidden="true"
                />
              ))
            ) : (
              categories.map((cat) => {
                const name = typeof cat === 'string' ? cat : cat?.title || cat?.name;
                if (!name) return null;
                const count = counts
                  ? counts[name] ?? 0
                  : cat?.productCount ?? cat?.count ?? 0;
                return renderRow(name, count);
              })
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default CategorySidebar;
