import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import CategorySidebar from '@/public/components/CategorySidebar';
import CategorySheet from '@/public/components/CategorySheet';
import Breadcrumb from '@/public/components/Breadcrumb';
import SectionHeader from '@/public/components/SectionHeader';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
import { useAuth } from '@/auth/hooks/useAuth';

/**
 * Products list (canonical route: /products).
 *
 * Guests see publicly permitted catalog items;
 * authenticated buyers hit the same endpoint and the backend applies their full
 * authorization (frontend filtering is never the security boundary).
 */
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const category = searchParams.get('category') || '';
  const shop = searchParams.get('shop') || '';
  const search = searchParams.get('search') || '';

  const { isAuthenticated } = useAuth();
  const { products, loading, error, refresh } = useProducts();
  const data = useFilteredProducts(products, { category, shop, search });

  const heading = search ? `Search: "${search}"` : category || shop || 'All Products';

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Apply the selected sort to the filtered list. 'featured' keeps the server /
  // relevance order (best-sellers first from useFilteredProducts).
  const sortedData = useMemo(() => {
    const list = [...data];
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0));
        break;
      case 'price-high':
        list.sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0));
        break;
      case 'rating':
        list.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }
    return list;
  }, [data, sortBy]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Avg. Customer Review' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Products' },
  ];
  if (category) {
    breadcrumbItems.push({ label: category });
  } else if (shop) {
    breadcrumbItems.push({ label: shop });
  } else if (search) {
    breadcrumbItems.push({ label: `Search: "${search}"` });
  }

  return (
    <>
      {/* <1024px — the sidebar is desktop-only, so small screens get the sheet */}
      <CategorySheet
        basePath="/products"
        type="product"
        title="Categories"
        allLabel="All Products"
        className="mb-4"
      />

      <div className="flex gap-6 lg:gap-8">
        {/* Far-left category sidebar (collapsible icon rail) */}
        <CategorySidebar
          basePath="/products"
          type="product"
          title="Shop by Category"
          allLabel="All Products"
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <SectionHeader
            title={heading}
            description={!loading && !error ? `${data.length} product${data.length === 1 ? '' : 's'} found` : undefined}
          />
          
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#75d04b]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={refresh}
              disabled={loading}
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-sm flex-shrink-0"
            >
              Refresh
            </Button>
          </div>

          {loading ? (
            <Loading variant="inline" label="Loading products…" />
          ) : error ? (
            <EmptyState
              title="Could not load products"
              description={error}
              action={
                <Button onClick={refresh} className="bg-brand-primary text-white">
                  Try again
                </Button>
              }
            />
          ) : data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {sortedData.map((product, index) => (
                <ProductCard data={product} key={product._id || index} variant={isAuthenticated ? 'default' : 'public'} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                search
                  ? 'No products match your search'
                  : category
                    ? `No products in ${category} yet`
                    : 'No products found'
              }
              description={
                search
                  ? 'Try different keywords or browse all products.'
                  : category
                    ? 'This category is empty right now — pick another one to keep browsing.'
                    : 'Check back later for new products.'
              }
              action={
                search || category ? (
                  <Link
                    to="/products"
                    className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Browse all products
                  </Link>
                ) : null
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
