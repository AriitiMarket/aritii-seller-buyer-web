/**
 * Canonical order statuses + legal transitions.
 *
 * This is the frontend mirror of the ONE order state machine owned by the
 * Commerce Service (services/commerce-service/src/modules/orders/constants/
 * orderStatuses.js). Keep both in sync — the backend rejects any transition it
 * does not allow, so offering an illegal option here only produces a 400.
 *
 * Orders created by older code paths still carry 'PENDING' / 'CONFIRMED' /
 * 'CANCELLED' (uppercase) and the buyer app used to write 'Processing refund'.
 * None of those are canonical, so ALWAYS compare through normalizeStatus() —
 * otherwise a legacy order looks like it is in a final state and its seller
 * cannot accept it.
 */
export const ORDER_STATUSES = Object.freeze({
  PROCESSING: 'Processing',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUND_REQUESTED: 'Refund Requested',
  REFUND_APPROVED: 'Refund Approved',
  REFUND_SUCCESS: 'Refund Success',
  REFUND_REJECTED: 'Refund Rejected',
});

/** FROM status -> the statuses the backend will accept next. */
export const ALLOWED_TRANSITIONS = Object.freeze({
  [ORDER_STATUSES.PROCESSING]: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.SHIPPED]: [ORDER_STATUSES.IN_TRANSIT],
  [ORDER_STATUSES.IN_TRANSIT]: [ORDER_STATUSES.DELIVERED],
  [ORDER_STATUSES.DELIVERED]: [ORDER_STATUSES.REFUND_REQUESTED],
  [ORDER_STATUSES.CANCELLED]: [],
  [ORDER_STATUSES.REFUND_REQUESTED]: [ORDER_STATUSES.REFUND_APPROVED, ORDER_STATUSES.REFUND_REJECTED],
  [ORDER_STATUSES.REFUND_APPROVED]: [ORDER_STATUSES.REFUND_SUCCESS],
  [ORDER_STATUSES.REFUND_SUCCESS]: [],
  [ORDER_STATUSES.REFUND_REJECTED]: [ORDER_STATUSES.REFUND_REQUESTED],
});

export const REFUND_STATUSES = Object.freeze([
  ORDER_STATUSES.REFUND_REQUESTED,
  ORDER_STATUSES.REFUND_APPROVED,
  ORDER_STATUSES.REFUND_SUCCESS,
  ORDER_STATUSES.REFUND_REJECTED,
]);

const STATUS_ALIASES = Object.freeze({
  PENDING: ORDER_STATUSES.PROCESSING,
  NEW: ORDER_STATUSES.PROCESSING,
  ORDERED: ORDER_STATUSES.PROCESSING,
  CONFIRMED: ORDER_STATUSES.CONFIRMED,
  ACCEPTED: ORDER_STATUSES.CONFIRMED,
  SHIPPED: ORDER_STATUSES.SHIPPED,
  'OUT FOR DELIVERY': ORDER_STATUSES.IN_TRANSIT,
  'ON THE WAY': ORDER_STATUSES.IN_TRANSIT,
  'IN TRANSIT': ORDER_STATUSES.IN_TRANSIT,
  DELIVERED: ORDER_STATUSES.DELIVERED,
  COMPLETED: ORDER_STATUSES.DELIVERED,
  SUCCEEDED: ORDER_STATUSES.DELIVERED,
  RECEIVED: ORDER_STATUSES.DELIVERED,
  CANCELLED: ORDER_STATUSES.CANCELLED,
  CANCELED: ORDER_STATUSES.CANCELLED,
  'PROCESSING REFUND': ORDER_STATUSES.REFUND_REQUESTED,
  'REFUND REQUEST': ORDER_STATUSES.REFUND_REQUESTED,
  'REFUND REQUESTED': ORDER_STATUSES.REFUND_REQUESTED,
  'REFUND APPROVED': ORDER_STATUSES.REFUND_APPROVED,
  'REFUND SUCCESS': ORDER_STATUSES.REFUND_SUCCESS,
  'REFUND SUCCESSFUL': ORDER_STATUSES.REFUND_SUCCESS,
  REFUNDED: ORDER_STATUSES.REFUND_SUCCESS,
  'REFUND REJECTED': ORDER_STATUSES.REFUND_REJECTED,
});

const CANONICAL_VALUES = Object.values(ORDER_STATUSES);

/** Map a stored/requested status onto a canonical status when possible. */
export function normalizeStatus(status) {
  if (status === null || status === undefined) return status;
  const raw = String(status).trim();
  if (!raw) return raw;
  if (CANONICAL_VALUES.includes(raw)) return raw;
  const upper = raw.toUpperCase();
  if (STATUS_ALIASES[upper]) return STATUS_ALIASES[upper];
  const titleCased = upper
    .split(/\s+/)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
  return CANONICAL_VALUES.includes(titleCased) ? titleCased : raw;
}

/** Next statuses the backend will accept for a (possibly legacy) status. */
export function nextStatusesFor(status) {
  return ALLOWED_TRANSITIONS[normalizeStatus(status)] || [];
}

export function isRefundStatus(status) {
  return REFUND_STATUSES.includes(normalizeStatus(status));
}

export function canTransition(from, to) {
  const target = normalizeStatus(to);
  if (!target || !CANONICAL_VALUES.includes(target)) return false;
  return nextStatusesFor(from).includes(target);
}

export default { ORDER_STATUSES, ALLOWED_TRANSITIONS, normalizeStatus, nextStatusesFor };
