import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShop, AiOutlineDown } from 'react-icons/ai';
import { useBusinessShops } from '@/features/seller/hooks/useBusinessShops';

/**
 * SellerUtilityBar - Top utility bar for Seller Center.
 */
const SellerUtilityBar = () => {
  const [shopOpen, setShopOpen] = useState(false);
  const { isSeller } = useSelector((state) => state.seller || {});
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop, loading } = useBusinessShops();

  if (!isSeller || (shops.length === 0 && !loading)) {
    return null;
  }

  return (
    <div className="h-10 bg-[#141414] border-b border-gray-800 text-gray-300 text-sm">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Shop Selector - Left */}
        <div className="relative">
          <button
            onClick={() => setShopOpen(!shopOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-xs sm:text-sm cursor-pointer"
            title="Select shop"
            disabled={loading}
          >
            <AiOutlineShop size={16} className="text-amber-400" />
            <span className="hidden sm:inline font-medium text-white">
              {loading ? 'Loading...' : activeShop?.name || 'Select Shop'}
            </span>
            <span className="sm:hidden text-xs text-white">
              {loading ? '...' : activeShop?.name?.slice(0, 15) || 'Shop'}
            </span>
            {hasMultipleShops && (
              <AiOutlineDown size={12} className={`transition-transform text-gray-400 ${shopOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Dropdown Menu */}
          {shopOpen && hasMultipleShops && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="py-1">
                {shops.map((shop) => (
                  <button
                    key={shop._id}
                    onClick={() => {
                      selectShop(shop._id);
                      setShopOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm transition-colors ${
                      activeShopId === shop._id
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{shop.name || 'Unnamed Shop'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        shop.status === 'APPROVED' || shop.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {shop.status || 'Active'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2">
                <button
                  onClick={() => {
                    window.location.href = '/business/shops';
                    setShopOpen(false);
                  }}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline w-full text-left py-1"
                >
                  + Add New Shop
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats - Right */}
        <div className="hidden md:flex items-center gap-6 ml-auto text-xs">
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-[10px]">Today's Sales</span>
            <span className="font-semibold text-white">
              {activeShop?.todaySales || '0 ETB'}
            </span>
          </div>
          <div className="w-px h-5 bg-gray-800" />
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-[10px]">Orders</span>
            <span className="font-semibold text-white">
              {activeShop?.orderCount || '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerUtilityBar;
