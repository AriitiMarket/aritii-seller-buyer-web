import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoRefresh } from 'react-icons/io5';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import EmptyState from '@/components/common/EmptyState';
import { useBestSellers } from '@/features/marketplace/hooks/useBestSellers';
import { sortProducts, productCategoryTitle, PRODUCT_SORT_OPTIONS } from '@/features/marketplace/utils/sortProducts';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';
import './BestSellersPage.css';

// The shared catalog sort vocabulary — this page uses the ranking options.
const SORT_OPTIONS = PRODUCT_SORT_OPTIONS.filter((option) =>
  ['best-sellers', 'price-low', 'price-high', 'newest'].includes(option.value)
);

/**
 * BestSellersBadge Component
 * Displays rank and bestseller status with gold badge
 */
const BestSellersBadge = ({ rank, category }) => {
  return (
    <div className="bestseller-badge">
      <span className="bestseller-badge-rank">#{rank}</span>
      <span className="bestseller-badge-text">
        {category ? `in ${category}` : 'Best Seller'}
      </span>
    </div>
  );
};

/**
 * SalesVolume Component
 * Shows sales metrics in user-friendly format
 */
const SalesVolume = ({ unitsSold }) => {
  const formatSalesVolume = (units) => {
    if (units >= 1000000) return `${(units / 1000000).toFixed(1)}M+ bought`;
    if (units >= 1000) return `${(units / 1000).toFixed(0)}K+ bought`;
    if (units >= 100) return `${units}+ bought`;
    return null;
  };

  const volume = formatSalesVolume(unitsSold);
  return volume ? (
    <div className="sales-volume">
      <span className="sales-volume-text">{volume}</span>
    </div>
  ) : null;
};

/**
 * Header Component with filters and sorting
 */
const BestSellersHeader = ({
  sortBy,
  onSortChange,
  onRefresh,
  loading,
}) => {
  return (
    <div className="bestsellers-header">
      {/* Title and Description */}
      <div className="bestsellers-header-content">
        <div className="bestsellers-title-group">
          <h1 className="bestsellers-title">Best Sellers</h1>
          <p className="bestsellers-description">
            Our most popular products — ranked by real units sold over the last 30 days
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="refresh-button"
          aria-label="Refresh best sellers"
          title="Refresh best sellers"
        >
          <IoRefresh size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Desktop Filters and Sort */}
      <div className="bestsellers-controls">
        {/* Sort Options */}
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">
            Sort:
          </label>
          <CatalogSortSelect
            id="sort-select"
            value={sortBy}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            ariaLabel="Sort best sellers"
            className="filter-select"
          />
        </div>

      </div>
    </div>
  );
};

/**
 * Product Grid with Bestseller Badges
 */
const BestSellersGrid = ({ products }) => {
  // Sort products by rank and add rank position
  const productsWithRank = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      rank: index + 1,
    }));
  }, [products]);

  return (
    <div className="bestsellers-grid">
      {productsWithRank.map((product) => (
        <div key={product._id || product.id} className="bestseller-card-wrapper">
          {/* Bestseller Badge - Positioned absolutely */}
          <div className="bestseller-badge-position">
            <BestSellersBadge
              rank={product.rank}
              category={product.category}
            />
          </div>

          {/* Product Card */}
          <ProductCard
            data={product}
            variant="public"
          />

          {/* Sales Volume Badge */}
          {product.unitsSold && (
            <div className="bestseller-sales-position">
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
    <div className="bestsellers-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
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
}) => {
  if (loading) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={refresh}
          loading={loading}
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
        />
        <EmptyState
          title="No best sellers in this category"
          description="Try selecting a different category or check back soon."
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

  // Filter products by category — the public payload returns the category
  // either as a string or as an object, so it is normalised first.
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

  // Sort products — shared comparator so the price fallbacks match /products.
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
        />
      }
    />
  );
};

export default BestSellersPage;
