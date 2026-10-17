import React, { useEffect, useState } from "react";
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from '@/shared/components/ProductCard';
import { ShopImage } from '@/components/common/ImageWithFallback';
import Ratings from '@/components/common/Ratings';
import { PlaceholderAvatar } from '@/assets';
import productService from '@/services/product.service';
import shopService from '@/services/shop.service';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const { shops } = useSelector((state) => state.shop);
  const { isAuthenticated } = useAuth();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Related shops — same business category, excluding this shop.
  // Hooks must run unconditionally, before any early return.
  const allShops = useSelector((state) => state.shop?.shops || []);
  const relatedShops = React.useMemo(() => {
    if (!shop) return [];
    const category = shop.category;
    return allShops
      .filter((s) => (s._id || s.id) !== (shop._id || shop.id))
      .filter((s) => category && s.category === category)
      .slice(0, 4);
  }, [shop, allShops]);

  useEffect(() => {
    const { zoneId: selectedZoneId, cityId: selectedCityId, hasZone } = useDeliveryLocation();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let s = null;
        try {
          // Guests use the public shop endpoint (the authed one 401s).
          s = isAuthenticated
            ? await shopService.getById(id)
            : await shopService.getPublicById(id);
        } catch {
          s = null;
        }
        if (!s && shops) s = shops.find((x) => x._id === id);
        setShop(s || null);
        setProducts(await productService.getByShop(id, { zoneId: hasZone ? selectedZoneId : undefined, cityId: hasZone ? selectedCityId : undefined }));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load this shop.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, shops, isAuthenticated]);

  if (loading) {
    return (
      <div className="py-24 text-center text-market-on-surface-variant">
        Loading shop…
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-semibold text-market-on-surface">Shop not found</h2>
        <p className="text-market-on-surface-variant mt-2">{error || "This shop is not available on Aritii Market."}</p>
        <Link to="/shops" className="mt-6 inline-block px-6 py-3 bg-market-primary text-market-on-primary hover:bg-market-primary-hover rounded-xl font-semibold transition-colors">
          Back to Shops
        </Link>
      </div>
    );
  }

  const name = shop.name || "Aritii Shop";
  const description = shop.description || "";
  const address = shop.address || "";
  const zipCode = shop.zipCode || "";
  const location = address && zipCode ? `${address}, ${zipCode}` : address;
  const phone = shop.phoneNumber || "";
  const rating = shop.ratings || shop.rating || 0;
  const ratingCount = shop.ratingCount || 0;
  const productCount = shop.productCount ?? products.length ?? 0;
  const verified = shop.isVerified || shop.verified;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shops', to: '/shops' }, { label: name || 'Loading...' }]} />

      {/* Shop Header */}
      <div className="-mx-4 md:-mx-8 lg:-mx-12">
        <div className="w-full h-32 md:h-48 bg-gradient-to-r from-[#2162a1] to-[#0064f9] overflow-hidden relative" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-market-border dark:border-gray-700 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mt-[-60px] md:mt-[-80px]">
            <div className="relative flex-shrink-0">
              <ShopImage
                data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url, image_Url: shop.avatar?.url }}
                fallback={PlaceholderAvatar}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                alt={name}
              />
              {verified && (
                <div className="absolute bottom-0 right-0">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#20305C] text-white text-xs font-semibold rounded-full shadow-sm">
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h1 className="text-2xl font-bold text-market-on-surface dark:text-white leading-tight">{name}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#20305C] text-white text-[10px] font-bold rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Ratings rating={rating} />
                <span className="text-body-sm text-market-on-surface-variant dark:text-gray-400 ml-1.5">
                  {ratingCount ? `(${ratingCount})` : "No reviews"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-body-sm text-market-on-surface-variant dark:text-gray-400">
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-base">📍</span>
                    {location}
                  </span>
                )}
                {phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-base">☎</span>
                    {phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-base">🛍</span>
                  <span className="font-medium text-market-on-surface dark:text-white">{productCount}</span>
                  <span>products</span>
                </span>
              </div>
              {description && (
                <p className="mt-3 text-body-sm text-market-on-surface-variant dark:text-gray-400 line-clamp-2">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-market-on-surface dark:text-white">
            Products from {name}
          </h2>
          {products.length > 0 && (
            <span className="text-sm text-market-on-surface-variant dark:text-gray-400">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {products.map((p, i) => <ProductCard data={p} key={p._id || i} variant="public" />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-market-border dark:border-gray-700 rounded-lg">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-market-on-surface dark:text-white mb-2">
              No products yet
            </h3>
            <p className="text-market-on-surface-variant dark:text-gray-400">
              This shop hasn't added any products yet.
            </p>
          </div>
        )}
      </div>

      {/* Related shops — more from this business type */}
      {relatedShops.length > 0 && (
        <div className="mt-10 pt-6 border-t border-market-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="market-title-md text-market-on-surface">More shops you may like</h3>
            <Link
              to="/shops"
              className="market-body-sm text-market-primary font-semibold hover:underline"
            >
              View all shops →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedShops.map((s) => (
              <ShopCard key={s._id || s.id} data={s} variant="public" />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopDetailsPage;
