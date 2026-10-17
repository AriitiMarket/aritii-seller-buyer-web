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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-market-on-surface">Product Requests</h1>
          <p className="text-market-on-surface-variant mt-1">
            Request a product, negotiate an offer with the seller, then create the order when you agree.
          </p>
        </div>
        <Link to="/my-dashboard/requests/new" className="shrink-0">
          <Button className="bg-market-primary text-market-on-primary flex items-center gap-2">
            <FiPlus size={16} />
            Request Product
          </Button>
        </Link>
      </div>

      {/* Stages */}
      <div className="bg-white rounded-lg border border-market-border p-3 sm:p-4">
        <RequestTabs tabs={BUYER_TABS} counts={counts} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Search | Status | Date */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search requests, products or sellers…"
            aria-label="Search requests"
            className="w-full pl-9 pr-3 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-market-secondary"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="flex-1 sm:flex-none min-w-[140px] px-3 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-market-secondary"
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
            className="flex-1 sm:flex-none min-w-[140px] px-3 py-2.5 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-market-secondary"
          >
            {DATE_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
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
                <Button className="bg-market-primary text-market-on-primary flex items-center gap-2">
                  <FiPlus size={16} />
                  Request Product
                </Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-3">
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
                className="bg-white border border-market-border rounded-xl p-4 sm:p-5 hover:border-[#2162a1] transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-market-secondary-hover bg-market-surface-container px-2 py-0.5 rounded-full">
                        {requestCode(request._id)}
                      </span>
                      <h2 className="font-semibold text-market-on-surface flex items-center gap-2 truncate">
                        <FiPackage className="text-market-secondary flex-shrink-0" size={16} />
                        <span className="truncate">{request.title || request.subject}</span>
                      </h2>
                    </div>
                    <p className="text-xs text-market-on-surface-variant mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {formatDateTime(request.updatedAt || request.createdAt)}
                      </span>
                      <span>Qty {request.quantity}</span>
                      {request.targetPrice != null && (
                        <span>Target {formatCurrency(request.targetPrice)}</span>
                      )}
                      {request.shopId ? 'Addressed to a seller' : 'Open to all sellers'}
                    </p>
                    {request.details ? (
                      <p className="text-sm text-market-on-surface-variant mt-2 line-clamp-2">{request.details}</p>
                    ) : null}
                  </div>
                  <RequestStatusBadge status={status} className="self-start" />
                </div>

                {offer ? (
                  <p className="text-sm text-market-on-surface mt-3 bg-market-surface-dim rounded-lg px-3 py-2">
                    Seller offer: {offer.quantity} &times; {formatCurrency(offer.unitPrice)} ={' '}
                    <span className="font-semibold text-market-secondary-hover">
                      {formatCurrency(offerTotal(offer))}
                    </span>
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Link to={`/my-dashboard/requests/${request._id}`}>
                    <Button className="bg-market-primary text-market-on-primary flex items-center gap-2">
                      {OPEN_STATUSES.includes(status) ? 'Continue' : 'Open'}
                      <FiArrowRight size={14} />
                    </Button>
                  </Link>
                  {CANCELLABLE_STATUSES.includes(status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(request._id)}
                      disabled={cancellingId === request._id}
                      className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <FiXCircle size={14} />
                      {cancellingId === request._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                  {status === 'CONVERTED' && request.orderId ? (
                    <Link
                      to={`/user/order/${request.orderId}`}
                      className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center bg-white border border-market-border rounded-full text-market-on-surface font-semibold text-sm hover:border-[#2162a1] transition"
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
