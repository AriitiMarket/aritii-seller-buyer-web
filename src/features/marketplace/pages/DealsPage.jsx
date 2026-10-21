import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useDeals } from '@/features/marketplace/hooks/useDeals';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import {
  productCategoryTitle,
  productCreatedAt,
  productDiscountAmount,
  productDiscountPercent,
} from '@/features/marketplace/utils/sortProducts';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';
import { LuClock } from 'react-icons/lu';
import './DealsPage.css';

const sortOptions = [
  { value: 'discount-percent', label: 'Biggest Savings' },
  { value: 'discount', label: 'Largest Amount Off' },
  { value: 'newest', label: 'Newest Deals' },
];

/**
 * Deals Page Header with Title, Refresh Note, and Sort Controls
 */
const DealsPageHeader = ({ onSortChange, sortBy }) => {
  return (
    <div className="bg-white dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800 mb-6 px-1 py-4">
      {/* Title and Timer Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#131921] dark:text-white">
            ⚡ Lightning Deals
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Incredible savings on limited quantities — grab them before they're gone
          </p>
        </div>

        {/* Deals are re-published daily — the public payload carries no
            per-deal end time, so no countdown is shown. */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold">
            <LuClock size={14} />
            <span>Refreshed daily</span>
          </span>
        </div>
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort by:</span>
          <CatalogSortSelect
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            ariaLabel="Sort deals"
          />
        </div>

      </div>
    </div>
  );
};

/**
 * Main Deals Content Component
 */
const DealsContent = ({
  deals,
  loading,
  error,
  refresh,
  sortBy,
  onSortChange,
  sortedDeals,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loading variant="inline" label="Loading deals…" />
      </div>
    );
  }

  if (error) {
    return (
      <CatalogErrorState
        title="Could not load deals"
        description={error}
        onRetry={refresh}
      />
    );
  }

  if (deals.length === 0) {
    return (
      <EmptyState
        title="No deals right now"
        description="All products are at full price. Check back later — new deals are added regularly."
      />
    );
  }

  return (
    <div className="w-full">
      <DealsPageHeader onSortChange={onSortChange} sortBy={sortBy} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {sortedDeals.map((product) => (
          <ProductCard
            key={product._id || product.id}
            data={product}
            variant="public"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main DealsPage Component
 */
const DealsPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('discount-percent');
  const selectedCategory = searchParams.get('category') || '';
  const { deals, loading, error, refresh } = useDeals();
  const filterableDeals = useMemo(() => deals.map((deal) => ({
    ...deal,
    category: productCategoryTitle(deal) || 'Other',
  })), [deals]);

  // Sort and filter deals
  const sortedDeals = useMemo(() => {
    let list = [...deals];

    // Filter by category if selected
    if (selectedCategory) {
      const selected = selectedCategory.trim().toLowerCase();
      list = list.filter((deal) => {
        const values = [
          typeof deal.category === 'string' ? deal.category : deal.category?.name,
          typeof deal.category === 'object' ? deal.category?.id : null,
          deal.categoryId,
          deal.categorySlug,
        ].filter(Boolean).map((value) => String(value).trim().toLowerCase());
        return values.includes(selected);
      });
    }

    // Sort deals — the shared comparators, so the price/date fallbacks match
    // the other catalog pages. "Ends soon" was removed: the public payload
    // carries no per-deal end time, so the option never changed the order.
    switch (sortBy) {
      case 'discount-percent':
        list.sort((a, b) => productDiscountPercent(b) - productDiscountPercent(a));
        break;
      case 'discount':
        list.sort((a, b) => productDiscountAmount(b) - productDiscountAmount(a));
        break;
      case 'newest':
        list.sort((a, b) => productCreatedAt(b) - productCreatedAt(a));
        break;
      default:
        break;
    }

    return list;
  }, [deals, sortBy, selectedCategory]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: "Today's Lightning Deals" },
  ];

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={<FilterSidebar products={filterableDeals} basePath="/deals" />}
      mainContent={
        <DealsContent
          deals={deals}
          loading={loading}
          error={error}
          refresh={refresh}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortedDeals={sortedDeals}
        />
      }
    />
  );
};

export default DealsPage;
