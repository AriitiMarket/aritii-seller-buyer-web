import React from 'react';
import { MdInventory2, MdEventNote, MdTrendingUp } from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';

export const DashboardOperations = () => {
  return (
    <>
      {/* Operational Status */}
      <div className="seller-section-header">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Phase 1 Operational Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Hold Orders</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View orders on hold</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority Orders</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">High priority orders</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">SLA Breaches</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Orders missing deadline</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="seller-section-header">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/business/products/create"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center transition-colors hover:border-[#75d04b] hover:bg-[#f3ffee] dark:hover:bg-[#75d04b]/10"
          >
            <MdInventory2 size={24} className="text-[#75d04b] mb-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Add Product</span>
          </a>
          <a
            href="/business/orders"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center transition-colors hover:border-[#75d04b] hover:bg-[#f3ffee] dark:hover:bg-[#75d04b]/10"
          >
            <FiPackage size={24} className="text-[#75d04b] mb-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">View Orders</span>
          </a>
          <a
            href="/business/promotions"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center transition-colors hover:border-[#75d04b] hover:bg-[#f3ffee] dark:hover:bg-[#75d04b]/10"
          >
            <MdEventNote size={24} className="text-[#75d04b] mb-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Create Promotion</span>
          </a>
          <a
            href="/business/analytics"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center transition-colors hover:border-[#75d04b] hover:bg-[#f3ffee] dark:hover:bg-[#75d04b]/10"
          >
            <MdTrendingUp size={24} className="text-[#75d04b] mb-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default DashboardOperations;
