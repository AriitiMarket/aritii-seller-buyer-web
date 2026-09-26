import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import ShopCard from '@/shared/components/ShopCard';
import SectionHeader from '@/public/components/SectionHeader';
import Breadcrumb from '@/public/components/Breadcrumb';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
import { useShops, filterShops } from '@/shared/hooks/useShops';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useAuth } from '@/auth/hooks/useAuth';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 250);

  const { isAuthenticated } = useAuth();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { shops, loading: shopsLoading, error: shopsError } = useShops();

  const matchedProducts = useFilteredProducts(products, { search: debouncedQuery });
  const matchedShops = filterShops(shops, { search: debouncedQuery });

  const loading = productsLoading || shopsLoading;
  const error = productsError || shopsError;
  const total = matchedProducts.length + matchedShops.length;

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search Results' }]} />
      
      <SectionHeader
        title={`Search results for "${query}"`}
        description={!loading && !error ? `${matchedProducts.length} product${matchedProducts.length === 1 ? '' : 's'} and ${matchedShops.length} shop${matchedShops.length === 1 ? '' : 's'} found` : undefined}
      />

      {loading ? (
        <Loading variant="inline" label="Searching…" />
      ) : error ? (
        <EmptyState title="Search failed" description={error} />
      ) : total === 0 ? (
        <EmptyState
          title={query ? 'No matches found' : 'Start typing to search'}
          description={
            query
              ? 'Try a different keyword, or browse products and shops.'
              : 'Search Aritii Market for products and shops.'
          }
          action={
            <Link
              to="/products"
              className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Browse products
            </Link>
          }
        />
      ) : (
        <>
          {matchedProducts.length > 0 ? (
            <section className="mb-12">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {matchedProducts.map((product, index) => (
                  <ProductCard data={product} key={product._id || index} variant={isAuthenticated ? 'default' : 'public'} />
                ))}
              </div>
            </section>
          ) : null}

          {matchedShops.length > 0 ? (
            <section className="pb-12">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Shops</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {matchedShops.map((shop, index) => (
                  <div key={shop._id || index}>
                    <ShopCard data={shop} variant={isAuthenticated ? 'default' : 'public'} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </>
  );
};

export default SearchResultsPage;
