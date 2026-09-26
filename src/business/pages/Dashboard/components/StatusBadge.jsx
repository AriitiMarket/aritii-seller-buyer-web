import React from 'react';
import { normalizeStatus } from '@/shared/utils/orderStatus';

const StatusBadge = ({ status }) => {
  const s = normalizeStatus(status) || '';
  let className = 'bg-gray-100 text-gray-700';

  if (s === 'Delivered' || s === 'Refund Success' || s === 'Published' || s === 'Active') {
    className = 'bg-green-100 text-green-700';
  } else if (s === 'Processing' || s === 'Shipped' || s === 'In Transit') {
    className = 'bg-blue-100 text-blue-700';
  } else if (s === 'Confirmed') {
    className = 'bg-indigo-100 text-indigo-700';
  } else if (s === 'Pending' || s === 'Refund Requested' || s === 'Refund Approved') {
    className = 'bg-yellow-100 text-yellow-700';
  } else if (s === 'Cancelled' || s === 'Inactive' || s === 'Refund Rejected') {
    className = 'bg-red-100 text-red-700';
  } else if (s === 'Draft' || s === 'Archived') {
    className = 'bg-gray-100 text-gray-600';
  }

  const label = s || 'Pending';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
