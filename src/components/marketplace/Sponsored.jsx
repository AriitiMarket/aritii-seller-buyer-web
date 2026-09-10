import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from '../../styles/styles';
import { ShopImage } from '../common/ImageWithFallback';
import { PlaceholderShop } from '../../assets';
import { AiFillStar } from 'react-icons/ai';

// Featured sellers are loaded from the backend via GET /shop/get-all-shops
// (commerce service -> API Gateway). No hardcoded shop list here.
const FeaturedShops = () => {
  const { shops, isLoading, error } = useSelector((state) => state.shop);

  return (
    <div className={`${styles.section} bg-white py-10 px-5 mb-12 mt-8 rounded-xl border border-brand`}>
      <div className="flex justify-center mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-charcoal">
            Featured Sellers on Aritii Market
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            Trusted local businesses, ready to serve you
          </p>
        </div>
      </div>

      {isLoading && shops.length === 0 ? (
        <div className="text-center py-10 text-brand-muted">
          Loading sellers&hellip;
        </div>
      ) : shops && shops.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop, index) => (
            <Link
              key={shop._id || index}
              to={`/shops/${shop._id}`}
              className="group block rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              {/* Cover */}
              <div className="relative w-full h-[120px] overflow-hidden">
                <ShopImage
                  data={shop}
                  alt={shop.name}
                  fallback={PlaceholderShop}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Avatar */}
              <div className="relative -mt-7 px-5">
                <div className="w-14 h-14 rounded-full border-4 border-white shadow bg-white overflow-hidden">
                  <ShopImage
                    data={shop}
                    alt={shop.name}
                    fallback={PlaceholderShop}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="px-5 pb-5 pt-3">
                <h3 className="font-semibold text-brand-charcoal group-hover:text-brand-primary">
                  {shop.name}
                </h3>
                <p className="text-xs text-brand-muted mt-1 line-clamp-2">
                  {shop.description || shop.address || "Local seller on Aritii Market"}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <AiFillStar color="#F5A623" size={15} />
                    {shop.ratings ? Number(shop.ratings).toFixed(1) : "0.0"}
                  </span>
                  <span>
                    {shop.productCount != null ? shop.productCount : 0} products
                  </span>
                </div>

                <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary/90 transition">
                  Visit Shop
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-brand-muted">
          {error ? "Unable to load sellers right now." : "No sellers available yet."}
        </div>
      )}
    </div>
  );
};

export default FeaturedShops;