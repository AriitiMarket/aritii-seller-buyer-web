import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import Loader from '@/components/common/Loading';
import { FiDollarSign, FiClock, FiRefreshCw, FiSearch, FiCreditCard } from 'react-icons/fi';

/**
 * Seller Transactions — payments for this shop's orders plus the shop wallet
 * ledger. REAL data only: order payment records (commerce) and the shop's own
 * `availableBalance` / `transections` snapshot from /shop/getseller.
 * (The sidebar linked here before the route existed, which 404'd.)
 */
const STATUS_STYLES = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
};

const money = (value) => `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const BusinessTransactionsPage = () => {
  const dispatch = useDispatch();
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { activeShop, activeShopId } = useBusinessShops();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeShopId) dispatch(getAllOrdersOfShop(activeShopId));
  }, [dispatch, activeShopId]);

  /** Payments derived from this shop's orders — never invented. */
  const payments = useMemo(() => {
    return (ShopOrders || [])
      .map((order) => ({
        id: order._id || order.id,
        date: order.createdAt,
        customer: order.user?.name || order.user?.email || 'Customer',
        amount: Number(order.totalPrice) || 0,
        paymentStatus: order.paymentStatus || 'PENDING',
        orderStatus: order.status || 'Processing',
      }))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [ShopOrders]);

  const summary = useMemo(() => {
    const confirmed = payments.filter((p) => p.paymentStatus === 'CONFIRMED');
    const pending = payments.filter((p) => p.paymentStatus === 'PENDING');
    const refunded = payments.filter((p) => p.paymentStatus === 'REFUNDED');
    const sum = (rows) => rows.reduce((acc, row) => acc + row.amount, 0);
    return {
      confirmedCount: confirmed.length,
      confirmedTotal: sum(confirmed),
      pendingCount: pending.length,
      pendingTotal: sum(pending),
      refundedCount: refunded.length,
      refundedTotal: sum(refunded),
    };
  }, [payments]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.paymentStatus === statusFilter;
      const matchesSearch =
        !q ||
        String(row.id).toLowerCase().includes(q) ||
        String(row.customer).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, search]);

  const ledger = Array.isArray(activeShop?.transections) ? activeShop.transections : [];

  if (isLoading && payments.length === 0) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-Poppins font-semibold">Transactions</h1>
          <p className="text-sm text-brand-muted">
            Payments for {activeShop?.name || 'your shop'} and your wallet ledger.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Available balance</p>
          <p className="text-xl font-bold text-brand-charcoal">{money(activeShop?.availableBalance)}</p>
        </div>
      </div>

      {/* Summary — derived from real payment records */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiDollarSign size={14} /> Confirmed
          </div>
          <p className="text-lg font-bold text-gray-900">{money(summary.confirmedTotal)}</p>
          <p className="text-xs text-gray-500">{summary.confirmedCount} payment(s)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiClock size={14} /> Pending
          </div>
          <p className="text-lg font-bold text-amber-600">{money(summary.pendingTotal)}</p>
          <p className="text-xs text-gray-500">{summary.pendingCount} awaiting confirmation</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiRefreshCw size={14} /> Refunded
          </div>
          <p className="text-lg font-bold text-blue-600">{money(summary.refundedTotal)}</p>
          <p className="text-xs text-gray-500">{summary.refundedCount} refund(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="all">All payments</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order id or customer…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Order payments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-cream text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Order status</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No transactions match this view yet.
                  </td>
                </tr>
              )}
              {visible.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2 text-gray-600">
                    {row.date ? new Date(row.date).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-gray-700">#{String(row.id).slice(-8)}</td>
                  <td className="px-4 py-2 text-gray-700">{row.customer}</td>
                  <td className="px-4 py-2 font-semibold text-gray-900">{money(row.amount)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[row.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{row.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked section cards — no horizontal scroll */}
        <div className="md:hidden divide-y divide-gray-100">
          {visible.length === 0 && (
            <p className="px-4 py-8 text-center text-gray-500 text-sm">
              No transactions match this view yet.
            </p>
          )}
          {visible.map((row) => (
            <div key={row.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-gray-900">#{String(row.id).slice(-8)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {row.date ? new Date(row.date).toLocaleString() : '—'}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLES[row.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {row.paymentStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="text-gray-900 truncate">{row.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="font-semibold text-gray-900">{money(row.amount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Order status</p>
                  <p className="text-gray-700">{row.orderStatus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet ledger from the shop snapshot */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiCreditCard className="text-gray-500" size={16} />
          <h2 className="font-semibold text-gray-900">Wallet ledger</h2>
        </div>
        {ledger.length === 0 ? (
          <p className="text-sm text-gray-500">No wallet entries yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 text-sm">
            {[...ledger]
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .map((entry, index) => (
                <div key={entry._id || index} className="py-2 flex items-center justify-between gap-3">
                  <span className="text-gray-600">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}
                  </span>
                  <span className="flex-1 text-center text-xs text-gray-500">{entry.status || 'Processing'}</span>
                  <span className={`font-semibold ${Number(entry.amount) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {money(entry.amount)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessTransactionsPage;
