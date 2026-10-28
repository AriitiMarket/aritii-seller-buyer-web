import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop } from '@/store/slices/productThunks';
import Ratings from '@/components/common/Ratings';
import { Avatar } from '@/components/common/ImageWithFallback';
import { FiPlus, FiExternalLink, FiSettings, FiPackage, FiStar } from 'react-icons/fi';

const ShopProfileData = ({ isOwner, shopId }) => {
  const { products } = useSelector((state) => state.products);
  const routeId = useParams().id;
  const id = shopId || routeId;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(getAllProductsShop(id));
  }, [dispatch, id]);

  const [activeTab, setActiveTab] = useState('products');

  const allReviews =
    products && products.map((product) => product.reviews || []).flat();

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#131921] text-[#febd69] shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiPackage size={15} />
            <span>Store Products ({products?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#131921] text-[#febd69] shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiStar size={15} />
            <span>Customer Reviews ({allReviews?.length || 0})</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        {isOwner && (
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/business/products/create"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded-lg border border-[#a88734] transition shadow-xs"
            >
              <FiPlus size={14} />
              <span>Add Product</span>
            </Link>

            <Link
              to="/business/settings"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 transition shadow-xs"
            >
              <FiSettings size={14} />
              <span>Store Settings</span>
            </Link>

            <Link
              to={`/shops/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#131921] hover:bg-[#232f3e] text-white text-xs font-semibold rounded-lg border border-gray-700 transition shadow-xs"
            >
              <span>Public Storefront</span>
              <FiExternalLink size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((item, index) => (
                <ProductCard data={item} key={item._id || index} isShop={true} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
              <FiPackage size={36} className="mx-auto text-gray-400 mb-2" />
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">No products added yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                List products in this store so customers can discover and buy them.
              </p>
              <Link
                to="/business/products/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded-lg border border-[#a88734] transition shadow-xs"
              >
                <FiPlus size={14} />
                <span>Add Your First Product</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {allReviews && allReviews.length > 0 ? (
            <div className="space-y-3">
              {allReviews.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start gap-3 shadow-xs"
                >
                  <Avatar
                    url={item.user?.avatar?.url}
                    data={item.user}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt={item.user?.name || 'Customer avatar'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.user?.name || 'Verified Buyer'}
                      </h4>
                      <Ratings rating={item.rating} />
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{item?.comment || 'No written comment'}</p>
                    {item.createdAt && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
              <FiStar size={36} className="mx-auto text-gray-400 mb-2" />
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">No customer reviews yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Reviews will appear here once customers order and rate products from this store.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
