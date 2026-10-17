import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useDeals } from '@/features/marketplace/hooks/useDeals';

const sortOptions = [
  { value: 'discount-percent', label: 'Biggest Savings' },
  { value: 'discount', label: 'Largest Amount Off' },
  { value: 'newest', label: 'Newest Deals' },
];

const DealsContent = ({ deals, loading, error, refresh, sortBy, onSortChange, sortedDeals }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loading variant="inline" label="Loading deals…" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load deals"
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
        title="No deals right now"
        description="All products are at full price. Check back later — new deals are added regularly."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-market-on-surface">Today's Deals</h1>
          <p className="market-body-sm text-market-on-surface-variant">
            Products with the best discounts — sorted by savings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="market-body-sm text-market-on-surface-variant">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort deals"
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
            basePath="/deals"
          />
        ))}
      </div>
    </div>
  );
};

const DealsPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('discount-percent');
  const { deals, loading, error, refresh } = useDeals();

  const sortedDeals = useMemo(() => {
    const list = [...deals];
    switch (sortBy) {
      case 'discount-percent':
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      case 'discount':
        list.sort((a, b) => ((b.discount ?? 0) - (a.discount ?? 0)) || 0);
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
    { label: 'Deals', to: '/deals' },
    { label: "Today's Deals", active: true },
  ];

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={
        <div className="hidden xl:block w-64 pl-4 border-l border-market-subnav-border pr-4"></div>
      }
      mainContent={
        <DealsContent
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

export default DealsPage;
