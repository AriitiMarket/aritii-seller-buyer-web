import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoRefresh } from 'react-icons/io5';
import { MdFilterList } from 'react-icons/md';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useBestSellers } from '@/features/marketplace/hooks/useBestSellers';
import './BestSellersPage.css';

// Constants
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'clothing', label: 'Clothing & Apparel' },
  { value: 'home', label: 'Home & Kitchen' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: 'best-sellers', label: 'Best Sellers', icon: '★' },
  { value: 'price-low-high', label: 'Price: Low to High', icon: '↑' },
  { value: 'price-high-low', label: 'Price: High to Low', icon: '↓' },
  { value: 'newest', label: 'Newest Arrivals', icon: '⚡' },
];

/**
 * BestSellersBadge Component
 * Displays rank and bestseller status with Amazon-style gold badge
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
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  onRefresh,
  loading,
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
        {/* Category Filter */}
        <div className="filter-group hidden sm:flex">
          <label htmlFor="category-filter" className="filter-label">
            Category:
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
            aria-label="Sort best sellers"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="mobile-filter-toggle sm:hidden"
          aria-label="Toggle filters"
        >
          <MdFilterList size={20} />
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilter && (
        <div className="mobile-filter-panel">
          <div className="filter-group flex-col">
            <label htmlFor="mobile-category" className="filter-label">
              Category
            </label>
            <select
              id="mobile-category"
              value={category}
              onChange={(e) => {
                onCategoryChange(e.target.value);
                setShowMobileFilter(false);
              }}
              className="filter-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
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
            basePath="/best-selling"
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
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  if (loading) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          category={category}
          onCategoryChange={onCategoryChange}
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
          category={category}
          onCategoryChange={onCategoryChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={refresh}
          loading={loading}
        />
        <EmptyState
          title="Could not load best sellers"
          description={error}
          action={
            <Button
              onClick={refresh}
              className="bg-[#75d04b] hover:bg-[#5ac12f] text-white"
            >
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bestsellers-container">
        <BestSellersHeader
          category={category}
          onCategoryChange={onCategoryChange}
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
        category={category}
        onCategoryChange={onCategoryChange}
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
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'best-sellers');

  const { deals, loading, error, refresh } = useBestSellers();

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (category === 'all') {
      return deals;
    }
    return deals.filter(
      (product) =>
        product.category?.toLowerCase() === category.toLowerCase() ||
        product.categorySlug === category
    );
  }, [deals, category]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortBy) {
      case 'best-sellers':
        list.sort((a, b) => (b.unitsSold ?? 0) - (a.unitsSold ?? 0));
        break;
      case 'price-low-high':
        list.sort((a, b) => {
          const priceA = a.discountPrice ?? a.price ?? 0;
          const priceB = b.discountPrice ?? b.price ?? 0;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        list.sort((a, b) => {
          const priceA = a.discountPrice ?? a.price ?? 0;
          const priceB = b.discountPrice ?? b.price ?? 0;
          return priceB - priceA;
        });
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [filteredProducts, sortBy]);

  // Handle category change with URL update
  const handleCategoryChange = useCallback(
    (newCategory) => {
      setCategory(newCategory);
      const params = new URLSearchParams(searchParams);
      if (newCategory === 'all') {
        params.delete('category');
      } else {
        params.set('category', newCategory);
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
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
    { label: 'Best Sellers', to: '/best-selling' },
    { label: 'Best Selling Products', active: true },
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
          category={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      }
    />
  );
};

export default BestSellersPage;
