import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import requestService from '@/services/request.service';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import {
  BUYER_TABS,
  CANCELLABLE_STATUSES,
  DATE_FILTERS,
  OPEN_STATUSES,
  STATUS_FILTER_OPTIONS,
  RequestStatusBadge,
  RequestTabs,
  countByTab,
  offerTotal,
  requestCode,
  requestMatchesSearch,
  requestWithinDate,
  statusOf,
  useRequestEvents,
} from '@/features/product-requests';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { FiPlus, FiSearch, FiPackage, FiClock, FiArrowRight, FiXCircle } from 'react-icons/fi';

// Aritii Brand Colors
const ARITII_GREEN = '#75d04b'
const ARITII_DARK = '#131921'

/**
 * Buyer — Product Requests dashboard (`/my-dashboard/requests`).
 *
 * The single entry point of the buyer request flow:
 *   Product Requests → Select Seller → Request Product → Request Workspace
 * → Agree → Create Order → Payment → Logistics.
 *
 * There is deliberately no seller dropdown here — seller selection is its
 * own step (`requests/new`), reached from the primary action.
 */
export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('any');
  const [cancellingId, setCancellingId] = useState(null);

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    try {
      const result = await requestService.getMine();
      setRequests(result.requests || []);
    } catch (err) {
      // Background refreshes fail quietly — the list keeps its last-good data.
      if (quiet) return;
      toast.error(err.response?.data?.message || 'Could not load your requests');
      setRequests([]);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* Realtime: statuses, offers and new messages reconcile the list silently —
     no loading flash, no toast storm, filters and scroll stay untouched. */
  const reloadTimerRef = useRef(null);
  useRequestEvents(() => {
    if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    reloadTimerRef.current = setTimeout(() => load({ quiet: true }), 300);
  }, null);
  useEffect(() => () => clearTimeout(reloadTimerRef.current), []);

  const counts = useMemo(() => countByTab(BUYER_TABS, requests), [requests]);

  const visible = useMemo(() => {
    const tab = BUYER_TABS.find((item) => item.id === activeTab);
    return requests.filter((request) => {
      const status = statusOf(request);
      if (tab && tab.statuses && !tab.statuses.includes(status)) return false;
      if (statusFilter && status !== statusFilter) return false;
      if (!requestWithinDate(request, dateFilter)) return false;
      return requestMatchesSearch(request, query);
    });
  }, [requests, activeTab, query, statusFilter, dateFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    setCancellingId(id);
    try {
      await requestService.cancelRequest(id);
      toast.success('Request cancelled');
      await load({ quiet: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel the request');
    } finally {
      setCancellingId(null);
    }
  };

  const hasActiveFilters = Boolean(query.trim() || statusFilter || dateFilter !== 'any');

  return (
    <div className="space-y-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: ARITII_DARK }}>
            Product Requests
          </h1>
          <p className="text-market-on-surface-variant text-sm mt-2">
            Request a product, negotiate an offer with the seller, then create the order when you agree.
          </p>
        </div>
        <Link
          to="/my-dashboard/requests/new"
          className="shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 text-white rounded-lg font-semibold hover:opacity-90 transition"
          style={{ backgroundColor: ARITII_GREEN }}
        >
          <FiPlus size={18} />
          Request Product
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-market-border p-3 md:p-4 overflow-x-auto">
        <RequestTabs tabs={BUYER_TABS} counts={counts} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Search | Status | Date - Mobile responsive */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search requests, products or sellers…"
            aria-label="Search requests"
            className="w-full pl-10 pr-4 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 transition h-11"
            style={{ '--tw-ring-color': ARITII_GREEN }}
          />
        </div>
        <div className="flex gap-2 md:gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="flex-1 md:flex-none px-3 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 transition h-11"
            style={{ '--tw-ring-color': ARITII_GREEN }}
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.id || 'any'} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter by date"
            className="flex-1 md:flex-none px-3 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 transition h-11"
            style={{ '--tw-ring-color': ARITII_GREEN }}
          >
            {DATE_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List - Full width cards mobile */}
      {loading ? (
        <Loading />
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            requests.length === 0
              ? 'No product requests yet'
              : hasActiveFilters
              ? 'No requests match your filters'
              : 'Nothing in this stage'
          }
          description={
            requests.length === 0
              ? 'Request a product from a seller to start negotiating.'
              : 'Try a different search, status or date range.'
          }
          action={
            requests.length === 0 ? (
              <Link to="/my-dashboard/requests/new">
                <Button
                  className="text-white flex items-center gap-2"
                  style={{ backgroundColor: ARITII_GREEN }}
                >
                  <FiPlus size={16} />
                  Request Product
                </Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="space-y-3">
          {visible.map((request) => {
            const status = statusOf(request);
            const activeOffer = (request.offers || []).find((offer) => offer.status === 'ACTIVE');
            const acceptedOffer = (request.offers || []).find(
              (offer) => offer.status === 'ACCEPTED'
            );
            const offer = activeOffer || acceptedOffer;
            
            return (
              <article
                key={request._id}
                className="bg-white border border-market-border rounded-lg p-4 md:p-6 hover:shadow-md transition"
              >
                {/* Request Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: ARITII_GREEN }}
                      >
                        {requestCode(request._id)}
                      </span>
                      <h2 className="font-semibold text-market-on-surface flex items-center gap-2 truncate text-base md:text-lg">
                        <FiPackage className="flex-shrink-0" size={18} style={{ color: ARITII_GREEN }} />
                        <span className="truncate">{request.title || request.subject}</span>
                      </h2>
                    </div>
                    <p className="text-xs text-market-on-surface-variant flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {formatDateTime(request.updatedAt || request.createdAt)}
                      </span>
                      <span className="font-medium">Qty: {request.quantity}</span>
                      {request.targetPrice != null && (
                        <span className="font-medium">Target: {formatCurrency(request.targetPrice)}</span>
                      )}
                    </p>
                    <p className="text-xs text-market-on-surface-variant mt-1">
                      {request.shopId ? '🏪 Addressed to a seller' : '🌐 Open to all sellers'}
                    </p>
                    {request.details ? (
                      <p className="text-sm text-market-on-surface-variant mt-2 line-clamp-2">{request.details}</p>
                    ) : null}
                  </div>
                  <div className="flex-shrink-0">
                    <RequestStatusBadge status={status} />
                  </div>
                </div>

                {/* Seller Offer */}
                {offer ? (
                  <div
                    className="p-3 md:p-4 rounded-lg mb-4 text-sm"
                    style={{ backgroundColor: ARITII_GREEN + '15' }}
                  >
                    <p className="text-market-on-surface">
                      Seller offer: <span className="font-semibold">{offer.quantity} ×</span> {formatCurrency(offer.unitPrice)} ={' '}
                      <span className="font-bold" style={{ color: ARITII_GREEN }}>
                        {formatCurrency(offerTotal(offer))}
                      </span>
                    </p>
                  </div>
                ) : null}

                {/* Actions - Stacked for mobile */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center flex-wrap gap-2">
                  <Link
                    to={`/my-dashboard/requests/${request._id}`}
                    className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center gap-2 text-white rounded-lg font-semibold hover:opacity-90 transition"
                    style={{ backgroundColor: ARITII_GREEN }}
                  >
                    {OPEN_STATUSES.includes(status) ? 'Continue' : 'Open'}
                    <FiArrowRight size={16} />
                  </Link>
                  {CANCELLABLE_STATUSES.includes(status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(request._id)}
                      disabled={cancellingId === request._id}
                      className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center gap-2 border-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
                      style={{ borderColor: '#ef4444', color: '#ef4444' }}
                    >
                      <FiXCircle size={16} />
                      {cancellingId === request._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                  {status === 'CONVERTED' && request.orderId ? (
                    <Link
                      to={`/user/order/${request.orderId}`}
                      className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center border-2 border-market-border rounded-lg font-semibold text-sm hover:border-market-on-surface-variant transition"
                      style={{ color: ARITII_DARK }}
                    >
                      View Order
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
