import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '@/public/components/SectionHeader';
import CategoryIcon from '@/shared/categories/CategoryIcon';
import { categoryHref } from '@/shared/categories/categoryHref';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * Home "Browse Categories" strip.
 *
 * Uses the PRODUCT category list (same source as the sidebar, hero and the
 * Categories page) — the old type-less endpoint also returned business
 * categories, whose chips led to empty product lists.
 */
const FeaturedCategories = () => {
  const { categories, loading } = useCatalogCategories({ type: 'product' });
  const visible = categories.slice(0, 8);

  if (!loading && visible.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Browse Categories"
          viewAllLink="/categories"
        />
        <div className="flex flex-wrap gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-36 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                  aria-hidden="true"
                />
              ))
            : visible.map((cat) => {
                const name = cat.title || cat;
                return (
                  <Link
                    key={cat._id || name}
                    to={categoryHref(name, '/products')}
                    className="group flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#75d04b] hover:text-[#75d04b] hover:bg-[#f3ffee] dark:hover:bg-gray-800 transition-all whitespace-nowrap"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#75d04b]/10 flex items-center justify-center group-hover:bg-[#75d04b]/20 transition-colors">
                      <CategoryIcon title={name} size={18} />
                    </span>
                    <span>{name}</span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export { FeaturedCategories };
export default FeaturedCategories;
