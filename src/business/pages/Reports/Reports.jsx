import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { reportService } from '@/services';
import Loader from '@/components/common/Loading';
import {
  FiFileText, FiDownload, FiCalendar, FiFilter, FiBarChart2, FiDollarSign,
  FiShoppingBag, FiUsers, FiRefreshCw, FiAlertCircle,
} from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import SafeChart from '@/business/shared/charts/SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const PRESETS = [
  { id: '7D', label: 'Last 7 Days', days: 7 },
  { id: '30D', label: 'Last 30 Days', days: 30 },
  { id: '90D', label: 'Last 90 Days', days: 90 },
  { id: '1Y', label: 'Last Year', days: 365 },
];

const currencySymbol = (currency = 'ETB') => (currency === 'USD' ? '$' : 'ETB');

const formatMoney = (value, currency = 'ETB') => {
  const sym = currencySymbol(currency);
  return `${sym} ${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const Reports = () => {
  const { ShopOrders = [], isLoading: ordersLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId, hasMultipleShops } = useBusinessShops();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState('30D');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [reportType, setReportType] = useState('sales');

  // Report backend state
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  const shopId = activeShopId || seller?._id;

  const period = useMemo(() => {
    const now = new Date();
    const preset = PRESETS.find((p) => p.id === dateRange);
    if (preset && customStart === '' && customEnd === '') {
      const start = new Date(now);
      start.setDate(now.getDate() - preset.days);
      return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0], label: preset.label };
    }
    if (customStart || customEnd) {
      return { start: customStart || '', end: customEnd || '', label: 'Custom range' };
    }
    return { start: '', end: '', label: preset ? preset.label : 'All time' };
  }, [dateRange, customStart, customEnd]);

  const fetchReport = useCallback(async () => {
    if (!shopId) return;
    setReportLoading(true);
    setReportError(null);
    try {
      const data = await reportService.getSellerStats(period.start || undefined, period.end || undefined);
      setReport(data);
    } catch (err) {
      setReportError(err?.response?.data?.message || err?.message || 'Failed to load report');
      setReport(null);
    } finally {
      setReportLoading(false);
    }
  }, [shopId, period.start, period.end]);

  // Load shop orders for the shop inventory / tables alongside the backend report.
  useEffect(() => {
    if (shopId) {
      dispatch(getAllOrdersOfShop(shopId));
    }
  }, [dispatch, shopId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleRetry = () => {
    fetchReport();
  };

  // Derived report values with safe empty-state defaults.
  const {
    grossSales = 0, refunds = 0, netSales = 0, totalOrders = 0,
    deliveredOrders = 0, cancelledOrders = 0, pendingOrders = 0,
    avgOrderValue = 0, totalProducts = 0, lowStock = 0, outOfStock = 0,
    totalStock = 0, bestSellers = [], currency = 'ETB', shopCount = 0,
  } = report || {};

  const hasData = report && (totalOrders > 0 || totalProducts > 0);

  const monthlySales = useMemo(() => {
    const map = {};
    (ShopOrders || []).forEach((o) => {
      if (normalizeStatus(o.status) !== ORDER_STATUSES.DELIVERED) return;
      const day = new Date(o.createdAt).toISOString().split('T')[0];
      map[day] = (map[day] || 0) + Number(o.totalPrice || 0);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [ShopOrders]);

  const salesChart = {
    labels: monthlySales.map(([d]) => d),
    datasets: [{
      label: `Revenue (${currency})`,
      data: monthlySales.map(([, v]) => v),
      backgroundColor: '#75d04b',
      borderRadius: 4,
    }],
  };

  const productChart = {
    labels: bestSellers.slice(0, 5).map((b) => b.name),
    datasets: [{
      data: bestSellers.slice(0, 5).map((b) => b.quantity),
      backgroundColor: ['#75d04b', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
    }],
  };

  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Reporting period', `${period.label} (${period.start || '—'} → ${period.end || '—'})`],
      ['Currency', currency],
      ['Gross sales', grossSales],
      ['Refunds', refunds],
      ['Net sales', netSales],
      ['Total orders', totalOrders],
      ['Delivered orders', deliveredOrders],
      ['Cancelled orders', cancelledOrders],
      ['Pending orders', pendingOrders],
      ['Average order value', avgOrderValue],
      ['Products', totalProducts],
      ['Low stock', lowStock],
      ['Out of stock', outOfStock],
      ['Total stock units', totalStock],
    ];
    const csv = rows.map((r) => r.map((c) => String(c).includes(',') ? `"${String(c).replace(/"/g, '""')}"` : c).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aritii-report-${period.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Business Reports</h1>
            <p className="text-sm text-gray-600">
              Reporting period: <span className="font-medium">{period.label}</span>{' '}
              {period.start && period.end ? `(${period.start} → ${period.end})` : ''}
              &bull; Currency: <span className="font-medium">{currency}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Revenue counts delivered orders only. Net sales = gross sales &minus; refunds. Cancelled and pending orders are excluded.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={reportLoading || !hasData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary-dark transition"
            >
              <FiDownload size={18} />
              {reportLoading ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              <FiRefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Report state: error / empty */}
      {reportError && !reportLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle size={20} className="text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Unable to load report</h3>
              <p className="text-sm text-red-700 mt-1">{reportError}</p>
            </div>
          </div>
        </div>
      )}

      {(reportLoading || (!reportError && report === null)) && (
        <Loader />
      )}

      {!reportLoading && !reportError && report && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto gap-2 px-4 py-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setDateRange(p.id); setCustomStart(''); setCustomEnd(''); }}
                    className={`px-4 py-2 text-sm font-medium rounded border transition ${
                      dateRange === p.id && customStart === '' && customEnd === ''
                        ? 'border-brand-primary text-brand-primary-dark bg-brand-primary/5'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  onClick={() => { setDateRange('custom'); }}
                  className={`px-4 py-2 text-sm font-medium rounded border transition ${
                    dateRange === 'custom' ? 'border-brand-primary text-brand-primary-dark bg-brand-primary/5' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>
            {dateRange === 'custom' && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">From</span>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">To</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report type tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'sales', label: 'Sales Report', icon: FiDollarSign },
                  { id: 'orders', label: 'Orders Report', icon: FiShoppingBag },
                  { id: 'products', label: 'Products Report', icon: FiFileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setReportType(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
                      reportType === tab.id
                        ? 'border-brand-primary text-brand-primary-dark'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-green-600" size={20} />
                    <span className="text-xs text-gray-600 uppercase">Gross Sales</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatMoney(grossSales, currency)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiShoppingBag className="text-red-600" size={20} />
                    <span className="text-xs text-gray-600 uppercase">Refunds</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatMoney(refunds, currency)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-blue-600" size={20} />
                    <span className="text-xs text-gray-600 uppercase">Net Sales</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatMoney(netSales, currency)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="text-purple-600" size={20} />
                    <span className="text-xs text-gray-600 uppercase">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBarChart2 className="text-yellow-600" size={20} />
                    <span className="text-xs text-gray-600 uppercase">Avg Order Value</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatMoney(avgOrderValue, currency)}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="h-[300px]">
                    <SafeChart type="bar" data={salesChart} options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } },
                    }} height={300} />
                  </div>
                  {monthlySales.length === 0 && (
                    <p className="mt-3 text-xs text-gray-500 text-center">No revenue in this period.</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Best-Selling Products</h3>
                  <div className="h-[300px]">
                    <SafeChart type="doughnut" data={productChart} options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom' } },
                    }} height={300} />
                  </div>
                  {bestSellers.length === 0 && (
                    <p className="mt-3 text-xs text-gray-500 text-center">No sales yet.</p>
                  )}
                </div>
              </div>

              {/* Order status summary */}
              <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-green-50 rounded border border-green-100">
                    <p className="text-xs text-green-700 uppercase font-semibold">Delivered</p>
                    <p className="text-xl font-bold text-green-900">{deliveredOrders}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded border border-red-100">
                    <p className="text-xs text-red-700 uppercase font-semibold">Cancelled</p>
                    <p className="text-xl font-bold text-red-900">{cancelledOrders}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                    <p className="text-xs text-yellow-700 uppercase font-semibold">Pending</p>
                    <p className="text-xl font-bold text-yellow-900">{pendingOrders}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-100">
                    <p className="text-xs text-blue-700 uppercase font-semibold">Shops</p>
                    <p className="text-xl font-bold text-blue-900">{shopCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty state hint */}
          {!hasData && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <FiAlertCircle size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No report data for the selected period.</p>
              <p className="text-sm text-gray-500 mt-1">Place and deliver some orders to see sales figures here.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (ordersLoading && !shopId) return <Loader />;

  return <>{content}</>;
};

export default Reports;
