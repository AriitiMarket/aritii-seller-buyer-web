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

const ShopDetailsPage = () => {
  const { id } = useParams();
  const { shops } = useSelector((state) => state.shop);
  const { isAuthenticated } = useAuth();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setProducts(await productService.getByShop(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load this shop.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, shops, isAuthenticated]);

  if (loading) {
    return (
      <div className="py-24 text-center text-[#667085]">
        Loading shop…
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-semibold text-[#171A21]">Shop not found</h2>
        <p className="text-[#667085] mt-2">{error || "This shop is not available on Aritii Market."}</p>
        <Link to="/shops" className="mt-6 inline-block px-6 py-3 bg-[#20305C] hover:bg-[#2C3F6E] text-white rounded-xl font-semibold transition-colors">
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

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shops', to: '/shops' }, { label: name || 'Loading...' }]} />
      
      {/* Shop Header */}
      <div className="-mx-4 md:-mx-8 lg:-mx-12">
        <div className="w-full h-32 md:h-48 bg-gradient-to-r from-[#20305C] to-[#2C3F6E] overflow-hidden relative" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#E5E7EB] dark:border-gray-700 shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mt-[-60px] md:mt-[-80px]">
            <ShopImage
              data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url, image_Url: shop.avatar?.url }}
              fallback={PlaceholderAvatar}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              alt={name}
            />
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-[#171A21] dark:text-white">{name}</h1>
              <div className="flex items-center justify-center md:justify-start mt-2 gap-2">
                <Ratings rating={rating} />
                <span className="text-sm text-[#667085] dark:text-gray-400">
                  {ratingCount ? `(${ratingCount} reviews)` : "No reviews yet"}
                </span>
              </div>
              <p className="text-[#667085] dark:text-gray-400 mt-2 line-clamp-2">
                {description || `Official ${name} shop on Aritii Market.`}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-[#171A21] dark:text-gray-300">
                {isAuthenticated && location && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-base">📍</span>
                    {location}
                  </span>
                )}
                {isAuthenticated && phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-base">☎</span>
                    {phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-base">🛍</span>
                  <span className="font-medium">{shop.productCount || products.length || 0}</span>
                  <span>products</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#171A21] dark:text-white">
            Products from {name}
          </h2>
          {products.length > 0 && (
            <span className="text-sm text-[#667085] dark:text-gray-400">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {products.length > 0 ? (
          <GroupedProducts products={products} isAuthenticated={isAuthenticated} />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-[#171A21] dark:text-white mb-2">
              No products yet
            </h3>
            <p className="text-[#667085] dark:text-gray-400">
              This shop hasn't added any products yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const GroupedProducts = ({ products, isAuthenticated }) => {
  const variant = isAuthenticated ? 'default' : 'public';
  const groups = {};
  products.forEach((p) => {
    const cat = (p.category && p.category.trim()) || "Other";
    (groups[cat] = groups[cat] || []).push(p);
  });
  const ordered = Object.keys(groups);

  if (ordered.length <= 1) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {products.map((p, i) => <ProductCard data={p} key={p._id || i} variant={variant} />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {ordered.map((cat) => (
        <div key={cat}>
          <h3 className="text-lg font-semibold text-[#171A21] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-gray-700 pb-2">
            {cat}
            <span className="text-xs text-[#667085] dark:text-gray-400 ml-1">({groups[cat].length})</span>
          </h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {groups[cat].map((p, i) => <ProductCard data={p} key={p._id || i} variant={variant} />)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopDetailsPage;
