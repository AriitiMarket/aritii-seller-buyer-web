import React from 'react';

export const DashboardGreeting = ({
  seller,
  shopName,
  hasMultipleShops,
  shops = [],
  activeShopId,
  selectShop,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="seller-section-header">
      <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="seller-section-header-title">{getGreeting()}, {seller?.name || 'Seller'}</h1>
          <p className="seller-section-header-desc">
            Welcome back to your seller dashboard. Here's how {shopName} is performing.
          </p>
        </div>
        {hasMultipleShops && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-market-on-surface-variant mb-0">Active shop:</label>
            <select
              value={activeShopId || ''}
              onChange={(e) => selectShop(e.target.value)}
              className="seller-form-select w-auto"
            >
              {shops.map((s) => (
                <option key={s._id} value={s._id}>{s.name || 'Unnamed shop'}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGreeting;
