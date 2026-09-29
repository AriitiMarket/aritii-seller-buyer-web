import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineShoppingCart,
  AiOutlineShop,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineCompass,
} from 'react-icons/ai';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import ProductCard from '@/shared/components/ProductCard';
import ShopCard from '@/shared/components/ShopCard';
import { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
import { useShops } from '@/shared/hooks/useShops';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { useAuth } from '@/auth/hooks/useAuth';
import Loading from '@/components/common/Loading';
import ShoppingSteps from '@/public/marketplace/components/ShoppingSteps';

/**
 * PUBLIC MARKETPLACE LANDING (/marketplace)
 *
 * The shopping-focused entry point into the catalog. Uses the standard
 * ExperiencePageHeader (Marketplace accent = brand green) so the page reads as
 * part of the one Aritii platform. Live products, shops and categories come
 * from the existing public services — no parallel data system. Deeper browsing
 * continues on the existing /products, /shops, /product/:id routes.
 */

const highlights = [
  {
    icon: AiOutlineSearch,
    title: 'Find it fast',
    description: 'Search products and shops, filter by category, and compare options side by side.',
  },
  {
    icon: AiOutlineShoppingCart,
    title: 'Order in minutes',
    description: 'Add to cart, check out securely, and your order goes straight to the seller.',
  },
  {
    icon: AiOutlineMessage,
    title: 'Talk when you need to',
    description: 'Message the shop about an item or an order — replies land in your inbox.',
  },
  {
    icon: AiOutlineCompass,
    title: 'Track to your door',
    description: 'Follow every order from confirmation through delivery to your address.',
  },
];

const MarketplaceLandingPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [query, setQuery] = useState(search);

  const { isAuthenticated } = useAuth();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { shops, loading: shopsLoading, error: shopsError } = useShops();
  const { categories } = useCatalogCategories();

  const loading = productsLoading || shopsLoading;
  const error = productsError || shopsError;

  const featured = useFilteredProducts(products, { search });
  const topProducts = useMemo(() => featured.slice(0, 10), [featured]);
  const topShops = useMemo(() => shops.slice(0, 4), [shops]);
  const topCategories = useMemo(() => categories.slice(0, 6), [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (term) {
      window.location.href = `/products?search=${encodeURIComponent(term)}`;
    }
  };

  return (
    <PublicLayout>
      {/* Standard experience page header — Marketplace accent */}
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Marketplace' }]}
        badge="Marketplace Experience"
        title="Shop local, discover more"
        description="The Aritii marketplace is where buyers meet local sellers. Browse products and shops, compare prices and availability, place your order — and follow it all the way to your door."
        visual={(
          <img
            src="/buyer.png"
            alt="Aritii buyer shopping hub with local product discovery and order tools"
            width="1024"
            height="512"
            loading="eager"
            fetchPriority="high"
            className="block w-full rounded-2xl border border-white/20 shadow-2xl"
          />
        )}
        actions={
          <>
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${EXPERIENCES.marketplace.button} ${EXPERIENCES.marketplace.ring}`}
            >
              Browse all products
              <AiOutlineArrowRight size={16} />
            </Link>
            <Link
              to="/shops"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-sm border border-gray-300 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
            >
              Browse all shops
            </Link>
          </>
        }
      >
        {/* Search — part of the standard header composition */}
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl" role="search">
          <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <input
              type="search"
              placeholder="Search products, shops, categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-5 py-3.5 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:outline-none rounded-l-xl"
              aria-label="Search the marketplace"
            />
            <button
              type="submit"
              className={`px-6 py-3.5 text-white font-semibold rounded-r-xl transition-colors focus-visible:outline-none focus-visible:ring-2 ${EXPERIENCES.marketplace.button} ${EXPERIENCES.marketplace.ring}`}
              aria-label="Search"
            >
              <AiOutlineSearch size={20} />
            </button>
          </div>
        </form>

      </ExperiencePageHeader>

      {/* Category rail */}
      {topCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Shop by category</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jump straight into what you need</p>
            </div>
            <Link to="/categories" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f]">
              All categories →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {topCategories.map((cat) => {
              const name = cat.title || cat;
              return (
                <Link
                  key={cat._id || name}
                  to={`/products?category=${encodeURIComponent(name)}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:-translate-y-1 hover:border-[#75d04b] hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                >
                  <span className="block w-12 h-12 mx-auto mb-3 rounded-full bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center font-bold group-hover:bg-[#75d04b] group-hover:text-white transition-colors">
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#75d04b] transition-colors leading-tight block">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* How the marketplace works for buyers */}
      <ShoppingSteps />

      {/* Marketplace Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <span className="w-10 h-10 mb-3 rounded-xl bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {search ? `Results for "${search}"` : 'Popular right now'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Live from sellers across the marketplace
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f]">
            View all products →
          </Link>
        </div>

        {loading ? (
          <Loading variant="inline" label="Loading marketplace…" />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error} —{' '}
            <Link to="/products" className="font-semibold underline">
              try the full catalog
            </Link>
          </div>
        ) : topProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {topProducts.map((product, index) => (
              <ProductCard
                data={product}
                key={product._id || index}
                variant={isAuthenticated ? 'default' : 'public'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">The shelves are filling up</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              No products match right now — browse everything or check back soon.
            </p>
            <Link
              to="/products"
              className="inline-block px-5 py-2.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-full font-semibold text-sm transition-colors"
            >
              Browse all products
            </Link>
          </div>
        )}
      </section>

      {/* Live shops */}
      {topShops.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Featured shops</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Local businesses selling on Aritii</p>
            </div>
            <Link to="/shops" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f]">
              View all shops →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {topShops.map((shop, index) => (
              <ShopCard
                data={shop}
                key={shop._id || index}
                variant={isAuthenticated ? 'default' : 'public'}
              />
            ))}
          </div>
        </section>
      )}

      {/* Buyer sign-in nudge — routes into the existing auth flow, no parallel account system */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 px-5 sm:px-6 py-8 md:py-12 text-center shadow-sm">
            <AiOutlineShop size={32} className="mx-auto text-[#75d04b] mb-3" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              One account to shop everything
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-7 text-sm md:text-base">
              Create a free Aritii account to place orders, save your favourites, message sellers
              and track deliveries. Browsing stays open — no account needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/sign-up"
                className="px-8 py-3.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-bold rounded-full transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full border border-gray-300 dark:border-gray-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
};

export default MarketplaceLandingPage;
