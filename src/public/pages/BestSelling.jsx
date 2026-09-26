import React, { useMemo } from 'react';
import ProductCard from '@/shared/components/ProductCard';
import CategoryRail from '@/public/components/CategoryRail';
import CategorySheet from '@/public/components/CategorySheet';
import SectionHeader from '@/public/components/SectionHeader';
import Breadcrumb from '@/public/components/Breadcrumb';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useProducts } from '@/shared/hooks/useProducts';
import { useAuth } from '@/auth/hooks/useAuth';

/**
 * Best Selling page (canonical route: /best-selling).
 * Products ordered by recorded sales volume (best-effort across backend fields).
 */
const BestSellingPage = () => {
  const { isAuthenticated } = useAuth();
  const { products, loading, error } = useProducts();

  const data = useMemo(() => {
    const sold = (p) => p.sold_out ?? p.total_sell ?? 0;
    return [...products].sort((a, b) => sold(b) - sold(a));
  }, [products]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Best Selling' }]} />

      <SectionHeader
        title="Best Selling"
        description="The products buyers order most"
      />

      {/* No left sidebar on this page: sheet on mobile, chip row on desktop */}
      <CategorySheet
        basePath="/products"
        type="product"
        title="Categories"
        allLabel="All Products"
        className="mb-4"
      />
      <CategoryRail basePath="/products" type="product" allLabel="All Products" className="mb-6" />

      {loading ? (
        <Loading variant="inline" label="Loading best sellers…" />
      ) : error ? (
        <EmptyState title="Could not load best sellers" description={error} />
      ) : data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {data.map((product, index) => (
            <ProductCard data={product} key={product._id || index} variant={isAuthenticated ? 'default' : 'public'} />
          ))}
        </div>
      ) : (
        <EmptyState title="No best sellers yet" description="Sales data will populate this page." />
      )}
    </>
  );
};

export default BestSellingPage;
