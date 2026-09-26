import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import shopService from '@/services/shop.service';
import productService from '@/services/product.service';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { ShopImage, ProductImage } from '@/components/common';
import { PlaceholderAvatar, PlaceholderProduct } from '@/assets';
import {
  shopLocation,
  shopStatusLabel,
  shopVerification,
} from '@/features/product-requests';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiGrid,
  FiClock,
  FiPackage,
  FiCheckCircle,
} from 'react-icons/fi';

/**
 * Buyer — Seller profile preview (`/my-dashboard/requests/sellers/:shopId`).
 *
 * Shown BEFORE a request is created so the buyer can evaluate the brand
 * (logo, about, categories, location, products, business status) and then
 * continue straight into the request form with the primary action
 * "Request Product".
 */
export default function SellerProfilePage() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let data = null;
      try {
        data = await shopService.getPublicById(shopId);
      } catch {
        data = await shopService.getById(shopId);
      }
      if (!data) throw new Error('Seller not found');
      setShop(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this seller');
      setShop(null);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    productService
      .getByShop(shopId)
      .then((list) => {
        if (!cancelled) setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  if (loading) return <Loading variant="inline" label="Loading seller profile…" />;
  if (error || !shop) {
    return (
      <EmptyState
        title="Seller not found"
        description={error || 'This seller profile is unavailable.'}
        action={
          <Link to="/my-dashboard/requests/new">
            <Button className="bg-brand-primary text-white">Back to seller selection</Button>
          </Link>
        }
      />
    );
  }

  const name = shop.name || 'Aritii Shop';
  const description = shop.description || '';
  const location = shopLocation(shop);
  const verification = shopVerification(shop);
  const rating = Number(shop.ratings || shop.rating || 0);
  const ratingCount = Number(shop.ratingCount || 0);
  const categories = [shop.category].filter(Boolean);
  const productCount = Number(shop.productCount || products.length || 0);

  return (
    <div className="space-y-5 pb-24 sm:pb-6">
      <Link
        to="/my-dashboard/requests/new"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary-dark"
      >
        <FiArrowLeft size={14} />
        Select a seller
      </Link>

      {/* Brand hero */}
      <header className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-br from-brand-primary/20 via-brand-primary/10 to-brand-primary/5" />
        <div className="px-4 sm:px-6 pb-5 -mt-10 sm:-mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <ShopImage
              data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url }}
              fallback={PlaceholderAvatar}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
              alt={`${name} logo`}
            />
            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{name}</h1>
                {verification && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${verification.tone}`}
                  >
                    <FiCheckCircle size={11} />
                    {verification.label}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-primary-light text-brand-primary-dark">
                  {shopStatusLabel(shop)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-yellow-400">&#9733;</span>
                  <span className="font-semibold text-gray-800">
                    {rating ? rating.toFixed(1) : '—'}
                  </span>
                  <span>{ratingCount ? `(${ratingCount} reviews)` : 'No reviews'}</span>
                </span>
                {location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin size={13} />
                    {location}
                  </span>
                )}
                {productCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <FiPackage size={13} />
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop primary action */}
            <Link to={`/my-dashboard/requests/new/${shopId}`} className="hidden sm:block">
              <Button className="bg-brand-primary text-white flex items-center gap-2">
                Request Product
                <FiArrowRight size={15} />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-600 mt-4 whitespace-pre-wrap">
            {description || 'This seller has not added a description yet.'}
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* About / categories / location */}
        <section className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">About</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {description || 'No about text yet.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiGrid size={15} className="text-brand-primary" />
              Categories
            </h2>
            {categories.length ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((value) => (
                  <span
                    key={value}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No categories listed.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiMapPin size={15} className="text-brand-primary" />
              Location
            </h2>
            <p className="text-sm text-gray-600">{location || 'No location listed.'}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <FiClock size={12} />
              On Aritii Market since {formatDateTime(shop.createdAt, '—')}
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Products</h2>
            <Link
              to={`/my-dashboard/shops/${shopId}`}
              className="text-sm font-semibold text-brand-primary-dark hover:underline"
            >
              Visit shop
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              This seller has no listed products yet — send a product request instead.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.slice(0, 9).map((product) => (
                <Link
                  key={product._id}
                  to={`/my-dashboard/marketplace/product/${product._id}`}
                  className="group rounded-xl border border-gray-100 overflow-hidden hover:border-brand-primary transition"
                >
                  <div className="aspect-square bg-gray-50">
                    <ProductImage
                      data={product}
                      fallback={PlaceholderProduct}
                      className="w-full h-full object-cover"
                      alt={product.name}
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-brand-primary-dark">
                      {product.name}
                    </p>
                    <p className="text-xs font-semibold text-brand-primary-dark mt-1">
                      {formatCurrency(product.discountPrice ?? product.originalPrice ?? 0)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile sticky primary action */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 p-3 flex gap-2">
        <Link to={`/my-dashboard/shops/${shopId}`} className="flex-1">
          <button
            type="button"
            className="w-full h-11 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold"
          >
            View Shop
          </button>
        </Link>
        <Link to={`/my-dashboard/requests/new/${shopId}`} className="flex-1">
          <button
            type="button"
            className="w-full h-11 rounded-full bg-brand-primary text-white text-sm font-semibold"
          >
            Request Product
          </button>
        </Link>
      </div>
    </div>
  );
}
