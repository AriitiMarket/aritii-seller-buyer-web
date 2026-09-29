import React from 'react';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { normalizeActorRole } from '@/shared/utils/actorWorkspaces';
import {
  OFFER_STATUS_COLORS,
  OFFER_STATUS_LABELS,
  offerDiff,
  offerTotal,
} from '../constants';

const DiffRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

/**
 * One offer or counter-offer, rendered identically in the buyer's Offers tab,
 * the seller's Offers tab and (compact) inside the discussion thread. Actions
 * live in the parent — they differ per role.
 *
 * When the offer counters a previous one it shows exactly what changed:
 * `Previous: 10 × 500 = 5,000` → `New: 10 × 450 = 4,500`.
 */
const OfferCard = ({ offer, highlighted = false, compact = false }) => {
  if (!offer) return null;
  const status = String(offer.status || '').toUpperCase();
  const diff = offerDiff(offer);
  const party = normalizeActorRole(offer.createdByRole) === 'BUYER' ? 'Buyer counter' : 'Seller offer';
  const tone = highlighted
    ? 'border-brand-primary bg-brand-primary-light/40'
    : status === 'ACCEPTED'
    ? 'border-green-200 bg-green-50'
    : status === 'ACTIVE'
    ? 'border-brand-primary/30 bg-white'
    : 'border-gray-100 bg-gray-50';

  return (
    <div className={`rounded-lg border p-3.5 text-sm ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {offer.productName || 'Requested item'}
          </p>
          <p className="text-gray-600 mt-0.5">
            {offer.quantity}
            {offer.unit ? ` ${offer.unit}` : ''} &times; {formatCurrency(offer.unitPrice)} ={' '}
            <span className="font-semibold text-brand-primary-dark">
              {formatCurrency(offerTotal(offer))}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
              OFFER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'
            }`}
          >
            {OFFER_STATUS_LABELS[status] || status}
          </span>
          <span className="text-[10px] text-gray-400 whitespace-nowrap">{party}</span>
        </div>
      </div>

      {diff && !compact && (
        <div className="mt-2.5 rounded-md border border-amber-200 bg-amber-50 p-2.5 space-y-1">
          <p className="text-[11px] font-semibold text-amber-700">
            Changed: {diff.changes.join(', ')}
          </p>
          <DiffRow
            label="Previous"
            value={`${diff.previous.quantity}${
              diff.previous.unit ? ` ${diff.previous.unit}` : ''
            } × ${formatCurrency(diff.previous.unitPrice)} = ${formatCurrency(
              diff.previous.totalPrice
            )}`}
          />
          <DiffRow
            label="New"
            value={`${diff.next.quantity}${
              diff.next.unit ? ` ${diff.next.unit}` : ''
            } × ${formatCurrency(diff.next.unitPrice)} = ${formatCurrency(diff.next.totalPrice)}`}
          />
        </div>
      )}

      {offer.note ? <p className="text-gray-600 mt-2 whitespace-pre-wrap">{offer.note}</p> : null}
      <p className="text-[10px] text-gray-400 mt-2 flex flex-wrap gap-x-3">
        <span>{formatDateTime(offer.createdAt)}</span>
        {offer.validUntil ? <span>Valid until {formatDateTime(offer.validUntil)}</span> : null}
      </p>
    </div>
  );
};

export default OfferCard;
