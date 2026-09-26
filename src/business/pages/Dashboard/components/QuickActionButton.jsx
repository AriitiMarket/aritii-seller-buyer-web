import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionButton = ({ to, label, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${colorClasses[color]}`}
    >
      <Icon className="text-2xl" />
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
};

export default QuickActionButton;
