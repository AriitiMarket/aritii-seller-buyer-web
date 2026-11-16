import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export const StoreMetricsLowStockAlerts = ({ lowStock = [] }) => {
  if (lowStock.length === 0) return null;

  return (
    <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiAlertCircle size={20} className="text-yellow-700" />
        <h3 className="font-bold text-yellow-900 text-lg">Low Stock Alerts ({lowStock.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lowStock.map((p) => (
          <div key={p._id} className="bg-white rounded p-3 border border-yellow-100">
            <p className="font-medium text-gray-800">{p.name}</p>
            <p className="text-sm text-yellow-700 font-semibold">{p.stock} units remaining</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreMetricsLowStockAlerts;
