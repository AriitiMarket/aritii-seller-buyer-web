import React from 'react';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import {
  acceptedOfferOf,
  agreementOf,
  currentOfferOf,
  isAgreementConfirmed,
  offerTotal,
  quantityLabel,
  requestCode,
  statusOf,
  unitOf,
} from '../constants';
import RequestStatusBadge from './RequestStatusBadge';

/**
 * Request header facts — the block both sides read first: code, parties,
 * product, quantity + unit, requested price, current offer, final agreed
 * price, status and dates. Shared verbatim by the buyer overview and the
 * seller overview so the two sides always look at the same numbers.
 */
const Field = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs text-gray-500">{label}</p>
    <div className="mt-0.5 text-sm font-medium text-gray-900 break-words">{children}</div>
  </div>
);

const RequestSummary = ({ request, buyerName, sellerName }) => {
  if (!request) return null;
  const status = statusOf(request);
  const currentOffer = currentOfferOf(request);
  const acceptedOffer = acceptedOfferOf(request);
  const agreement = agreementOf(request);
  const confirmed = isAgreementConfirmed(request);
  const unit = unitOf(request, currentOffer);

  const requestedPrice =
    request.targetPrice != null ? formatCurrency(request.targetPrice) : 'Not specified';
  const currentOfferPrice = currentOffer
    ? `${formatCurrency(offerTotal(currentOffer))} (${currentOffer.status === 'ACCEPTED' ? 'Accepted' : 'Live'})`
    : 'No offer yet';
  const agreedPrice = confirmed || status === 'CONVERTED'
    ? acceptedOffer
      ? formatCurrency(offerTotal(acceptedOffer))
      : agreement.terms?.totalPrice != null
      ? formatCurrency(agreement.terms.totalPrice)
      : 'Pending'
    : status === 'AGREED'
    ? 'Awaiting confirmation'
    : '—';

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-sm font-semibold text-gray-900">Request {requestCode(request._id)}</span>
        <RequestStatusBadge status={status} />
      </div>
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Request">#&nbsp;{requestCode(request._id)}</Field>
        <Field label="Requested product">
          {request.title || request.subject || 'Custom request'}
        </Field>
        <Field label="Quantity">
          {quantityLabel(request.quantity, unitOf(request, currentOffer))}
        </Field>
        <Field label="Requested price (target)">{requestedPrice}</Field>
        <Field label="Current offer">{currentOfferPrice}</Field>
        <Field label="Final agreed price">{agreedPrice}</Field>
        <Field label="Buyer">{buyerName || request.buyer?.name || 'A customer'}</Field>
        <Field label="Seller / brand">
          {sellerName || request.seller?.shopName || (request.shopId ? 'Selected seller' : 'Open to all sellers')}
        </Field>
        <Field label="Status">
          <span className="capitalize">{String(status).toLowerCase()}</span>
          {confirmed ? <span className="ml-2 text-green-600">· confirmed</span> : null}
        </Field>
        <Field label="Created">{formatDateTime(request.createdAt)}</Field>
        <Field label="Last updated">{formatDateTime(request.updatedAt)}</Field>
        {request.expiresAt ? (
          <Field label="Expires">{formatDateTime(request.expiresAt)}</Field>
        ) : null}
      </div>
    </div>
  );
};

export default RequestSummary;
