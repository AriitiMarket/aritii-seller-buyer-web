import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useBestSellers } from '@/features/marketplace/hooks/useBestSellers';

const sortOptions = [
  { value: 'units-sold', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const BestSellersContent = ({ deals, loading, error, refresh, sortBy, onSortChange }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="h-40 bg-market-subnav animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-market-subnav animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-market-subnav animate-pulse rounded" />
              <div className="h-3 w-full bg-market-subnav animate-pulse rounded" />
              <div className="h-8 bg-market-subnav animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load best sellers"
        description={error}
        action={
          <Button onClick={refresh} className="bg-[#75d04b] hover:bg-[#5ac12f] text-white">
            Try again
          </Button>
        }
      />
    );
  }

  if (deals.length === 0) {
    return (
      <EmptyState
        title="No best sellers yet"
        description="No products have been sold recently. Check back soon."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-market-on-surface">Best Selling Products</h1>
          <p className="market-body-sm text-market-on-surface-variant">
            Our most popular products — ranked by real units sold over the last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="market-body-sm text-market-on-surface-variant">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort best sellers"
            className="px-3 py-1.5 text-sm border border-market-border rounded-button bg-market-surface text-market-on-surface focus:outline-none focus:ring-2 focus:ring-market-primary/30"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {sortedDeals.map((product) => (
          <ProductCard
            key={product._id || product.id}
            data={product}
            variant="public"
            basePath="/best-selling"
          />
        ))}
      </div>
    </div>
  );
};

const BestSellersPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('units-sold');
  const { deals, loading, error, refresh } = useBestSellers();

  const sortedDeals = useMemo(() => {
    const list = [...deals];
    switch (sortBy) {
      case 'units-sold':
        list.sort((a, b) => (b.unitsSold ?? 0) - (a.unitsSold ?? 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [deals, sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const breadcrumbItems = [
    { label: 'Best Sellers', to: '/best-selling' },
    { label: 'Best Selling Products', active: true },
  ];

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={
        <div className="hidden xl:block w-64 pl-4 border-l border-market-subnav-border pr-4"></div>
      }
      mainContent={
        <BestSellersContent
          deals={sortedDeals}
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

export default BestSellersPage;
