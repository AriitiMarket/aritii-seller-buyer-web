import React from 'react';
import { MdWarningAmber } from 'react-icons/md';

export const DashboardStockAlerts = ({
  outOfStock = 0,
  lowStockCount = 0,
}) => {
  if (outOfStock === 0 && lowStockCount === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {outOfStock > 0 && (
        <div className="seller-stat-card border-red-50 bg-red-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-600">
              <MdWarningAmber size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-red-600">
              ▲ {outOfStock}
            </div>
          </div>
          <p className="seller-stat-card-value text-red-700 font-bold">{outOfStock}</p>
          <p className="seller-stat-card-label">Out of stock</p>
        </div>
      )}
      {lowStockCount > 0 && (
        <div className="seller-stat-card border-amber-50 bg-amber-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
              <MdWarningAmber size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
              ▲ {lowStockCount}
            </div>
          </div>
          <p className="seller-stat-card-value text-amber-700 font-bold">{lowStockCount}</p>
          <p className="seller-stat-card-label">Low stock</p>
        </div>
      )}
    </div>
  );
};

export default DashboardStockAlerts;
