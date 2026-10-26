import React, { useEffect, useState } from "react";
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlinePhone, AiOutlineHome, AiOutlineMail, AiOutlineClockCircle, AiOutlineInstagram, AiOutlineFacebook } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';
import ProductCard from '@/shared/components/ProductCard';
import ShopCard from '@/shared/components/ShopCard';
import { ShopImage } from '@/components/common/ImageWithFallback';
import Ratings from '@/components/common/Ratings';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { PlaceholderAvatar } from '@/assets';
import { productService, shopService } from '@/services';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const { shops } = useSelector((state) => state.shop);
  const { isAuthenticated } = useAuth();
  const { zoneId: selectedZoneId, cityId: selectedCityId, hasZone } = useDeliveryLocation();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsError, setProductsError] = useState(null);

  // Related shops — same business category, excluding this shop.
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
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load this shop.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, shops, isAuthenticated]);

  // Fetch products separately to show shop header even if products fail
  useEffect(() => {
    if (!id || !shop) return;
    
    (async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const prods = await productService.getByShop(id, { 
          zoneId: hasZone ? selectedZoneId : undefined, 
          cityId: hasZone ? selectedCityId : undefined 
        });
        setProducts(prods || []);
      } catch (err) {
        setProductsError(err.response?.data?.message || err.message || "Could not load products");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    })();
  }, [id, shop, hasZone, selectedZoneId, selectedCityId]);

  if (loading) {
    return <Loading variant="page" label="Loading shop…" />;
  }

  if (error || !shop) {
    return (
      <EmptyState
        title="Shop not found"
        description={error || "This shop is not available on Aritii Market."}
        action={
          <Link to="/shops" className="mt-4 inline-block px-6 py-3 bg-[#75d04b] text-white hover:bg-[#66b83d] rounded-lg font-semibold transition-colors">
            Back to Shops
          </Link>
        }
      />
    );
  }

  const name = shop.name || "Aritii Shop";
  const description = shop.description || "";
  const address = shop.address || "";
  const city = shop.city || "";
  const phone = shop.phoneNumber || "";
  const email = shop.email || "";
  const website = shop.website || "";
  const operatingHours = shop.operatingHours || "";
  const rating = shop.ratings || shop.rating || 0;
  const ratingCount = shop.ratingCount || 0;
  const productCount = shop.productCount || products.length || 0;
  const verified = shop.isVerified || shop.verified;
  const socialMedia = shop.socialMedia || {};

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shops', to: '/shops' }, { label: name || 'Loading...' }]} />

      {/* Shop Header with Cover Image */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        {/* Cover image or gradient background */}
        <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-r from-[#2162a1] via-[#0064f9] to-[#0080ff] overflow-hidden relative">
          {shop.coverImage?.url && (
            <img
              src={shop.coverImage.url}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Shop Info Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 mt-[-60px] md:mt-[-80px] relative z-10">
            {/* Shop Logo/Avatar */}
            <div className="relative flex-shrink-0">
              <ShopImage
                data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url }}
                fallback={PlaceholderAvatar}
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                alt={name}
              />
              {verified && (
                <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 bg-[#75d04b] text-white rounded-full font-bold shadow-md">
                  ✓
                </div>
              )}
            </div>

            {/* Shop Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#75d04b]/20 text-[#75d04b] text-xs font-bold rounded-full border border-[#75d04b]/30">
                    Verified Seller
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <Ratings rating={rating} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {ratingCount ? `${rating.toFixed(1)} out of 5 (${ratingCount} review${ratingCount !== 1 ? 's' : ''})` : "No reviews yet"}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MdLocationOn className="flex-shrink-0 w-5 h-5 text-[#75d04b] mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium">{address || 'Not specified'}{city && `, ${city}`}</p>
                  </div>
                </div>

                {/* Phone */}
                {phone && (
                  <div className="flex items-start gap-2">
                    <AiOutlinePhone className="flex-shrink-0 w-5 h-5 text-[#75d04b] mt-0.5" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Phone</p>
                      <a href={`tel:${phone}`} className="text-gray-900 dark:text-white font-medium hover:text-[#75d04b] transition-colors">
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {email && (
                  <div className="flex items-start gap-2">
                    <AiOutlineMail className="flex-shrink-0 w-5 h-5 text-[#75d04b] mt-0.5" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Email</p>
                      <a href={`mailto:${email}`} className="text-gray-900 dark:text-white font-medium hover:text-[#75d04b] transition-colors truncate">
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Products Count */}
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 text-[#75d04b] mt-0.5 font-bold text-lg">🛍</span>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Products</p>
                    <p className="text-gray-900 dark:text-white font-medium">{productCount} item{productCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Hours */}
                {operatingHours && (
                  <div className="flex items-start gap-2">
                    <AiOutlineClockCircle className="flex-shrink-0 w-5 h-5 text-[#75d04b] mt-0.5" />
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Hours</p>
                      <p className="text-gray-900 dark:text-white font-medium">{operatingHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {description}
                </p>
              )}

              {/* Social Media Links */}
              {(socialMedia.instagram || socialMedia.facebook || website) && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {socialMedia.instagram && (
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#75d04b] rounded-lg transition-colors"
                      aria-label="Instagram"
                    >
                      <AiOutlineInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {socialMedia.facebook && (
                    <a
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#75d04b] rounded-lg transition-colors"
                      aria-label="Facebook"
                    >
                      <AiOutlineFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#75d04b] rounded-lg transition-colors"
                      aria-label="Website"
                    >
                      <AiOutlineHome className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Shop Catalog
          </h2>
          {products.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {productsLoading ? (
          <Loading variant="inline" label="Loading products…" />
        ) : productsError ? (
          <EmptyState
            title="Products not available"
            description={productsError}
          />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {products.map((p, i) => <ProductCard data={p} key={p._id || i} variant={isAuthenticated ? 'default' : 'public'} />)}
          </div>
        ) : (
          <EmptyState
            title="No products yet"
            description="This shop hasn't added any products yet."
          />
        )}
      </div>

      {/* Related Shops */}
      {relatedShops.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">More shops you may like</h3>
            <Link
              to="/shops"
              className="text-[#75d04b] hover:text-[#66b83d] font-semibold transition-colors inline-flex items-center gap-1"
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
