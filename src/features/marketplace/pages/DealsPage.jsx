import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useDeals } from '@/features/marketplace/hooks/useDeals';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import {
  productCategoryTitle,
  productCreatedAt,
  productDiscountAmount,
  productDiscountPercent,
} from '@/features/marketplace/utils/sortProducts';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';
import { LuClock } from 'react-icons/lu';
import { AiOutlineFire } from 'react-icons/ai';
import './DealsPage.css';

const sortOptions = [
  { value: 'discount-percent', label: 'Biggest Savings (%)' },
  { value: 'discount', label: 'Largest Amount Off (ETB)' },
  { value: 'newest', label: 'Newest Deals' },
];

/**
 * Deals Page Header with Title, Category Rail, and Sort Controls
 */
const DealsPageHeader = ({
  onSortChange,
  sortBy,
  categories = [],
  activeCategory = '',
  onSelectCategory,
}) => {
  return (
    <div className="bg-white dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800 mb-6 px-1 py-4">
      {/* Title and Daily refresh Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <AiOutlineFire size={24} className="text-red-500 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#131921] dark:text-white">
              Today's Lightning Deals
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Exclusive discounts and daily promotions from verified local sellers
          </p>
        </div>

        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold shadow-xs">
            <LuClock size={14} className="text-amber-600" />
            <span>Updated Daily</span>
          </span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Sort by:
          </span>
          <CatalogSortSelect
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            ariaLabel="Sort deals"
          />
        </div>
      </div>

      {/* Dynamic Category Pill Rail */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              !activeCategory
                ? 'bg-[#cc0c39] text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Deals
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
                    ? 'bg-[#cc0c39] text-white shadow-xs'
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
  categories,
  activeCategory,
  onSelectCategory,
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

  const { isAuthenticated } = useSelector((state) => state.user || {});

  return (
    <div className="w-full">
      <DealsPageHeader
        onSortChange={onSortChange}
        sortBy={sortBy}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {sortedDeals.map((product) => (
          <ProductCard
            key={product._id || product.id}
            data={product}
            variant={isAuthenticated ? 'default' : 'public'}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('discount-percent');
  const selectedCategory = searchParams.get('category') || '';
  const { deals, loading, error, refresh } = useDeals();
  const { categories = [] } = useCatalogCategories({ type: 'product' });

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

  const handleSelectCategory = (newCat) => {
    const params = new URLSearchParams(searchParams);
    if (!newCat) {
      params.delete('category');
    } else {
      params.set('category', newCat);
    }
    setSearchParams(params, { replace: true });
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
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      }
    />
  );
};

export default DealsPage;
