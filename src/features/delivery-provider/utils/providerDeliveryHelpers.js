/**
 * Helper functions for delivery provider operations.
 * 
 * Reuses the existing delivery status utilities from shared/utils/deliveryStatus.js
 * to maintain consistency across the platform.
 */

import {
  DELIVERY_STATUSES,
  normalizeDeliveryStatus,
  getDeliveryStatus,
  isDeliveryFinal,
  formatDeliveryAddress,
  deliveryReference,
} from '@/shared/utils/deliveryStatus';
import { formatCurrency } from '@/shared/utils/format';

// Re-export for convenience
export {
  DELIVERY_STATUSES,
  normalizeDeliveryStatus,
  getDeliveryStatus,
  isDeliveryFinal,
  formatDeliveryAddress,
  deliveryReference,
};

export const BATCH_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

/**
 * Human-readable message from any error the API layer hands back.
 *
 * Axios errors carry the service's real message under
 * `error.response.data.message` (the `{ success, code, message, errors }`
 * envelope); `error.message` alone would surface "Request failed with status
 * code 400" instead of e.g. "PROOF_REQUIRED …".
 */
export const apiErrorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.message || fallback;

/**
 * Get delivery status label using the shared utility
 */
export const getDeliveryStatusLabel = (status) => {
  if (String(status || '').toLowerCase() === DELIVERY_STATUSES.REASSIGNED) return 'Reassigned to you';
  const statusInfo = getDeliveryStatus(status);
  return statusInfo.label;
};

/**
 * Get delivery status color class using the shared utility
 */
export const getDeliveryStatusColor = (status) => {
  const statusInfo = getDeliveryStatus(status);
  return statusInfo.tone;
};

/** Assignment statuses belong to the offer workflow, not delivery progress. */
export const getAssignmentStatusLabel = (status) => ({
  pending: 'Awaiting your response',
  accepted: 'Accepted',
  rejected: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled',
}[String(status || '').toLowerCase()] || status || 'Unknown');

/**
 * Get batch status label
 */
export const getBatchStatusLabel = (status) => {
  const labels = {
    [BATCH_STATUS.AVAILABLE]: 'Available',
    [BATCH_STATUS.ASSIGNED]: 'Assigned',
    [BATCH_STATUS.IN_PROGRESS]: 'In Progress',
    [BATCH_STATUS.COMPLETED]: 'Completed',
    [BATCH_STATUS.CANCELLED]: 'Cancelled',
    [BATCH_STATUS.REJECTED]: 'Rejected',
  };
  return labels[status] || status;
};

/**
 * Get batch status color class
 */
export const getBatchStatusColor = (status) => {
  const colors = {
    [BATCH_STATUS.AVAILABLE]: 'bg-blue-100 text-blue-700 border-blue-200',
    [BATCH_STATUS.ASSIGNED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [BATCH_STATUS.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
    [BATCH_STATUS.COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
    [BATCH_STATUS.CANCELLED]: 'bg-red-100 text-red-700 border-red-200',
    [BATCH_STATUS.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

/**
 * Delivery progress percentage, one entry per canonical delivery status.
 *
 * `assignments`/`reassigned` share a value: reassignment is the handover between
 * two riders, not forward progress, and the old 10-point "validated" /
 * "ready for pickup" rungs were states the service never produced — so the bar
 * could only ever jump over them.
 */
export const calculateDeliveryProgress = (status) => {
  const normalized = normalizeDeliveryStatus(status);
  const progressMap = {
    [DELIVERY_STATUSES.PENDING]: 0,
    [DELIVERY_STATUSES.ASSIGNED]: 20,
    [DELIVERY_STATUSES.REASSIGNED]: 20,
    [DELIVERY_STATUSES.PICKUP]: 45,
    [DELIVERY_STATUSES.IN_TRANSIT]: 75,
    [DELIVERY_STATUSES.DELIVERED]: 100,
    [DELIVERY_STATUSES.FAILED]: 0,
    [DELIVERY_STATUSES.CANCELLED]: 0,
  };
  return progressMap[normalized] ?? 0;
};

/**
 * Format delivery time relative to now
 */
export const formatDeliveryTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-ET', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format absolute date/time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-ET', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate estimated delivery time
 */
export const calculateEstimatedTime = (distance, averageSpeed = 30) => {
  // distance in km, averageSpeed in km/h
  if (!distance) return 'Unknown';
  const hours = distance / averageSpeed;
  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);
  
  if (hoursInt > 0) {
    return `${hoursInt}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format currency for display.
 *
 * Delegates to the shared formatter so every surface renders money the same
 * way. The delivery copy used its own `Intl.NumberFormat` implementation,
 * which produced a different string from the rest of the app.
 *
 * Re-exported through a local binding (not `export { x } from '...'`) so the
 * default export object below can reference it.
 */
export { formatCurrency };

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Generate a short reference ID from an ID
 */
export const shortReference = (id) => {
  if (!id) return '';
  return `#${String(id).slice(-8).toUpperCase()}`;
};

/**
 * Calculate batch completion percentage
 */
export const calculateBatchProgress = (assignments) => {
  if (!assignments || assignments.length === 0) return 0;
  const completed = assignments.filter(a => {
    const status = normalizeDeliveryStatus(a.status);
    return status === DELIVERY_STATUSES.DELIVERED;
  }).length;
  return Math.round((completed / assignments.length) * 100);
};

/**
 * Count assignments by status
 */
export const countByStatus = (assignments) => {
  if (!assignments) return {};
  return assignments.reduce((acc, assignment) => {
    const status = normalizeDeliveryStatus(assignment.status) || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

export default {
  DELIVERY_STATUSES,
  BATCH_STATUS,
  normalizeDeliveryStatus,
  getDeliveryStatus,
  isDeliveryFinal,
  formatDeliveryAddress,
  deliveryReference,
  apiErrorMessage,
  getDeliveryStatusLabel,
  getDeliveryStatusColor,
  getBatchStatusLabel,
  getBatchStatusColor,
  calculateDeliveryProgress,
  formatDeliveryTime,
  formatDateTime,
  calculateEstimatedTime,
  formatCurrency,
  formatPhoneNumber,
  shortReference,
  calculateBatchProgress,
  countByStatus,
};
