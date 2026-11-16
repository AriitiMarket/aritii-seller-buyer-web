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
} from '@/features/buyer/product-requests';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { FiPlus, FiSearch, FiPackage, FiClock, FiArrowRight, FiXCircle } from 'react-icons/fi';



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
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 px-3 py-4 sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1440px] space-y-4 md:space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 shadow-sm sm:px-5 md:px-6 md:py-5">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-[#75d04b]/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#75d04b]">Aritii Buyer Workspace</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">Product Requests & Custom Orders</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-5 text-gray-500 dark:text-gray-400">
              Request bespoke or bulk items directly from verified Ethiopian sellers, negotiate offers in real time, and convert to an order with escrow protection.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1">1. Describe product</span>
              <span className="text-[#75d04b] font-bold">→</span>
              <span className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1">2. Agree on offer</span>
              <span className="text-[#75d04b] font-bold">→</span>
              <span className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1">3. Secure Escrow Order</span>
            </div>
          </div>
          <Link
            to="/my-dashboard/requests/new"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#75d04b] hover:brightness-95 text-white px-6 text-sm font-semibold shadow-sm transition"
          >
            <FiPlus size={18} />
            New Product Request
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-2 shadow-sm md:px-4">
        <RequestTabs tabs={BUYER_TABS} counts={counts} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Search | Status | Date - Mobile responsive */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 shadow-sm sm:flex-row sm:items-center md:p-3">
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition h-11"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <select
            value={statusFilter ?? ''}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="min-w-0 sm:w-40 px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition h-10"
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.id || 'any'} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={dateFilter ?? 'any'}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter by date"
            className="min-w-0 sm:w-36 px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition h-10"
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
                  className="bg-[#75d04b] hover:brightness-95 text-white rounded-full font-semibold flex items-center gap-2"
                >
                  <FiPlus size={16} />
                  Request Product
                </Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
                className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:border-[#75d04b]/50 hover:shadow-md md:p-5"
              >
                {/* Request Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        {requestCode(request._id)}
                      </span>
                      <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 truncate text-base md:text-lg">
                        <FiPackage className="flex-shrink-0 text-[#75d04b]" size={18} />
                        <span className="truncate">{request.title || request.subject}</span>
                      </h2>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {formatDateTime(request.updatedAt || request.createdAt)}
                      </span>
                      <span className="font-medium">Qty: {request.quantity}</span>
                      {request.targetPrice != null && (
                        <span className="font-medium">Target: {formatCurrency(request.targetPrice)}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {request.shopId ? '🏪 Addressed to a seller' : '🌐 Open to all sellers'}
                    </p>
                    {request.details ? (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{request.details}</p>
                    ) : null}
                  </div>
                  <div className="flex-shrink-0">
                    <RequestStatusBadge status={status} />
                  </div>
                </div>

                {/* Seller Offer */}
                {offer ? (
                  <div
                    className="p-3 md:p-4 rounded-xl mb-4 text-sm bg-[#f3ffee] dark:bg-[#75d04b]/10 border border-[#75d04b]/30"
                  >
                    <p className="text-gray-900 dark:text-white">
                      Seller offer: <span className="font-semibold">{offer.quantity} ×</span> {formatCurrency(offer.unitPrice)} ={' '}
                      <span className="font-bold text-[#75d04b]">
                        {formatCurrency(offerTotal(offer))}
                      </span>
                    </p>
                  </div>
                ) : null}

                {/* Actions - Stacked for mobile */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center flex-wrap gap-2">
                  <Link
                    to={`/my-dashboard/requests/${request._id}`}
                    className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center gap-2 bg-[#75d04b] hover:brightness-95 text-white rounded-full font-semibold shadow-sm transition"
                  >
                    {OPEN_STATUSES.includes(status) ? 'Continue' : 'Open'}
                    <FiArrowRight size={16} />
                  </Link>
                  {CANCELLABLE_STATUSES.includes(status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(request._id)}
                      disabled={cancellingId === request._id}
                      className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center gap-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-full font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                    >
                      <FiXCircle size={16} />
                      {cancellingId === request._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                  {status === 'CONVERTED' && request.orderId ? (
                    <Link
                      to={`/user/order/${request.orderId}`}
                      className="flex-1 md:flex-none h-11 px-5 inline-flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
    </div>
  );
}
