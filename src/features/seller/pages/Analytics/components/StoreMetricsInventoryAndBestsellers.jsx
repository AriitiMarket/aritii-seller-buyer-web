import React from 'react';
import { FiTrendingUp, FiPackage } from 'react-icons/fi';

export const StoreMetricsInventoryAndBestsellers = ({
  bestSellers = [],
  totalStockUnits = 0,
  lowStockCount = 0,
  outOfStockCount = 0,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Best Sellers Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiTrendingUp size={20} className="text-green-700" />
          Top Selling Products
        </h3>
        {bestSellers.length ? (
          <div className="space-y-3">
            {bestSellers.map((b, idx) => (
              <div key={b.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                    #{idx + 1}
                  </span>
                  <span className="text-gray-800 font-medium">{b.name}</span>
                </div>
                <span className="text-right text-green-700 font-bold">
                  {b.quantity} sold<br />
                  <small className="text-xs">ETB {b.revenue.toLocaleString()}</small>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No sales yet. Orders will appear here once placed.</p>
          </div>
        )}
      </div>

      {/* Inventory Snapshot Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiPackage size={20} className="text-blue-700" />
          Inventory Snapshot
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span className="text-gray-700 font-medium">Total Stock Units</span>
            <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded">
              {totalStockUnits}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
            <span className="text-gray-700 font-medium">Low Stock (1-5 units)</span>
            <span className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded">
              {lowStockCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded">
            <span className="text-gray-700 font-medium">Out of Stock</span>
            <span className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded">
              {outOfStockCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMetricsInventoryAndBestsellers;
