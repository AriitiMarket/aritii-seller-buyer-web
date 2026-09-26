import React from 'react';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { offerTotal, requestCode, statusOf } from '../constants';
import { FiCircle } from 'react-icons/fi';

/** Human titles for the server-side activity types (`request.activity`). */
const ACTIVITY_TITLES = {
  'request.created': 'Request created',
  'request.reviewed': 'Seller opened the request',
  'request.accepted': 'Request accepted',
  'message.sent': 'Message sent',
  'message.replied': 'Reply sent',
  'offer.created': 'Offer sent',
  'offer.counter': 'Counter-offer sent',
  'offer.price_changed': 'Unit price changed',
  'offer.quantity_changed': 'Quantity changed',
  'offer.accepted': 'Offer accepted',
  'offer.declined': 'Offer declined',
  'agreement.confirmation': 'Agreement confirmed by one side',
  'agreement.confirmed': 'Agreement confirmed',
  'order.created': 'Order created',
  'request.cancelled': 'Request cancelled',
  'request.declined': 'Request declined',
  'request.reported': 'Request reported',
  'admin.closed': 'Closed by the platform',
  'admin.suspended': 'Suspended by the platform',
  'admin.restored': 'Restored by the platform',
  'admin.attachment_removed': 'Attachment removed',
  'admin.report_reviewed': 'Report reviewed',
};

/**
 * Timeline of a request.
 *
 * Preferred source is the server's own `request.activity` log — every write
 * appends a truthful, timestamped entry there. Older API responses (or a
 * deployment without the log) fall back to events derived from the data the
 * API already returns (timestamps, offers, status).
 */
function eventsFromLog(request) {
  const log = Array.isArray(request?.activity) ? request.activity : [];
  return log
    .map((entry, index) => ({
      id: entry._id || `log-${index}`,
      at: entry.createdAt,
      title: ACTIVITY_TITLES[entry.type] || String(entry.type || 'Updated').replace(/[._]+/g, ' '),
      description: entry.summary || '',
      data: entry.data || null,
      actorRole: entry.actorRole || null,
    }))
    .filter((event) => event.at);
}

function buildDerivedEvents(request) {
  if (!request) return [];
  const status = statusOf(request);
  const events = [];

  events.push({
    id: 'created',
    at: request.createdAt,
    title: 'Request created',
    description: `${requestCode(request._id)} was sent${
      request.shopId ? ' to the selected seller' : ' to the marketplace'
    }.`,
  });

  if (request.respondedAt) {
    events.push({
      id: 'responded',
      at: request.respondedAt,
      title: 'Seller responded',
      description: request.response || 'The seller replied to the request.',
    });
  }

  (request.offers || []).forEach((offer, index) => {
    events.push({
      id: `offer-${offer._id || index}`,
      at: offer.createdAt,
      title: 'Offer sent',
      description: `${offer.quantity}${offer.unit ? ` ${offer.unit}` : ''} × ${formatCurrency(
        offer.unitPrice
      )} = ${formatCurrency(offerTotal(offer))}${offer.productName ? ` · ${offer.productName}` : ''}`,
    });
    if (String(offer.status).toUpperCase() === 'ACCEPTED') {
      events.push({
        id: `accepted-${offer._id || index}`,
        at: request.updatedAt || offer.createdAt,
        title: 'Agreement reached',
        description: 'The buyer accepted the offer. The terms are now agreed.',
      });
    }
  });

  if (status === 'CONVERTED') {
    events.push({
      id: 'converted',
      at: request.updatedAt,
      title: 'Order created',
      description: request.orderId
        ? `Order #${String(request.orderId).slice(-6).toUpperCase()} was created from this agreement.`
        : 'An order was created from this agreement.',
    });
  }

  if (['DECLINED', 'CANCELLED', 'EXPIRED'].includes(status)) {
    events.push({
      id: 'closed',
      at: request.updatedAt,
      title: 'Request closed',
      description: `Status changed to ${status.toLowerCase()}.`,
    });
  }

  return events.filter((event) => event.at);
}

const ActivityTimeline = ({ request }) => {
  const logged = eventsFromLog(request);
  const events = (logged.length ? logged : buildDerivedEvents(request))
    .slice()
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  if (events.length === 0) {
    return <p className="text-sm text-gray-500">No activity recorded yet.</p>;
  }

  return (
    <ol className="relative space-y-5 pl-5 border-l border-gray-200">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-brand-primary border-2 border-white shadow" />
          <p className="text-sm font-semibold text-gray-900">{event.title}</p>
          {event.description ? (
            <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
          ) : null}
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <FiCircle size={8} className="opacity-50" />
              {formatDateTime(event.at)}
            </span>
            {event.actorRole ? (
              <span className="uppercase tracking-wide">{event.actorRole}</span>
            ) : null}
          </p>
        </li>
      ))}
    </ol>
  );
};

export default ActivityTimeline;
