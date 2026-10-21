/**
 * Product Requests — the single source of truth for the request domain.
 *
 * Every status, tab group, label, colour and small helper used by the buyer
 * and the seller request surfaces lives here. Pages must never re-declare
 * their own status maps, so extending the module later is a local change:
 *
 *   - new status        → REQUEST_STATUSES + STATUS_LABELS + STATUS_COLORS
 *                         (+ one tab in BUYER_TABS / SELLER_TABS if it needs
 *                         its own stage)
 *   - new stage/tab     → append to BUYER_TABS or SELLER_TABS
 *   - new filter        → DATE_FILTERS / requestMatchesSearch below
 *   - structured field  → SPEC_LABELS (requirements) / AGREEMENT_* (final deal)
 *
 * Deliberately NOT implemented yet (kept as stable extension points):
 * saved sellers, request templates, multi-item requests, request expiry UX,
 * notifications, analytics, disputes beyond reporting.
 */

/* ---------------------------------------------------------------- statuses */

export const REQUEST_STATUSES = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  NEGOTIATING: 'NEGOTIATING',
  AGREED: 'AGREED',
  CONVERTED: 'CONVERTED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const OPEN_STATUSES = [
  REQUEST_STATUSES.PENDING,
  REQUEST_STATUSES.REVIEWING,
  REQUEST_STATUSES.NEGOTIATING,
];

/** Buyer can still cancel from these stages. */
export const CANCELLABLE_STATUSES = [...OPEN_STATUSES, REQUEST_STATUSES.AGREED];

export const CLOSED_STATUSES = [
  REQUEST_STATUSES.DECLINED,
  REQUEST_STATUSES.CANCELLED,
  REQUEST_STATUSES.EXPIRED,
];

/**
 * Role-neutral status labels (pills, filters). Stage tabs carry their own
 * role wording — buyers see "Waiting for Seller", sellers see "Reviewing" —
 * so the two sides never share a confusing label.
 */
export const STATUS_LABELS = {
  PENDING: 'New',
  REVIEWING: 'In Review',
  NEGOTIATING: 'Negotiating',
  AGREED: 'Agreed',
  CONVERTED: 'Ordered',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  NEGOTIATING: 'bg-purple-100 text-purple-700',
  AGREED: 'bg-green-100 text-green-700',
  CONVERTED: 'bg-brand-primary/15 text-brand-primary-dark',
  DECLINED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  EXPIRED: 'bg-orange-100 text-orange-700',
};

export const OFFER_STATUS_LABELS = {
  ACTIVE: 'Active',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  SUPERSEDED: 'Superseded',
};

export const OFFER_STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  DECLINED: 'bg-red-100 text-red-700',
  SUPERSEDED: 'bg-gray-100 text-gray-500',
};

/* -------------------------------------------------------------------- tabs */

/** Buyer stages, in workflow order. `statuses: null` means "everything". */
export const BUYER_TABS = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'new', label: 'New', statuses: [REQUEST_STATUSES.PENDING] },
  { id: 'waiting', label: 'Waiting for Seller', statuses: [REQUEST_STATUSES.REVIEWING] },
  { id: 'negotiating', label: 'Negotiating', statuses: [REQUEST_STATUSES.NEGOTIATING] },
  { id: 'agreed', label: 'Agreed', statuses: [REQUEST_STATUSES.AGREED] },
  { id: 'ordered', label: 'Ordered', statuses: [REQUEST_STATUSES.CONVERTED] },
  {
    id: 'closed',
    label: 'Closed',
    statuses: [REQUEST_STATUSES.DECLINED, REQUEST_STATUSES.CANCELLED, REQUEST_STATUSES.EXPIRED],
  },
];

/** Seller stages, in workflow order. */
export const SELLER_TABS = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'new', label: 'New', statuses: [REQUEST_STATUSES.PENDING] },
  { id: 'reviewing', label: 'Reviewing', statuses: [REQUEST_STATUSES.REVIEWING] },
  { id: 'negotiating', label: 'Negotiating', statuses: [REQUEST_STATUSES.NEGOTIATING] },
  { id: 'agreed', label: 'Agreed', statuses: [REQUEST_STATUSES.AGREED] },
  { id: 'ordered', label: 'Ordered', statuses: [REQUEST_STATUSES.CONVERTED] },
  {
    id: 'closed',
    label: 'Closed',
    statuses: [REQUEST_STATUSES.DECLINED, REQUEST_STATUSES.CANCELLED, REQUEST_STATUSES.EXPIRED],
  },
];

/** Workspace tabs shared by the buyer and the seller detail views. */
export const WORKSPACE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'offers', label: 'Offers' },
  { id: 'agreement', label: 'Agreement' },
  { id: 'activity', label: 'Activity' },
];

/* ------------------------------------------------- structured requirements */

/**
 * Structured requirement keys — deliberately open: the buyer fills whatever
 * matters for this product, the seller quotes against the same list.
 * `required` marks the rows the New Request form renders first.
 */
export const SPEC_LABELS = [
  { key: 'quality', label: 'Quality / grade' },
  { key: 'brand', label: 'Brand' },
  { key: 'size', label: 'Size / dimensions' },
  { key: 'color', label: 'Colour' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'notes', label: 'Other requirements' },
];

/** Common units offered in the quantity/unit pickers (free text still allowed). */
export const UNIT_OPTIONS = [
  'Piece',
  'Pieces',
  'Dozen',
  'Pair',
  'Set',
  'Box',
  'Bag',
  'Kg',
  'Gram',
  'Litre',
  'Metre',
  'Roll',
  'Pallet',
];

/* ---------------------------------------------------------------- agreement */

export const AGREEMENT_LABELS = {
  buyer: 'Buyer confirmation',
  seller: 'Seller confirmation',
};

/** "10 Piece × 500 = 5,000" — the one-liner used by cards and timelines. */
export function termsLabel(terms) {
  if (!terms) return '';
  const unit = terms.unit ? ` ${terms.unit}` : '';
  return `${terms.quantity}${unit} × ${terms.unitPrice} = ${terms.totalPrice}`;
}

/* ----------------------------------------------------------------- filters */

export const STATUS_FILTER_OPTIONS = [
  { id: '', label: 'Any status' },
  ...Object.values(REQUEST_STATUSES).map((status) => ({
    id: status,
    label: STATUS_LABELS[status] || status,
  })),
];

export const DATE_FILTERS = [
  { id: 'any', label: 'Any date' },
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
];

/* ---------------------------------------------------------------- helpers */

/** Human request code, e.g. `REQ-4F2A`. */
export function requestCode(id) {
  const raw = String(id || '');
  return `REQ-${raw.slice(-4).toUpperCase() || 'NEW'}`;
}

/** Status of a request, uppercased and safe against missing data. */
export function statusOf(request) {
  return String(request?.status || '').toUpperCase();
}

/** Does a request belong to a tab? (`statuses: null` matches everything.) */
export function tabMatches(tab, request) {
  if (!tab) return true;
  if (!tab.statuses) return true;
  return tab.statuses.includes(statusOf(request));
}

/** Per-tab counters for the tab strip. */
export function countByTab(tabs, requests = []) {
  const counts = {};
  for (const tab of tabs) {
    counts[tab.id] = requests.filter((request) => tabMatches(tab, request)).length;
  }
  return counts;
}

/** Free-text search across the fields a buyer/seller actually recognises. */
export function requestMatchesSearch(request, term) {
  const query = String(term || '').trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    request?.title,
    request?.subject,
    request?.details,
    request?.buyer?.name,
    request?.buyer?.email,
    requestCode(request?._id),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

/** Date-range filter (`DATE_FILTERS` ids). Accepts null for "any". */
export function requestWithinDate(request, rangeId) {
  if (!rangeId || rangeId === 'any') return true;
  const value = request?.updatedAt || request?.createdAt;
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (rangeId === 'today') return date.toDateString() === now.toDateString();
  const days = Number(String(rangeId).replace('d', ''));
  if (!Number.isFinite(days) || days <= 0) return true;
  return now.getTime() - date.getTime() <= days * 24 * 60 * 60 * 1000;
}

/** Comma-joined public location of a shop (never ids/coordinates). */
export function shopLocation(shop) {
  const snapshot = shop?.locationSnapshot || {};
  return [snapshot.cityName, snapshot.areaName, snapshot.regionName, shop?.address]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .filter((part, index, all) => all.indexOf(part) === index)
    .join(', ');
}

/**
 * Verification chip for a seller card. The marketplace only publishes
 * APPROVED/ACTIVE shops, so a publicly listed shop is "Approved"; an explicit
 * verification flag (when the API starts sending one) wins.
 */
export function shopVerification(shop) {
  if (!shop) return null;
  if (shop.isVerified || shop.verified || shop.verificationStatus) {
    return { label: 'Verified', tone: 'bg-brand-primary text-white' };
  }
  const status = String(shop.status || '').toUpperCase();
  if (status === 'APPROVED' || status === 'ACTIVE') {
    return { label: 'Approved', tone: 'bg-brand-primary-light text-brand-primary-dark' };
  }
  if (status === 'SUSPENDED' || status === 'INACTIVE') {
    return { label: 'Unavailable', tone: 'bg-gray-100 text-gray-500' };
  }
  // Public listings are admin-vetted before they appear.
  return { label: 'Approved', tone: 'bg-brand-primary-light text-brand-primary-dark' };
}

/** Business status shown on the seller profile. */
export function shopStatusLabel(shop) {
  const status = String(shop?.status || '').toUpperCase();
  const map = {
    ACTIVE: 'Open for requests',
    APPROVED: 'Open for requests',
    PENDING_APPROVAL: 'Pending approval',
    SUSPENDED: 'Suspended',
    INACTIVE: 'Inactive',
  };
  return map[status] || 'Open for requests';
}

/** Total of an offer, with a safe fallback when the API omits it. */
export function offerTotal(offer) {
  if (!offer) return null;
  if (offer.totalPrice != null) return Number(offer.totalPrice);
  const quantity = Number(offer.quantity) || 0;
  const unitPrice = Number(offer.unitPrice) || 0;
  return quantity * unitPrice;
}

/** Unit of measure with a neutral fallback (`Piece` is the platform default). */
export function unitOf(request, offer = null) {
  const unit = offer?.unit || request?.unit || 'Unit';
  return String(unit).trim() || 'Unit';
}

/** "50 Piece" — quantity + unit, never a bare number. */
export function quantityLabel(quantity, unit) {
  const suffix = unit ? ` ${unit}` : '';
  return `${quantity ?? '—'}${suffix}`;
}

/** The seller's live quote (or the accepted one once agreed). */
export function activeOfferOf(request) {
  const offers = request?.offers || [];
  return offers.find((offer) => offer.status === 'ACTIVE') || null;
}

/** The quote both sides signed off on. */
export function acceptedOfferOf(request) {
  const offers = request?.offers || [];
  return offers.find((offer) => offer.status === 'ACCEPTED') || null;
}

/** Best offer to show as "current": live first, accepted second. */
export function currentOfferOf(request) {
  return activeOfferOf(request) || acceptedOfferOf(request) || null;
}

/** Agreement confirmation state (never null — defaults to "not confirmed"). */
export function agreementOf(request) {
  const value = request?.agreement;
  return value && typeof value === 'object' ? value : {};
}

/** Has BOTH sides confirmed? Only then may an order be created. */
export function isAgreementConfirmed(request) {
  return Boolean(agreementOf(request).confirmedAt);
}

/** Final agreed price (the accepted offer), or null while negotiating. */
export function finalAgreedPrice(request) {
  const offer = acceptedOfferOf(request) || (isAgreementConfirmed(request) ? activeOfferOf(request) : null);
  return offer ? offerTotal(offer) : null;
}

/** Current live offer total (null before the first quote). */
export function currentOfferPrice(request) {
  const offer = currentOfferOf(request);
  return offer ? offerTotal(offer) : null;
}

/**
 * Non-empty structured requirements as `[{label, value}]`, ready to render.
 * Unknown keys are surfaced with a humanised label rather than dropped.
 */
export function specEntries(specs) {
  if (!specs || typeof specs !== 'object') return [];
  const known = SPEC_LABELS.map(({ key, label }) => ({ key, label }));
  const extra = Object.keys(specs)
    .filter((key) => !known.some((entry) => entry.key === key))
    .map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/[_-]+/g, ' '),
    }));
  return [...known, ...extra]
    .map((entry) => ({ ...entry, value: String(specs[entry.key] ?? '').trim() }))
    .filter((entry) => entry.value);
}

/**
 * Diff line for a counter-offer: what it replaces vs what it proposes.
 * `Previous: 10 × 500 = 5,000` / `New: 10 × 450 = 4,500`.
 */
export function offerDiff(offer) {
  const previous = offer?.previous;
  if (!previous) return null;
  const changes = [];
  if (Number(previous.quantity) !== Number(offer.quantity)) changes.push('quantity');
  if (Number(previous.unitPrice) !== Number(offer.unitPrice)) changes.push('unit price');
  if (previous.unit && offer.unit && String(previous.unit) !== String(offer.unit)) changes.push('unit');
  if ((previous.productId || '') !== (offer.productId || '')) changes.push('product');
  if (!changes.length) return null;
  const previousTotal = previous.totalPrice != null
    ? Number(previous.totalPrice)
    : Number(previous.quantity || 0) * Number(previous.unitPrice || 0);
  return {
    changes,
    previous: {
      quantity: previous.quantity,
      unit: previous.unit || '',
      unitPrice: previous.unitPrice,
      totalPrice: previousTotal,
    },
    next: {
      quantity: offer.quantity,
      unit: offer.unit || '',
      unitPrice: offer.unitPrice,
      totalPrice: offerTotal(offer),
    },
  };
}

/**
 * Human wording for a realtime event, used only when the event came from the
 * OTHER side (`event.actorId !== myId`), so your own actions are never
 * announced twice. `null` means "nothing worth saying".
 */
export function realtimeNotice(event) {
  const type = event?.type;
  if (!type) return null;
  switch (type) {
    case 'request.created':
      return 'A new product request just arrived.';
    case 'request.message.created':
      return 'New message in the discussion.';
    case 'request.offer.created':
      return 'A new offer arrived.';
    case 'request.offer.updated':
      return 'The offer was updated.';
    case 'request.offer.accepted':
      return 'The offer was accepted — the request is agreed.';
    case 'request.offer.declined':
      return 'The offer was declined.';
    case 'request.agreement.confirmation':
      return 'The other side confirmed the agreement.';
    case 'request.agreement.confirmed':
      return 'The agreement is confirmed — an order can now be created.';
    case 'request.reported':
      return 'This request was reported to the platform.';
    case 'request.moderation.changed':
      return 'The platform updated this request.';
    case 'request.attachment.removed':
      return 'An attachment was removed by the platform.';
    case 'request.status.changed': {
      const status = String(event.data?.status || '').toUpperCase();
      const map = {
        REVIEWING: 'The seller started reviewing this request.',
        NEGOTIATING: 'Negotiation started.',
        AGREED: 'Both sides agreed on the offer.',
        CONVERTED: 'The order was created from this agreement.',
        DECLINED: 'The request was declined.',
        CANCELLED: 'The request was cancelled.',
        EXPIRED: 'The request expired.',
      };
      return map[status] || 'This request was updated.';
    }
    default:
      return null;
  }
}

/** Stable toast key so duplicate delivery of one socket event only pops once. */
export function realtimeToastId(event) {
  if (!event?.type || !event?.requestId || !event?.at) return undefined;
  return `request:${event.type}:${event.requestId}:${event.at}`;
}
