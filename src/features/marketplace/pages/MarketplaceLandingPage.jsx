/**
 * Marketplace Landing Page
 *
 * Route: /marketplace
 *
 * The shopping-focused entry point into the catalog. Uses the unified
 * marketplace header (same rail as /products, /shops, and other catalog
 * pages), so every public browsing page shares one navigation experience. Live products, shops and categories come from existing public
 * services — no parallel data system. Deeper browsing continues on /products,
 * /shops, /product/:id routes.
 */
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
import { useAuth } from '@/auth/hooks/useAuth';
import { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
import { useShops } from '@/shared/hooks/useShops';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import Loading from '@/components/common/Loading';
import ShoppingSteps from '@/features/marketplace/components/ShoppingSteps';

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
      <div className="w-full">
        {/* Hero Section - Fully Centered */}
        <section className="relative bg-gradient-to-br from-[#FDF6EC] to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Shop local, discover more
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                The Aritii marketplace is where buyers meet local sellers. Browse products and shops, compare prices and availability, place your order — and follow it all the way to your door.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8" role="search">
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <input
                    type="search"
                    placeholder="Search products, shops, categories…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:outline-none rounded-l-xl"
                    aria-label="Search the marketplace"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-r-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                    aria-label="Search"
                  >
                    <AiOutlineSearch size={20} />
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] w-full sm:w-auto justify-center"
                >
                  Browse all products
                  <AiOutlineArrowRight size={18} />
                </Link>
                <Link
                  to="/shops"
                  className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] w-full sm:w-auto justify-center"
                >
                  Browse all shops
                </Link>
              </div>

              {/* Hero Image */}
              <div className="mt-12 relative max-w-4xl mx-auto">
                <img
                  src="/buyer.png"
                  alt="Aritii buyer shopping hub with local product discovery and order tools"
                  width="1024"
                  height="512"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full rounded-2xl border border-white/20 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Rail */}
        {topCategories.length > 0 && (
          <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Shop by category</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Jump straight into what you need</p>
                </div>
                <Link to="/categories" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] text-center sm:text-right">
                  All categories →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {topCategories.map((cat) => {
                  const name = cat.title || cat;
                  return (
                    <Link
                      key={cat._id || name}
                      to={`/products?category=${encodeURIComponent(name)}`}
                      className="group bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 text-center hover:-translate-y-1 hover:border-[#75d04b] hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                    >
                      <span className="block w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center font-bold text-lg sm:text-xl group-hover:bg-[#75d04b] group-hover:text-white transition-colors">
                        {name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-[#75d04b] transition-colors leading-tight block">
                        {name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* How the marketplace works for buyers */}
        <ShoppingSteps />

        {/* Marketplace Highlights */}
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Why shop with Aritii?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need for a great shopping experience</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <span className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-xl bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center mx-auto">
                      <Icon size={24} />
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Products */}
        <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {search ? `Results for "${search}"` : 'Popular right now'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Live from sellers across the marketplace
                </p>
              </div>
              <Link to="/products" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] text-center sm:text-right">
                View all products →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loading variant="inline" label="Loading marketplace…" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 text-center">
                {error} —{' '}
                <Link to="/products" className="font-semibold underline">
                  try the full catalog
                </Link>
              </div>
            ) : topProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
                {topProducts.map((product, index) => (
                  <ProductCard
                    data={product}
                    key={product._id || index}
                    variant={isAuthenticated ? 'default' : 'public'}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center bg-gray-50 dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">The shelves are filling up</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  No products match right now — browse everything or check back soon.
                </p>
                <Link
                  to="/products"
                  className="inline-block px-6 py-3 bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-full font-semibold text-sm transition-colors"
                >
                  Browse all products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Live Shops */}
        {topShops.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured shops</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Local businesses selling on Aritii</p>
                </div>
                <Link to="/shops" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] text-center sm:text-right">
                  View all shops →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {topShops.map((shop, index) => (
                  <ShopCard
                    data={shop}
                    key={shop._id || index}
                    variant={isAuthenticated ? 'default' : 'public'}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Buyer sign-in nudge */}
        {!isAuthenticated && (
          <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-[#FDF6EC] to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-10 md:py-14 text-center shadow-lg">
                <AiOutlineShop size={40} className="mx-auto text-[#75d04b] mb-4" aria-hidden="true" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  One account to shop everything
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                  Create a free Aritii account to place orders, save your favourites, message sellers
                  and track deliveries. Browsing stays open — no account needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/sign-up"
                    className="px-8 py-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-bold rounded-full transition-colors text-base w-full sm:w-auto justify-center"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full border border-gray-300 dark:border-gray-700 transition-colors text-base w-full sm:w-auto justify-center"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
};

export default MarketplaceLandingPage;