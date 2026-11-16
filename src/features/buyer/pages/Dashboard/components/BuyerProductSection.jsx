import React from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '@/components/common/ImageWithFallback';

export const BuyerProductSection = ({
  title,
  products = [],
  viewAllTo = '/my-dashboard/marketplace',
}) => {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <Link to={viewAllTo} className="text-sm font-semibold text-[#75d04b] hover:underline transition">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => {
          const shopName = typeof p.shop === 'string' ? p.shop : p.shop?.name || p.shopName || 'Shop';
          const discountPercent = p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice
            ? Math.round(((p.originalPrice - p.discountPrice) / p.originalPrice) * 100)
            : 0;

          return (
            <Link
              key={p._id}
              to={`/my-dashboard/marketplace/product/${p._id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-[#75d04b]/50 transition-all"
            >
              <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    -{discountPercent}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">{p.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">{shopName}</p>
                <div className="flex items-center gap-1 mb-1">
                  {p.ratings > 0 && (
                    <>
                      <span className="text-yellow-500 text-[10px]">★</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{Number(p.ratings || 0).toFixed(1)}</span>
                    </>
                  )}
                </div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {Number(p.discountPrice || 0).toLocaleString()} <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">ETB</span>
                </p>
                {p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 line-through mt-0.5">{Number(p.originalPrice || 0).toLocaleString()} ETB</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BuyerProductSection;
