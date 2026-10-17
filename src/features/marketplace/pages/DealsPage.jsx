import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useDeals } from '@/features/marketplace/hooks/useDeals';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import { LuClock } from 'react-icons/lu';
import './DealsPage.css';

const sortOptions = [
  { value: 'discount-percent', label: 'Biggest Savings' },
  { value: 'ends-soon', label: 'Ends Soon' },
  { value: 'discount', label: 'Largest Amount Off' },
  { value: 'newest', label: 'Newest Deals' },
];

const dealCategories = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'home', label: 'Home & Kitchen' },
  { id: 'sports', label: 'Sports & Outdoors' },
  { id: 'books', label: 'Books & Media' },
  { id: 'beauty', label: 'Beauty & Personal Care' },
];

/**
 * Countdown Timer Component
 * Shows time remaining for deals to expire
 */
const CountdownTimer = ({ dealEndTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      if (!dealEndTime) return;
      
      const now = new Date();
      const endTime = new Date(dealEndTime);
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m left`);
      } else {
        setTimeRemaining(`${minutes}m left`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dealEndTime]);

  if (!timeRemaining) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
      <LuClock size={14} />
      <span>{timeRemaining}</span>
    </div>
  );
};

/**
 * Deals Page Header with Title, Timer, and Sort Controls
 */
const DealsPageHeader = ({ onSortChange, sortBy, dealEndTime, mobileFiltersOpen, onMobileFiltersToggle }) => {
  return (
    <div className="bg-white dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800 mb-6 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-4">
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

        {/* Timer */}
        {dealEndTime && (
          <div className="flex-shrink-0">
            <CountdownTimer dealEndTime={dealEndTime} />
          </div>
        )}
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort deals"
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#75d04b]/30 transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onMobileFiltersToggle}
          className="md:hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-medium"
          aria-label="Toggle filters"
        >
          <AiOutlineFilter size={16} />
          Filters
        </button>
      </div>
    </div>
  );
};

/**
 * Deals Sidebar for Desktop - Category Filters
 */
const DealsSidebar = ({ selectedCategory, onCategoryChange, isOpen, onClose }) => {
  const sidebarClasses = `
    fixed md:relative md:h-auto md:w-64 md:bg-transparent md:border-0 md:p-0 md:shadow-none md:translate-x-0
    ${isOpen ? 'inset-0 z-40 bg-black/50' : '-translate-x-full md:translate-x-0'}
    transition-transform duration-300
  `;

  const contentClasses = `
    ${isOpen ? 'w-64 bg-white dark:bg-gray-900 h-full overflow-y-auto' : 'w-full'}
    md:w-full md:bg-transparent md:overflow-visible
  `;

  return (
    <>
      <div className={sidebarClasses} onClick={onClose} />
      <div className={contentClasses}>
        {/* Close button - Mobile only */}
        {isOpen && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Close filters"
          >
            <AiOutlineClose size={20} />
          </button>
        )}

        <div className="md:border-l md:border-gray-200 md:dark:border-gray-800 md:pl-4 p-4 md:p-0">
          <h3 className="text-lg font-bold text-[#131921] dark:text-white mb-4">
            Deal Categories
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => {
                onCategoryChange(null);
                onClose();
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                selectedCategory === null
                  ? 'bg-[#75d04b] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              All Deals
            </button>

            {dealCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  onClose();
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  selectedCategory === category.id
                    ? 'bg-[#75d04b] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
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
  dealEndTime,
  selectedCategory,
  onCategoryChange 
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    <div className="flex gap-6">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block flex-shrink-0">
        <DealsSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          isOpen={false}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileFiltersOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Deals Header */}
        <DealsPageHeader
          onSortChange={onSortChange}
          sortBy={sortBy}
          dealEndTime={dealEndTime}
          mobileFiltersOpen={mobileFiltersOpen}
          onMobileFiltersToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
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

      {/* Mobile Sidebar */}
      {mobileFiltersOpen && (
        <DealsSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </div>
  );
};

/**
 * Main DealsPage Component
 */
const DealsPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('discount-percent');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { deals, loading, error, refresh } = useDeals();

  // Calculate deal end time (example: 24 hours from now)
  const dealEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Sort and filter deals
  const sortedDeals = useMemo(() => {
    let list = [...deals];

    // Filter by category if selected
    if (selectedCategory) {
      list = list.filter(
        (deal) => deal.category?.id === selectedCategory || deal.categoryId === selectedCategory
      );
    }

    // Sort deals
    switch (sortBy) {
      case 'discount-percent':
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      case 'ends-soon':
        list.sort(
          (a, b) =>
            new Date(a.dealEndTime ?? new Date()).getTime() -
            new Date(b.dealEndTime ?? new Date()).getTime()
        );
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
  }, [deals, sortBy, selectedCategory]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const breadcrumbItems = [
    { label: 'Deals', to: '/deals' },
    { label: "Today's Lightning Deals", active: true },
  ];

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={<FilterSidebar products={deals} basePath="/deals" />}
      mainContent={
        <DealsContent
          deals={deals}
          loading={loading}
          error={error}
          refresh={refresh}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortedDeals={sortedDeals}
          dealEndTime={dealEndTime}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      }
    />
  );
};

export default DealsPage;
