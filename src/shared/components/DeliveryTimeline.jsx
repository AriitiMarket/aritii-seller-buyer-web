import React, { useMemo } from 'react';
import { BsCheckCircle, BsCircle, BsExclamationCircle } from 'react-icons/bs';
import { DELIVERY_STATUSES, normalizeDeliveryStatus } from '@/shared/utils/deliveryStatus';
import { formatDateTime } from '@/shared/utils/format';

/**
 * DeliveryTimeline — the parcel's real journey, from the Delivery Service's
 * own milestone history.
 *
 * The steps are the canonical lifecycle (shared/utils/deliveryStatus.js is the
 * mirror of the backend state machine), and each one is marked done only when
 * the delivery's history actually contains it. Nothing here is invented: a
 * step with no timestamp is simply "not yet".
 */
const STEPS = [
  { status: DELIVERY_STATUSES.PENDING, label: 'Order placed', hint: 'The order is in the delivery queue.' },
  { status: DELIVERY_STATUSES.ASSIGNED, label: 'Provider assigned', hint: 'A rider has taken the delivery.' },
  { status: DELIVERY_STATUSES.PICKUP, label: 'Picked up from the shop', hint: 'The parcel is with the rider.' },
  { status: DELIVERY_STATUSES.IN_TRANSIT, label: 'On the way to you', hint: 'The rider is heading to your address.' },
  { status: DELIVERY_STATUSES.DELIVERED, label: 'Delivered', hint: 'The parcel reached its destination.' },
];

/** The order of the canonical statuses, so "done" means "and everything before it". */
const STEP_ORDER = STEPS.map((step) => step.status);

const TERMINAL_LABELS = {
  failed: 'Delivery failed',
  cancelled: 'Delivery cancelled',
};

export default function DeliveryTimeline({ timeline = [], trackingEvents = [], status, className = '' }) {
  const current = normalizeDeliveryStatus(status);

  /** timestamp per canonical status, taken from the delivery's own history */
  const reached = useMemo(() => {
    const map = new Map();
    for (const entry of timeline || []) {
      const key = normalizeDeliveryStatus(entry.status || entry.stage);
      if (!key) continue;
      const timestamp = entry.timestamp || null;
      const previous = map.get(key);
      if (!previous || (timestamp && new Date(timestamp) < new Date(previous))) {
        map.set(key, timestamp);
      }
    }
    return map;
  }, [timeline]);

  /** The most recent note the provider left, if any. */
  const latestNote = useMemo(() => {
    const events = (trackingEvents || []).filter((event) => event.note);
    if (!events.length) return '';
    const latest = events.reduce((best, event) => {
      if (!best) return event;
      return new Date(event.timestamp || 0) > new Date(best.timestamp || 0) ? event : best;
    }, null);
    return latest?.note || '';
  }, [trackingEvents]);

  if (!timeline || !timeline.length) return null;

  const currentIndex = STEP_ORDER.indexOf(current);
  const isTerminalProblem = current === DELIVERY_STATUSES.FAILED || current === DELIVERY_STATUSES.CANCELLED;

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-900">Delivery progress</h3>
      <ol className="mt-3 space-y-0">
        {STEPS.map((step, index) => {
          const timestamp = reached.get(step.status);
          const done = Boolean(timestamp);
          // A step the delivery has already moved past counts as done even if
          // the history has no explicit timestamp for it.
          const passed = currentIndex > index;
          const isCurrent = current === step.status;
          const marker = done || passed ? (
            <BsCheckCircle className="text-green-600" size={18} />
          ) : (
            <BsCircle className="text-gray-300" size={18} />
          );
          return (
            <li key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                {marker}
                {index < STEPS.length - 1 && (
                  <span className={`w-0.5 flex-1 min-h-[20px] ${done || passed ? 'bg-green-200' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-brand-primary-dark' : done || passed ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                  {isCurrent && <span className="ml-2 text-xs font-normal text-gray-500">(current step)</span>}
                </p>
                <p className="text-xs text-gray-500">
                  {timestamp ? formatDateTime(timestamp) : isCurrent ? step.hint : 'Waiting'}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {isTerminalProblem && (
        <div className="mt-1 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          <BsExclamationCircle className="mt-0.5 shrink-0" size={16} />
          <span>{TERMINAL_LABELS[current]}</span>
        </div>
      )}

      {latestNote && (
        <p className="mt-2 text-xs text-gray-500">Latest update: {latestNote}</p>
      )}
    </div>
  );
}
