import React from 'react';
import { FaTruck, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

export function DeliveryAvailability({ shopId, productId }) {
  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-dark-900 dark:border-dark-600">
      <h3 className="text-sm font-semibold mb-3 dark:text-gray-200">Delivery & Pickup</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaTruck className="mr-2 text-brand-primary" /> Delivery to your location: <span className="ml-2 font-medium text-green-600 dark:text-green-400">Available</span>
        </li>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaMapMarkerAlt className="mr-2 text-brand-primary" /> Pickup: <span className="ml-2 font-medium text-green-600 dark:text-green-400">Available</span>
        </li>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaMoneyBillWave className="mr-2 text-brand-primary" /> Cash on Delivery: <span className="ml-2 font-medium text-green-600 dark:text-green-400">Available</span>
        </li>
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Delivery options: Standard, Express</p>
    </div>
  );
}
