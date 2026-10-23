/**
 * Marketplace Categories Page
 *
 * Canonical route: /categories
 *
 * Fully dynamic category directory:
 * - Uses real categories fetched directly from backend (GET /category/active/product)
 * - Real-time category search filter
 * - High-visibility Aritii marketplace & delivery branding
 * - Delivery logistics guarantee badges
 * - Responsive desktop sidebar & mobile drawer
 */
import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import CategoryIcon from '@/features/marketplace/components/CategoryIcon';
import {
  MdSearch,
  MdLocalShipping,
  MdStorefront,
  MdSecurity,
  MdArrowForward,
  MdChevronRight,
  MdClose,
} from 'react-icons/md';
import './Categories.css';

const CategoriesPage = () => {
  const { categories: rawCategories = [], loading, error } = useCatalogCategories({ type: 'product' });
  const [searchParams] = useSearchParams();
  const active = searchParams.get('category') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize real backend categories
  const categories = useMemo(() => {
    return rawCategories.map((cat) => {
      const title = cat.title || cat.name || (typeof cat === 'string' ? cat : 'Category');
      return {
        id: cat._id || cat.id || cat.slug || title,
        title,
        slug: cat.slug || '',
        description: cat.description || '',
        count: cat.productCount ?? cat.count ?? 0,
        image: cat.categoryImage || cat.image || null,
        subcategories: cat.subcategories || [],
      };
    });
  }, [rawCategories]);

  // Filtered categories based on user search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
    );
  }, [categories, searchTerm]);

  return (
    <>
      <div className="categories-page-container">
        {/* Marketplace & Logistics Category Banner */}
        <section className="bg-gradient-to-r from-[#131921] via-[#1a222d] to-[#20305c] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#232f3e]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#75d04b]/20 text-[#75d04b] text-xs font-bold uppercase tracking-wider">
                    Marketplace & Logistics Directory
                  </span>
                  <span className="text-xs text-gray-400">All 11 Regions Covered</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Explore Categories & Local Shops
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Shop verified artisans and merchants across Ethiopia with tracked door-to-door delivery, escrow buyer protection, and multi-zone fulfillment.
                </p>

                {/* Logistics Key Signals */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <MdLocalShipping size={16} className="text-[#00A8E1]" />
                    <span>Fast Zone Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MdStorefront size={16} className="text-[#febd69]" />
                    <span>Verified Local Vendors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MdSecurity size={16} className="text-[#75d04b]" />
                    <span>Escrow Protected</span>
                  </div>
                </div>
              </div>

              {/* In-page category search */}
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="relative">
                  <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories & items…"
                    className="w-full pl-9 pr-8 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#febd69] focus:ring-1 focus:ring-[#febd69]"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      aria-label="Clear search"
                    >
                      <MdClose size={16} />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <p className="text-[11px] text-gray-400 mt-1.5 px-1">
                    Showing {filteredCategories.length} matching categor{filteredCategories.length === 1 ? 'y' : 'ies'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile menu trigger */}
        <div className="categories-mobile-trigger">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="categories-mobile-button"
            aria-haspopup="dialog"
            aria-expanded={sidebarOpen}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">☰</span>
              <span>Browse All Categories</span>
            </span>
            <span className="badge-small">{categories.length}</span>
          </button>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="categories-mobile-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="categories-mobile-drawer">
            <div className="drawer-header">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded bg-[#75d04b]/20 text-[#75d04b] flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <h2 className="text-sm font-bold text-white">All Categories</h2>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="drawer-close"
                aria-label="Close categories"
              >
                ✕
              </button>
            </div>

            <div className="drawer-content">
              <div className="categories-section">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.title)}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`category-item ${active.toLowerCase() === cat.title.toLowerCase() ? 'active' : ''}`}
                    >
                      <CategoryIcon title={cat.title} size={16} />
                      <span className="truncate flex-1">{cat.title}</span>
                      {cat.count > 0 && <span className="item-count">{cat.count}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="drawer-done-btn"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Main content wrapper */}
        <div className="categories-content-wrapper">
          {/* Left sidebar — desktop only */}
          <aside className="categories-sidebar">
            <div className="sidebar-section">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="sidebar-section-title">All Categories</h3>
                <span className="text-[11px] font-bold text-[#75d04b] bg-[#75d04b]/10 px-2 py-0.5 rounded-full">
                  {categories.length} total
                </span>
              </div>

              {/* Real categories list directly from backend */}
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = active.toLowerCase() === cat.title.toLowerCase();
                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.title)}`}
                      className={`category-item ${isActive ? 'active' : ''}`}
                    >
                      <CategoryIcon title={cat.title} size={16} />
                      <span className="truncate flex-1 font-medium">{cat.title}</span>
                      {cat.count > 0 && <span className="item-count">{cat.count}</span>}
                      <MdChevronRight size={14} className="text-gray-400" />
                    </Link>
                  );
                })}
              </div>

              {/* Sidebar Logistics Guarantee Card */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#131921] to-[#1f2b3e] text-white border border-[#232f3e] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🚚</span>
                  <span className="text-xs font-bold text-white">Aritii Delivery Hub</span>
                </div>
                <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                  Every order is tracked from verified shops to your doorstep across Addis Ababa and nationwide zones.
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <Link to="/delivery" className="flex items-center justify-between text-[#febd69] hover:underline font-medium">
                    <span>View Delivery Zones</span>
                    <MdArrowForward size={12} />
                  </Link>
                  <Link to="/seller-center" className="flex items-center justify-between text-[#75d04b] hover:underline font-medium">
                    <span>Sell in this Directory</span>
                    <MdArrowForward size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main grid area */}
          <main className="categories-main">
            <section className="category-grid-section">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="grid-title">All Categories ({filteredCategories.length})</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Browse verified products across active categories</p>
                </div>
                <Link to="/products" className="text-xs font-bold text-[#007185] hover:underline flex items-center gap-1">
                  View Full Product Catalog <MdArrowForward size={14} />
                </Link>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="category-grid">
                  {filteredCategories.map((cat) => {
                    const isActive = active.toLowerCase() === String(cat.title).toLowerCase();
                    return (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.title)}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`category-card group ${isActive ? 'active' : ''}`}
                      >
                        {/* Card header with icon or real category image */}
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-850 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <CategoryIcon title={cat.title} size={26} />
                          {cat.count > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#75d04b]/15 text-[#5ac12f]">
                              {cat.count} products
                            </span>
                          )}
                        </div>

                        {/* Card content */}
                        <div className="category-card-content p-4 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h3 className="category-title text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#4a8f28] transition-colors">
                                {cat.title}
                              </h3>
                              <MdChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>

                            {cat.description && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                {cat.description}
                              </p>
                            )}

                            {/* Logistics tag */}
                            <div className="flex items-center gap-1.5 text-[10px] text-[#00A8E1] font-medium mb-3">
                              <MdLocalShipping size={13} />
                              <span>Direct Port & Door Delivery</span>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-[#FF9900] group-hover:text-[#E68A00] inline-flex items-center gap-1 mt-auto">
                            Explore Category <MdArrowForward size={13} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No categories match "{searchTerm}"
                  </p>
                  <p className="text-xs text-gray-500 mb-4">Try checking your spelling or search all products instead.</p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] text-xs font-bold rounded-lg"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {loading ? (
        <Loading variant="inline" label="Loading categories…" />
      ) : error ? (
        <EmptyState title="Could not load categories" description={error} />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Categories appear here once the catalog is populated." />
      ) : null}
    </>
  );
};

export default CategoriesPage;
