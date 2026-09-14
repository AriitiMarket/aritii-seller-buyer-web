import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

/**
 * BestDeals Component - Top selling products
 * Features:
 * - Sorts products by sales/sold count
 * - Shows top 5 best-selling items
 * - Responsive grid layout
 * - Loading and empty states
 */
const BestDeals = () => {
  const [data, setData] = useState([])
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const dddata = allProducts || [];
    const sortedData = [...dddata].sort((a, b) => {
      const aSold = a.sold_out ?? a.total_sell ?? 0;
      const bSold = b.sold_out ?? b.total_sell ?? 0;
      return bSold - aSold;
    });
    const firstFive = sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts])

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 6H5.5C4.119 6 3 7.119 3 8.5v10c0 1.381 1.119 2.5 2.5 2.5h8c1.381 0 2.5-1.119 2.5-2.5v-10c0-1.381-1.119-2.5-2.5-2.5zm0 12h-8v-10h8v10zm7-10h-2v-1h2v1zm0 2h-2v-1h2v1zm0 2h-2v-1h2v1zm0 2h-2v-1h2v1z"/>
            </svg>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Best Deals
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Top-selling products with the best value
          </p>
        </div>

        {/* Products Grid */}
        {isLoading && allProducts.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data && data.length !== 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {data.map((product, index) => (
              <ProductCard data={product} key={product._id || index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No deals available yet</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for amazing offers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BestDeals