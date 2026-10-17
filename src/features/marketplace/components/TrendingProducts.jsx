import React from 'react';

/**
 * TrendingProducts - Shows trending/trending products on the marketplace homepage.
 * Displays a grid of products marked as trending or featured.
 */
const TrendingProducts = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Trending Products
      </h2>
      <div className="grid grid-cols-2 md-grid-cols-3 lg-grid-cols-4 gap-4">
        {/* Trending products would be rendered here */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 hover:hover:bg-gray-800">
          <div className="h-48 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
            {/* Product image would go here */}
          </div>
          <div className="px-2 py-1">
            <h3 className="text-sm font-medium">Product Name</h3>
            <p className="text-xs text-gray-500">$29.99</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TrendingProducts };
export default TrendingProducts;