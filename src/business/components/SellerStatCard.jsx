import React from 'react';

/**
 * SellerStatCard — compact KPI card for the seller dashboard.
 *
 * Uses existing Aritii Market design tokens (market-*). No invented data.
 */
const SellerStatCard = ({ title, value, change, isPositive, icon: Icon, color, link }) => {
  const iconBgClasses = {
    green: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  };

  return (
    <a
      href={link}
      className="block group"
      aria-label={`${title}: ${value}`}
    >
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] p-4 shadow-sm hover:shadow-md hover:border-[#febd69] transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center text-lg ${iconBgClasses[color] || iconBgClasses.green}`}>
            {Icon && <Icon />}
          </div>
          {change && (
            <div className={`flex items-center gap-0.5 text-[11px] font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '▲' : '▼'} {change}
            </div>
          )}
        </div>
        <p className="text-xl font-extrabold text-[#0f1111] dark:text-white tracking-tight">{value}</p>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
      </div>
    </a>
  );
};

export default SellerStatCard;
