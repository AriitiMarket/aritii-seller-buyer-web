import React, { useCallback, useEffect, useRef, useState } from 'react';
import { orderService } from '@/services';
import { deliveryService } from '@/services/delivery.service';
import { describeDelivery, explainNoDelivery } from '@/shared/utils/deliveryStatus';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import DeliveryTimeline from '@/shared/components/DeliveryTimeline';
import { BsTruck, BsGeoAlt, BsExclamationCircle, BsArrowRepeat } from 'react-icons/bs';
import { FiRefreshCw } from 'react-icons/fi';

/**
 * OrderDeliveryCard — the ONE delivery panel for an order, shared by the buyer
 * and the business screens.
 *
 * It prefers the Delivery Service's own order-scoped read
 * (`GET /delivery/delivery/order/:orderId`), which is authorized by the
 * ORDER's ownership server-side and carries the enriched shape — the provider's
 * name, both addresses, the timeline. When that domain answers 404/501 (or has
 * no record for the order) it falls back to the ORDER ↔ DELIVERY bridge
 * (`orderService.getOrderDelivery`), so the panel is correct on a customer
 * receipt, a seller order and an admin order alike. It never invents a
 * shipment: an order without a delivery record shows why it has none yet.
 *
 * Status vocabulary comes from shared/utils/deliveryStatus.js (the mirror of the
 * Delivery Service state machine) — never from a local map.
 */
const Row = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 break-words">{value}</span>
    </div>
  );
};

export default function OrderDeliveryCard({
  orderId,
  orderStatus = '',
  className = '',
  title = 'Delivery',
}) {
  const [state, setState] = useState({ loading: true, delivery: null, error: '', timeline: [], trackingEvents: [] });
  const requestInFlight = useRef(false);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!orderId || requestInFlight.current) return;
    requestInFlight.current = true;
    setState((prev) => ({ ...prev, loading: silent ? prev.loading : true, error: '' }));
    try {
      let delivery = null;
      try {
        const res = await deliveryService.getDeliveryByOrder(orderId);
        delivery = res.delivery || null;
      } catch {
        // Delivery domain unreachable — fall through to the commerce bridge.
        delivery = null;
      }
      if (!delivery) {
        const { delivery: bridgeDelivery } = await orderService.getOrderDelivery(orderId);
        delivery = bridgeDelivery || null;
      }

      // The delivery's own history — the parcel's real journey. A failure here
      // must not hide the delivery itself, so it degrades to an empty timeline.
      let timeline = [];
      let trackingEvents = [];
      if (delivery && delivery._id) {
        try {
          const history = await deliveryService.getDeliveryHistory(delivery._id);
          timeline = history.timeline || [];
          trackingEvents = history.trackingEvents || [];
        } catch {
          timeline = [];
          trackingEvents = [];
        }
      }

      setState({ loading: false, delivery, error: '', timeline, trackingEvents });
    } catch (err) {
      setState({
        loading: false,
        delivery: null,
        error: err?.response?.data?.message || 'Delivery information is unavailable right now.',
        timeline: [],
        trackingEvents: [],
      });
    } finally {
      requestInFlight.current = false;
    }
  }, [orderId]);

  useEffect(() => {
    load();
    // Keep an open order page current without requiring a manual refresh.
    // Pause in background tabs to avoid unnecessary requests.
    const refresh = () => {
      if (document.visibilityState === 'visible') load({ silent: true });
    };
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [load]);

  const view = describeDelivery(state.delivery);

  return (
    <section className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BsTruck className="text-brand-primary-dark" size={20} />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {!state.loading && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${view.statusTone}`}>
              {view.statusLabel}
            </span>
          )}
          <button
            type="button"
            onClick={load}
            disabled={state.loading}
            className="p-2 rounded-lg text-gray-500 hover:text-brand-primary-dark hover:bg-brand-primary-light transition disabled:opacity-50"
            title="Refresh delivery information"
            aria-label="Refresh delivery information"
          >
            {state.loading ? <BsArrowRepeat size={16} className="animate-spin" /> : <FiRefreshCw size={16} />}
          </button>
        </div>
      </div>

      {state.loading && (
        <p className="mt-4 text-sm text-gray-500">Checking the shipment for this order…</p>
      )}

      {!state.loading && state.error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          <BsExclamationCircle className="mt-0.5 shrink-0" size={16} />
          <span>{state.error}</span>
        </div>
      )}

      {!state.loading && !state.error && !view.linked && (
        <div className="mt-4 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] p-4">
          <p className="text-sm text-gray-700">{explainNoDelivery(orderStatus)}</p>
          <p className="mt-1 text-xs text-gray-500">
            Nothing is booked with a provider for this order yet.
          </p>
        </div>
      )}

      {!state.loading && !state.error && view.linked && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Row label="Provider" value={view.providerName || view.providerReference || 'Aritii delivery network'} />
            <Row label="Delivery ref" value={view.reference} />
            <Row label="Last update" value={view.lastUpdate ? formatDateTime(view.lastUpdate) : ''} />
            <Row label="Items" value={view.itemCount ? `${view.itemCount} item${view.itemCount > 1 ? 's' : ''}` : ''} />
            <Row label="Declared value" value={view.totalValue ? formatCurrency(view.totalValue) : ''} />
          </div>

          {(view.pickup || view.destination) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Row label="Pickup" value={view.pickup} />
              <Row label="Deliver to" value={view.destination} />
            </div>
          )}

          {view.note && (
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800">
              <BsGeoAlt className="mt-0.5 shrink-0" size={16} />
              <span>{view.note}</span>
            </div>
          )}

          <DeliveryTimeline
            timeline={state.timeline}
            trackingEvents={state.trackingEvents}
            status={view.status}
          />

          <p className="text-xs text-gray-500">
            Delivery progress is reported by the provider network; the order status follows it.
          </p>
        </div>
      )}
    </section>
  );
}
