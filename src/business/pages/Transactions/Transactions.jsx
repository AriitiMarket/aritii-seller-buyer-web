import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getSellerAllocations } from '@/services';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import Loader from '@/components/common/Loading';
import { FiDollarSign, FiClock, FiRefreshCw, FiSearch, FiCreditCard, FiMinus, FiPlus } from 'react-icons/fi';
import { SellerStatusBadge, SellerEmptyState } from '@/business/components';

const money = (value) => `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-700',
  PARTIALLY_SETTLED: 'bg-blue-100 text-blue-700',
  SETTLED: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-red-100 text-red-700',
  FAILED: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  PARTIALLY_SETTLED: 'Partially settled',
  SETTLED: 'Settled',
  REFUNDED: 'Refunded',
  FAILED: 'Failed',
};

const BusinessTransactionsPage = () => {
  const dispatch = useDispatch();
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { activeShop, activeShopId } = useBusinessShops();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [allocsLoading, setAllocsLoading] = useState(false);

  // Seller-scoped identifier: prefer the identity user id, fall back to shop id.
  const sellerId = activeShopId;

  useEffect(() => {
    if (sellerId) dispatch(getAllOrdersOfShop(sellerId));
  }, [dispatch, sellerId]);

  // Fetch seller-level financial allocations (gross, commission, net payable,
  // settled, pending, refunded). This is the authoritative financial view —
  // orders alone don't show commissions, fees or net payable.
  useEffect(() => {
    if (!sellerId) return;
    let active = true;
    setAllocsLoading(true);
    getSellerAllocations(sellerId)
      .then((rows) => { if (active) setAllocations(rows || []); })
      .catch(() => { if (active) setAllocations([]); })
      .finally(() => { if (active) setAllocsLoading(false); });
    return () => { active = false; };
  }, [sellerId, getSellerAllocations]);

  const summary = useMemo(() => {
    const confirmed = allocations.filter((a) => a.status === 'SETTLED');
    const pending = allocations.filter((a) => a.status === 'PENDING' || a.status === 'PARTIALLY_SETTLED');
    const refunded = allocations.filter((a) => a.status === 'REFUNDED');
    const sum = (rows, key) => rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
    return {
      confirmedCount: confirmed.length,
      confirmedTotal: sum(confirmed, 'netPayable'),
      pendingCount: pending.length,
      pendingTotal: sum(pending, 'pendingAmount'),
      refundedCount: refunded.length,
      refundedTotal: sum(refunded, 'refundAmount'),
      grossTotal: sum(allocations, 'grossSubtotal'),
      commissionTotal: sum(allocations, 'platformCommission'),
      netTotal: sum(allocations, 'netPayable'),
    };
  }, [allocations]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allocations.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      const matchesSearch = !q ||
        String(row.orderId || '').toLowerCase().includes(q) ||
        String(row.sellerId || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [allocations, statusFilter, search]);

  const ledger = Array.isArray(activeShop?.transections) ? activeShop.transections : [];

  if ((isLoading || allocsLoading) && allocations.length === 0 && ShopOrders.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-market-on-surface">Transactions</h2>
          <p className="text-sm text-market-on-surface-variant">Seller financial allocations and payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="seller-stat-card border-green-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
              <FiDollarSign size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-green-700 font-bold">{money(summary.confirmedTotal)}</p>
          <p className="seller-stat-card-label">{summary.confirmedCount} settled</p>
        </div>
        <div className="seller-stat-card border-amber-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
              <FiClock size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-amber-700 font-bold">{money(summary.pendingTotal)}</p>
          <p className="seller-stat-card-label">{summary.pendingCount} pending</p>
        </div>
        <div className="seller-stat-card border-red-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-600">
              <FiMinus size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-red-700 font-bold">{money(summary.refundedTotal)}</p>
          <p className="seller-stat-card-label">{summary.refundedCount} refunded</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="seller-stat-card border-blue-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
              <FiPlus size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-blue-700 font-bold">{money(summary.grossTotal)}</p>
          <p className="seller-stat-card-label">Gross sales</p>
        </div>
        <div className="seller-stat-card border-purple-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
              <FiCreditCard size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-purple-700 font-bold">{money(summary.commissionTotal)}</p>
          <p className="seller-stat-card-label">Platform commission</p>
        </div>
      </div>

      {visible.length === 0 ? (
        <SellerEmptyState
          title="No transactions"
          description="No financial allocations match this view yet."
          icon="💳"
        />
      ) : (
        <div className="seller-form-section">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="seller-form-select w-auto"
              >
                <option value="all">All statuses</option>
                <option value="SETTLED">Settled</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIALLY_SETTLED">Partially settled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-market-on-surface-variant text-sm">🔍</span>
              <input
                type="search"
                placeholder="Search transactions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="seller-form-input pl-9 pr-4"
                aria-label="Search transactions"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="seller-data-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Gross</th>
                  <th scope="col">Commission</th>
                  <th scope="col">Net payable</th>
                  <th scope="col">Settled</th>
                  <th scope="col">Pending</th>
                  <th scope="col">Refunded</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row._id || row.orderId}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-market-surface-container-low flex items-center justify-center shrink-0">
                          <span className="text-xs">#{String(row.orderId || '').slice(-4)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-market-on-surface truncate">Allocation #{String(row._id || '').slice(-8)}</p>
                          <p className="text-xs text-market-on-surface-variant">{row.currency || 'ETB'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-market-on-surface">{money(row.grossSubtotal)}</td>
                    <td className="text-market-on-surface-variant text-sm">-{money(row.platformCommission)}</td>
                    <td className="font-semibold text-market-on-surface">{money(row.netPayable)}</td>
                    <td className="text-market-on-surface">{money(row.settledAmount)}</td>
                    <td className="text-amber-700 font-semibold">{money(row.pendingAmount)}</td>
                    <td className="text-red-600 font-semibold">-{money(row.refundAmount)}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[row.status] || row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="seller-form-section mt-6">
        <div className="flex items-center gap-2 mb-3">
          <FiCreditCard className="text-gray-500" size={16} />
          <h3 className="text-lg font-bold text-market-on-surface">Wallet ledger</h3>
        </div>
        {ledger.length === 0 ? (
          <p className="text-sm text-market-on-surface-variant">No wallet entries yet.</p>
        ) : (
          <div className="divide-y divide-market-border text-sm">
            {[...ledger]
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .map((entry, index) => (
                <div key={entry._id || index} className="py-3 flex items-center justify-between gap-3">
                  <span className="text-market-on-surface-variant">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}
                  </span>
                  <span className="flex-1 text-center text-xs text-market-on-surface-variant">
                    {entry.status || 'Processing'}
                  </span>
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
