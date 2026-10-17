import React from 'react';

/**
 * SellerStatCard — compact KPI card for the seller dashboard.
 *
 * Uses existing Ariiti Market design tokens (market-*). No invented data.
 */
const SellerStatCard = ({ title, value, change, isPositive, icon: Icon, color, link }) => {
  const iconBgClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <a
      href={link}
      className="block"
      aria-label={`${title}: ${value}`}
    >
      <div className="seller-stat-card">
        <div className="flex items-start justify-between mb-3">
          <div className={`seller-stat-card-icon ${iconBgClasses[color] || iconBgClasses.green}`}>
            {Icon && <Icon className="text-xl" />}
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '▲' : '▼'} {change}
            </div>
          )}
        </div>
        <p className="seller-stat-card-value">{value}</p>
        <p className="seller-stat-card-label">{title}</p>
      </div>
    </a>
  );
};

export default SellerStatCard;
