import React from 'react';
import { STATUS_COLORS, STATUS_LABELS, statusOf } from '../constants';

/**
 * Pill badge for a request status. Labels/colours come from the domain
 * constants so buyer, seller and admin surfaces can never drift apart.
 */
const RequestStatusBadge = ({ status, className = '', showIcon = false }) => {
  const key = typeof status === 'string' ? status : statusOf(status);
  const label = STATUS_LABELS[key] || key || 'Unknown';
  const color = STATUS_COLORS[key] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${color} ${className}`}
    >
      {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {label}
    </span>
  );
};

export default RequestStatusBadge;
