import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '@/shared/components/ProductCard';
import { ShopImage } from '@/components/common/ImageWithFallback';
import Ratings from '@/components/common/Ratings';
import { PlaceholderAvatar } from '@/assets';
import productService from '@/services/product.service';
import shopService from '@/services/shop.service';
import { MdArrowBack } from 'react-icons/md';

const BuyerShopDetail = () => {
  const { id } = useParams();
  const { shops } = useSelector((state) => state.shop);

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
          s = await shopService.getById(id);
        } catch {
          s = null;
        }
        if (!s && shops) s = shops.find((x) => x._id === id);
        setShop(s || null);
        setProducts(await productService.getByShop(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Could not load this shop.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, shops]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#75d04b] mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading shop…</p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Shop not found</h2>
        <p className="text-gray-500 mt-2">{error || 'This shop is not available on Aritii Market.'}</p>
        <Link
          to="/my-dashboard/shops"
          className="mt-6 inline-block px-6 py-3 bg-[#75d04b] text-white rounded-lg font-medium"
        >
          Back to Shops
        </Link>
      </div>
    );
  }

  const name = shop.name || 'Aritii Shop';
  const description = shop.description || '';
  const address = shop.address || '';
  const zipCode = shop.zipCode || '';
  const location = address && zipCode ? `${address}, ${zipCode}` : address;
  const phone = shop.phoneNumber || '';
  const rating = shop.ratings || shop.rating || 0;
  const ratingCount = shop.ratingCount || 0;

  const groups = {};
  products.forEach((p) => {
    const cat = (p.category && p.category.trim()) || 'Other';
    (groups[cat] = groups[cat] || []).push(p);
  });
  const ordered = Object.keys(groups);

  return (
    <div className="space-y-6">
      <Link
        to="/my-dashboard/shops"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#75d04b] transition"
      >
        <MdArrowBack size={18} />
        Back to Shops
      </Link>

      {/* Shop Header */}
      <div className="-mx-4 md:-mx-8 lg:-mx-12">
        <div className="w-full h-[140px] md:h-[200px] bg-gradient-to-r from-[#75d04b] to-[#5ac12f] overflow-hidden relative" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-wrap md:flex-nowrap items-center gap-5 mt-[-60px]">
            <ShopImage
              data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url, image_Url: shop.avatar?.url }}
              fallback={PlaceholderAvatar}
              className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white shadow"
              alt={name}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
              <div className="flex items-center mt-1">
                <Ratings rating={rating} />
                <span className="text-sm text-gray-500 ml-1">
                  {ratingCount ? `(${ratingCount})` : 'No reviews yet'}
                </span>
              </div>
              <p className="text-gray-500 mt-1">
                {description || `Official ${name} shop on Aritii Market.`}
              </p>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-700">
                {location && (
                  <span className="inline-flex items-center gap-1">
                    📍 {location}
                  </span>
                )}
                {phone && (
                  <span className="inline-flex items-center gap-1">
                    ☎ {phone}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  🛍 {shop.productCount || products.length || 0} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Products from {name}
        </h2>
        {products.length > 0 ? (
          ordered.length <= 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {products.map((p, i) => (
                <ProductCard data={p} key={p._id || i} basePath="/my-dashboard/marketplace" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {ordered.map((cat) => (
                <div key={cat}>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    {cat}
                    <span className="text-xs text-gray-500 ml-1">({groups[cat].length})</span>
                  </h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {groups[cat].map((p, i) => (
                      <ProductCard data={p} key={p._id || i} basePath="/my-dashboard/marketplace" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            No products available from this shop yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerShopDetail;
