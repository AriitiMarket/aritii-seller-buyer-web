import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SectionHeader from '@/public/components/SectionHeader';
import Breadcrumb from '@/public/components/Breadcrumb';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import CategoryIcon from '@/shared/categories/CategoryIcon';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * Categories page (canonical route: /categories).
 * Categories are catalog navigation: each one links into /products?category=…
 */
const CategoriesPage = () => {
  const { categories, loading, error } = useCatalogCategories({ type: 'product' });
  const [searchParams] = useSearchParams();
  const active = searchParams.get('category') || '';

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

      <SectionHeader
        title="Shop by Category"
        description="Browse the marketplace by category"
      />

      {loading ? (
        <Loading variant="inline" label="Loading categories…" />
      ) : error ? (
        <EmptyState title="Could not load categories" description={error} />
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const name = cat.title || cat;
            const count = cat.productCount ?? cat.count ?? 0;
            const href = `/products?category=${encodeURIComponent(name)}`;
            const isActive = active?.toLowerCase() === name.toLowerCase();

            return (
              <Link
                key={cat._id || name}
                to={href}
                aria-current={isActive ? 'page' : undefined}
                className={`group bg-white dark:bg-gray-800 rounded-xl border p-6 text-center hover:shadow-lg transition-all duration-300 ${
                  isActive
                    ? 'border-[#75d04b] shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#75d04b]/50'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#75d04b]/10 to-[#5ac12f]/10 flex items-center justify-center group-hover:from-[#75d04b]/20 group-hover:to-[#5ac12f]/20 transition-colors">
                  <CategoryIcon title={name} size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 group-hover:text-[#75d04b] transition-colors">
                  {name}
                </h3>
                {count > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {count} product{count !== 1 ? 's' : ''}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No categories yet" description="Categories appear here once the catalog is populated." />
      )}
    </>
  );
};

export default CategoriesPage;
