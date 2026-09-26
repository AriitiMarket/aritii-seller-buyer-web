import React from 'react';
import { Link } from 'react-router-dom';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

  const KPICard = ({ title, value, change, isPositive, icon: Icon, color, link }) => {
  const iconBgClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${iconBgClasses[color]}`}>
            <Icon className="text-xl" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />}
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </Link>
  );
};

export default KPICard;
