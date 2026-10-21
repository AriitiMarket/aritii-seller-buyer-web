import React, { useState, useEffect } from 'react';
import { sellerService } from '@/services/seller.service';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';

/**
 * SELLER METRICS / KPIs PAGE (FIX #13)
 * Shows orders/day, revenue, return rate, rating metrics.
 * Backend: GET /metrics/shop/:shopId/dashboard
 */
export function MetricsPage() {
  const { activeShop, activeShopId, loading: shopsLoading } = useBusinessShops();
  const shopId = activeShopId;
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  const loadMetrics = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sellerService.getSellerMetrics(shopId, { period });
      setMetrics(data?.metrics || data);
    } catch (err) {
      setError(err.message || 'Failed to load seller metrics');
    } finally {
      setLoading(false);
    }
  }, [shopId, period]);

  useEffect(() => {
    if (shopId) loadMetrics();
    else if (!shopsLoading) {
      setMetrics(null);
      setError(null);
      setLoading(false);
    }
  }, [loadMetrics, shopId, period, shopsLoading]);

  if (loading) return <div className="p-4">Loading seller metrics…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const m = metrics?.thisMonth || metrics || {};
  const stat = (label, value, hint) => (
    <div key={label} className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-dark-900 dark:border-dark-700">
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Seller KPIs & Metrics</h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Shop: <strong>{activeShop?.name || 'No shop selected'}</strong></span>
        <label htmlFor="metrics-period" className="text-sm">Period</label>
        <select
          id="metrics-period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="daily">24 hours</option>
          <option value="weekly">7 days</option>
          <option value="monthly">30 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stat('Orders', m.orders?.total ?? m.ordersToday ?? m.totalOrders ?? 0, `${m.orders?.completed ?? 0} completed`)}
        {stat('Revenue', Number(m.revenue?.total ?? m.revenue ?? m.totalRevenue ?? 0).toLocaleString(), 'ETB')}
        {stat('Return Rate', m.returns?.rate ?? m.returnRate ?? 0, '% of orders returned')}
        {stat('Rating', m.reviews?.average ?? m.rating ?? 0, 'Out of 5')}
      </div>

      {!shopId && !shopsLoading && (
        <div className="p-4 text-center text-gray-500">
          Add or select a shop to load its metrics.
        </div>
      )}
    </div>
  );
}

export default MetricsPage;
