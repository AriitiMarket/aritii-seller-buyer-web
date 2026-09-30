/**
 * Canonical DELIVERY statuses + display metadata.
 *
 * This is the frontend mirror of the delivery state machine owned by the
 * Delivery Service (services/delivery-service/src/modules/deliveries/models/
 * Delivery.js) and re-published by Commerce on the ORDER ↔ DELIVERY bridge
 * (services/commerce-service/src/modules/orders/models/OrderDeliveries.js).
 * Keep the three in sync — the bridge stores exactly these values.
 *
 * The bridge also stores `null` while a shipment exists but no provider has
 * reported a status yet: that is "waiting for a courier", not "unknown", so it
 * must read as a normal in-progress step rather than an error.
 *
 * Delivery status is NOT the order status: the order moves through
 * Processing → Confirmed → Shipped → In Transit → Delivered (see
 * shared/utils/orderStatus.js), and delivery events are what push it forward.
 */

export const DELIVERY_STATUSES = Object.freeze({
  PENDING: 'pending',
  VALIDATED: 'validated',
  READY_FOR_PICKUP: 'ready_for_pickup',
  ASSIGNED: 'assigned',
  REASSIGNED: 'reassigned',
  PICKUP: 'pickup',
  IN_TRANSIT: 'in_transit',
  ARRIVED_AT_HUB: 'arrived_at_hub',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
});

const STATUS_META = Object.freeze({
  pending: { label: 'Waiting for a courier', tone: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  validated: { label: 'Delivery validated', tone: 'bg-teal-100 text-teal-700 border-teal-200' },
  ready_for_pickup: { label: 'Ready for pickup', tone: 'bg-lime-100 text-lime-700 border-lime-200' },
  assigned: { label: 'Courier assigned', tone: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  reassigned: { label: 'Reassigning a courier', tone: 'bg-gray-100 text-gray-700 border-gray-200' },
  pickup: { label: 'Picked up from the shop', tone: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_transit: { label: 'On the way to you', tone: 'bg-blue-100 text-blue-700 border-blue-200' },
  arrived_at_hub: { label: 'Arrived at the hub', tone: 'bg-sky-100 text-sky-700 border-sky-200' },
  out_for_delivery: { label: 'Out for delivery', tone: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Delivered', tone: 'bg-green-100 text-green-700 border-green-200' },
  failed: { label: 'Delivery failed', tone: 'bg-red-100 text-red-700 border-red-200' },
  cancelled: { label: 'Delivery cancelled', tone: 'bg-red-100 text-red-700 border-red-200' },
  return_requested: { label: 'Return requested', tone: 'bg-orange-100 text-orange-700 border-orange-200' },
  returned: { label: 'Returned', tone: 'bg-slate-200 text-slate-700 border-slate-300' },
});

const DEFAULT_META = Object.freeze({
  label: 'Delivery in progress',
  tone: 'bg-gray-100 text-gray-700 border-gray-200',
});

/** Values other services have used for the same step, folded onto canonical. */
const ALIASES = Object.freeze({
  PENDING: DELIVERY_STATUSES.PENDING,
  NEW: DELIVERY_STATUSES.PENDING,
  REQUESTED: DELIVERY_STATUSES.PENDING,
  VALIDATED: DELIVERY_STATUSES.VALIDATED,
  READY_FOR_PICKUP: DELIVERY_STATUSES.READY_FOR_PICKUP,
  READY: DELIVERY_STATUSES.READY_FOR_PICKUP,
  ASSIGNED: DELIVERY_STATUSES.ASSIGNED,
  ACCEPTED: DELIVERY_STATUSES.ASSIGNED,
  REASSIGNED: DELIVERY_STATUSES.REASSIGNED,
  PICKUP: DELIVERY_STATUSES.PICKUP,
  'PICKED UP': DELIVERY_STATUSES.PICKUP,
  PICKED_UP: DELIVERY_STATUSES.PICKUP,
  COLLECTED: DELIVERY_STATUSES.PICKUP,
  'IN TRANSIT': DELIVERY_STATUSES.IN_TRANSIT,
  IN_TRANSIT: DELIVERY_STATUSES.IN_TRANSIT,
  TRANSIT: DELIVERY_STATUSES.IN_TRANSIT,
  ARRIVED_AT_HUB: DELIVERY_STATUSES.ARRIVED_AT_HUB,
  HUB: DELIVERY_STATUSES.ARRIVED_AT_HUB,
  'OUT FOR DELIVERY': DELIVERY_STATUSES.OUT_FOR_DELIVERY,
  OUT_FOR_DELIVERY: DELIVERY_STATUSES.OUT_FOR_DELIVERY,
  'ON THE WAY': DELIVERY_STATUSES.IN_TRANSIT,
  SHIPPED: DELIVERY_STATUSES.IN_TRANSIT,
  DELIVERED: DELIVERY_STATUSES.DELIVERED,
  COMPLETED: DELIVERY_STATUSES.DELIVERED,
  FAILED: DELIVERY_STATUSES.FAILED,
  CANCELLED: DELIVERY_STATUSES.CANCELLED,
  CANCELED: DELIVERY_STATUSES.CANCELLED,
  RETURN_REQUESTED: DELIVERY_STATUSES.RETURN_REQUESTED,
  'RETURN REQUESTED': DELIVERY_STATUSES.RETURN_REQUESTED,
  RETURNED: DELIVERY_STATUSES.RETURNED,
});

/** Fold any stored/legacy delivery status onto a canonical one (or null). */
export function normalizeDeliveryStatus(status) {
  if (status === null || status === undefined) return null;
  const raw = String(status).trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (ALIASES[upper]) return ALIASES[upper];
  return raw.toLowerCase();
}

/** Display metadata for a delivery status (never throws on unknown values). */
export function getDeliveryStatus(status) {
  const key = normalizeDeliveryStatus(status);
  const meta = key ? STATUS_META[key] : null;
  return {
    key,
    label: meta ? meta.label : DEFAULT_META.label,
    tone: meta ? meta.tone : DEFAULT_META.tone,
  };
}

/** A delivery that will not progress any further on its own. */
export function isDeliveryFinal(status) {
  const key = normalizeDeliveryStatus(status);
  return key === DELIVERY_STATUSES.DELIVERED
    || key === DELIVERY_STATUSES.FAILED
    || key === DELIVERY_STATUSES.CANCELLED
    || key === DELIVERY_STATUSES.RETURNED;
}

/**
 * Flatten any address shape the bridge may carry into one readable line.
 * The bridge snapshots whatever it was handed: the pickup comes from the
 * seller shipment (hierarchy names + addressDetail) and the destination from
 * the checkout address (fullAddress / address1 / ...).
 */
export function formatDeliveryAddress(address) {
  if (!address) return '';
  if (typeof address === 'string') return address;
  const parts = [
    address.shopName,
    address.addressDetail,
    address.fullAddress,
    address.address1,
    address.building,
    address.landmark,
    address.sectorName,
    address.areaName,
    address.cityName,
    address.regionName,
    address.city,
    address.state,
    address.country,
  ].filter((part) => part && String(part).trim());
  // De-duplicate: a snapshot often repeats the shop name and the street.
  return [...new Set(parts.map((part) => String(part).trim()))].join(', ');
}

/** Short, human-quotable reference for a delivery ("#a1b2c3d4"). */
export function deliveryReference(delivery) {
  if (!delivery) return '';
  const raw = delivery.deliveryId || delivery.deliveryRequestId || delivery.orderId;
  return raw ? `#${String(raw).slice(-8)}` : '';
}

/**
 * View model for the delivery panel: ONE place that decides what is shown for a
 * bridge row, so buyer and seller screens cannot drift apart.
 *
 * @param {object|null} delivery bridge row (see OrderDeliveries.js) or a
 *   delivery-service record (`GET /delivery/delivery/order/:orderId`)
 * @returns {{linked: boolean, status: string|null, statusLabel: string,
 *   statusTone: string, isFinal: boolean, reference: string,
 *   courierReference: string, courierName: string, lastUpdate: string|null,
 *   note: string, pickup: string, destination: string, itemCount: number,
 *   totalValue: number}}
 */
export function describeDelivery(delivery) {
  if (!delivery) {
    return {
      linked: false,
      status: null,
      statusLabel: 'Not handed to delivery yet',
      statusTone: 'bg-gray-100 text-gray-600 border-gray-200',
      isFinal: false,
      reference: '',
      courierReference: '',
      courierName: '',
      lastUpdate: null,
      note: '',
      pickup: '',
      destination: '',
      itemCount: 0,
      totalValue: 0,
    };
  }
  const status = getDeliveryStatus(delivery.status);
  return {
    linked: true,
    status: status.key,
    statusLabel: status.label,
    statusTone: status.tone,
    isFinal: isDeliveryFinal(delivery.status),
    reference: deliveryReference(delivery),
    // The courier's own id is what support asks for; shortened for display.
    courierReference: delivery.providerId ? `#${String(delivery.providerId).slice(-8)}` : '',
    // The enriched delivery-by-order read carries the provider's display name;
    // the raw id hash is only the fallback when it does not.
    courierName: delivery.provider?.name || delivery.providerName || '',
    lastUpdate: delivery.statusUpdatedAt || delivery.updatedAt || null,
    note: delivery.note || '',
    pickup: formatDeliveryAddress(delivery.pickupAddress),
    destination: formatDeliveryAddress(delivery.deliveryAddress || delivery.destinationAddress),
    itemCount: 0,
    totalValue: 0,
  };
}

/** Why an order has no shipment yet — shown instead of a blank panel. */
export function explainNoDelivery(orderStatus) {
  const status = String(orderStatus || '').toLowerCase();
  if (status.includes('cancel')) return 'This order was cancelled, so no delivery was booked.';
  if (status.includes('refund')) return 'This order is in a refund flow — delivery is not part of it.';
  if (status === 'processing') return 'The shop has not accepted this order yet. Delivery is requested once it is confirmed.';
  if (status === 'confirmed') return 'The order is confirmed and waiting to be handed to a courier.';
  if (status === 'delivered') return 'This order is marked delivered. Its delivery record is not available.';
  return 'Delivery is booked once the shop confirms the order.';
}

export default {
  DELIVERY_STATUSES,
  normalizeDeliveryStatus,
  getDeliveryStatus,
  isDeliveryFinal,
  formatDeliveryAddress,
  deliveryReference,
  describeDelivery,
  explainNoDelivery,
};

