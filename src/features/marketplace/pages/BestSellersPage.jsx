import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoRefresh } from 'react-icons/io5';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import EmptyState from '@/components/common/EmptyState';
import { useBestSellers } from '@/features/marketplace/hooks/useBestSellers';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { sortProducts, productCategoryTitle, PRODUCT_SORT_OPTIONS } from '@/features/marketplace/utils/sortProducts';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';
import './BestSellersPage.css';

// The shared catalog sort vocabulary
const SORT_OPTIONS = PRODUCT_SORT_OPTIONS.filter((option) =>
  ['best-sellers', 'price-low', 'price-high', 'newest'].includes(option.value)
);

/**
 * BestSellersBadge Component
 * Premium gold / silver / bronze rank badge
 */
const BestSellersBadge = ({ rank, category }) => {
  const isTopThree = rank <= 3;
  const rankColors =
    rank === 1
      ? 'from-amber-400 to-yellow-500 text-black border-amber-300'
      : rank === 2
        ? 'from-gray-200 to-gray-400 text-black border-gray-300'
        : rank === 3
          ? 'from-amber-600 to-amber-700 text-white border-amber-600'
          : 'from-gray-800 to-gray-900 text-white border-gray-700';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black shadow-md bg-gradient-to-r border ${rankColors}`}>
      <span className="text-sm font-extrabold">#{rank}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider line-clamp-1">
        {category ? `in ${category}` : 'Best Seller'}
      </span>
    </div>
  );
};

/**
 * SalesVolume Component
 * Shows real units sold
 */
const SalesVolume = ({ unitsSold }) => {
  const formatSalesVolume = (units) => {
    if (units >= 1000000) return `${(units / 1000000).toFixed(1)}M+ bought`;
    if (units >= 1000) return `${(units / 1000).toFixed(0)}K+ bought`;
    if (units >= 10) return `${units}+ bought`;
    return null;
  };

  const volume = formatSalesVolume(unitsSold);
  return volume ? (
    <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
      <span>{volume}</span>
    </div>
  ) : null;
};

/**
 * Header Component with category pill rail and sort controls
 */
const BestSellersHeader = ({
  sortBy,
  onSortChange,
  onRefresh,
  loading,
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <div className="bestsellers-header mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1111] dark:text-white">
              Aritii Best Sellers
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Our most popular products based on real sales volume across Ethiopia
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Sort:
            </label>
            <CatalogSortSelect
              id="sort-select"
              value={sortBy}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              ariaLabel="Sort best sellers"
            />
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Refresh best sellers"
            title="Refresh best sellers"
          >
            <IoRefresh size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Dynamic Category Pill Navigation */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-[#131921] dark:bg-white text-white dark:text-[#131921] shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Best Sellers
          </button>
          {categories.map((cat) => {
            const label = typeof cat === 'string' ? cat : cat.title || cat.name;
            const isSelected = activeCategory.toLowerCase() === label.toLowerCase();
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectCategory(label)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#75d04b] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Product Grid with Bestseller Badges
 */
const BestSellersGrid = ({ products }) => {
  const { isAuthenticated } = useSelector((state) => state.user || {});
  const productsWithRank = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      rank: index + 1,
    }));
  }, [products]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {productsWithRank.map((product) => (
        <div key={product._id || product.id} className="relative group flex flex-col h-full">
          {/* Bestseller Badge */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none">
            <BestSellersBadge
              rank={product.rank}
              category={product.category}
            />
          </div>

          <ProductCard
            data={product}
            variant={isAuthenticated ? 'default' : 'public'}
          />

          {/* Sales Volume indicator */}
          {product.unitsSold > 0 && (
            <div className="mt-1 text-center">
              <SalesVolume unitsSold={product.unitsSold} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Loading Skeleton
 */
const BestSellersLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse h-72"
        >
          <div className="h-44 bg-gray-200 dark:bg-gray-800" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Main BestSellersContent Component
 */
const BestSellersContent = ({
  products,
  loading,
  error,
  refresh,
  sortBy,
  onSortChange,
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  if (loading) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={refresh}
          loading={loading}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
        <BestSellersLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={refresh}
          loading={loading}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
        <CatalogErrorState
          title="Could not load best sellers"
          description={error}
          onRetry={refresh}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={refresh}
          loading={loading}
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
        <EmptyState
          title="No best sellers found"
          description="Check back soon as more transactions take place across the marketplace."
        />
      </div>
    );
  }

  return (
    <div className="bestsellers-container">
      <BestSellersHeader
        sortBy={sortBy}
        onSortChange={onSortChange}
        onRefresh={refresh}
        loading={loading}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
      />
      <BestSellersGrid products={products} />
    </div>
  );
};

/**
 * Main BestSellersPage Component
 */
const BestSellersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'best-sellers');

  const { deals, loading, error, refresh } = useBestSellers();
  const { categories = [] } = useCatalogCategories({ type: 'product' });

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (category === 'all') {
      return deals;
    }
    const wanted = category.toLowerCase();
    return deals.filter(
      (product) =>
        productCategoryTitle(product).toLowerCase() === wanted ||
        product.categorySlug === category
    );
  }, [deals, category]);

  // Sort products
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy]
  );

  // Handle sort change with URL update
  const handleSortChange = useCallback(
    (newSort) => {
      setSortBy(newSort);
      const params = new URLSearchParams(searchParams);
      if (newSort === 'best-sellers') {
        params.delete('sort');
      } else {
        params.set('sort', newSort);
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSelectCategory = (newCat) => {
    const params = new URLSearchParams(searchParams);
    if (newCat === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCat);
    }
    setSearchParams(params, { replace: true });
  };

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Best Sellers' },
  ];

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={<FilterSidebar products={deals} basePath="/best-selling" />}
      mainContent={
        <BestSellersContent
          products={sortedProducts}
          loading={loading}
          error={error}
          refresh={refresh}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          categories={categories}
          activeCategory={category}
          onSelectCategory={handleSelectCategory}
        />
      }
    />
  );
};

export default BestSellersPage;
