import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

export const MetricCard = ({
  label,
  value,
  sub,
  tone = 'green',
  icon: Icon,
  trend,
}) => {
  const bgColorMap = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  };

  const textColorMap = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
    purple: 'text-purple-700',
  };

  const iconBgMap = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
  };

  return (
    <div
      className={`${bgColorMap[tone] || 'bg-gray-50'} rounded-lg border border-gray-200 shadow-sm p-6 transition-transform hover:shadow-md hover:scale-105`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">{label}</p>
          <p className={`text-3xl font-bold mt-3 ${textColorMap[tone] || 'text-gray-900'}`}>{value}</p>
          {sub && <p className="text-xs text-gray-600 mt-2">{sub}</p>}
          {trend && (
            <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
              <FiTrendingUp size={14} className="mr-1" />
              {trend}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconBgMap[tone] || 'bg-gray-100'} p-3 rounded-lg`}>
            <Icon size={24} className={textColorMap[tone] || 'text-gray-700'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
