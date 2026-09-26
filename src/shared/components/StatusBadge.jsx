import React from 'react';

/**
 * StatusBadge — unified status pill for orders, products, stock, events.
 *
 * Maps status values to the existing Tailwind color classes used across
 * the codebase. Always shows text (never color-only).
 */

const STATUS_STYLES = {
  // Success variants
  delivered: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  succeeded: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  'in stock': 'bg-green-100 text-green-700',

  // Warning variants
  processing: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-yellow-100 text-yellow-700',
  'low stock': 'bg-amber-100 text-amber-700',
  upcoming: 'bg-blue-100 text-blue-700',
  'under review': 'bg-yellow-100 text-yellow-700',

  // Danger variants
  cancelled: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  'out of stock': 'bg-red-100 text-red-700',
  'not approved': 'bg-red-100 text-red-700',
  ended: 'bg-gray-100 text-gray-600',

  // Info variants
  shipped: 'bg-blue-100 text-blue-700',
  info: 'bg-blue-100 text-blue-700',
};

const DEFAULT_STYLE = 'bg-gray-100 text-gray-700';

function resolveStyle(status) {
  if (!status) return DEFAULT_STYLE;
  const key = String(status).toLowerCase().trim();
  return STATUS_STYLES[key] || DEFAULT_STYLE;
}

function resolveLabel(status, label) {
  if (label) return label;
  if (!status) return '';
  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
}

export default function StatusBadge({ status, label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${resolveStyle(status)} ${className}`}
    >
      {resolveLabel(status, label)}
    </span>
  );
}
