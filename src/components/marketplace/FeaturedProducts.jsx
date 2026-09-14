import React from 'react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

/**
 * FeaturedProducts Component - Showcase marketplace products
 * Features:
 * - Responsive grid layout
 * - Loading state with skeleton
 * - Empty state with icon
 * - Modern styling with gray backgrounds
 */
const FeaturedProducts = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
            Featured Products
          </h2>
          <p className="text-gray-600 text-sm md:text-base text-center mt-2">
            Discover handpicked items from our trusted sellers
          </p>
        </div>

        {/* Products Grid */}
        {isLoading && allProducts.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allProducts && allProducts.length !== 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {allProducts.map((product, index) => (
              <ProductCard data={product} key={product._id || index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No products available yet</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for more items</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedProducts