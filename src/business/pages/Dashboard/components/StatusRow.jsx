import React from 'react';

const StatusRow = ({ label, count, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color].split(' ')[0]}`} />
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <span className={`font-semibold ${colorClasses[color].split(' ')[1]}`}>{count}</span>
    </div>
  );
};

export default StatusRow;
