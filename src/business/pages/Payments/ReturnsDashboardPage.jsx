import React, { useState, useEffect } from 'react';
import { sellerService } from '@/services/seller.service';

/**
 * SELLER RETURNS DASHBOARD PAGE (FIX #15)
 * Shows all returns by status with tabs and allows approval/rejection.
 * Backend: GET /returns/shop/:shopId/dashboard
 */
export function ReturnsDashboardPage() {
  const [shopId, setShopId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Default shop id from localStorage if available
    const stored = localStorage.getItem('activeShopId');
    if (stored) setShopId(stored);
  }, []);

  const loadDashboard = async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sellerService.getSellerReturns(shopId);
      setDashboard(data?.dashboard || data);
    } catch (err) {
      setError(err.message || 'Failed to load returns dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleShopChange = (e) => {
    setShopId(e.target.value);
    localStorage.setItem('activeShopId', e.target.value);
    loadDashboard();
  };

  const stats = dashboard
    ? [
        { label: 'Pending', count: dashboard.pending ?? 0, color: '#f59e0b' },
        { label: 'Approved', count: dashboard.approved ?? 0, color: '#3b82f6' },
        { label: 'Inspecting', count: dashboard.inspecting ?? 0, color: '#8b5cf6' },
        { label: 'Completed', count: dashboard.completed ?? 0, color: '#10b981' },
      ]
    : [];

  if (loading) return <div className="p-4">Loading returns dashboard…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Returns Management</h1>

      <div className="mb-6 flex items-center gap-3">
        <label>Shop ID</label>
        <input
          value={shopId}
          onChange={handleShopChange}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-lg bg-white border border-gray-200 dark:bg-dark-900 dark:border-dark-700">
            <p className="text-xs text-gray-500 uppercase font-semibold">{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>
              {s.count}
            </p>
          </div>
        ))}
        {stats.length === 0 && (
          <div className="col-span-full p-4 text-center text-gray-500">
            Enter a Shop ID to load returns data
          </div>
        )}
      </div>

      {dashboard?.totalValue != null && dashboard.totalValue > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-dark-800 border border-blue-100">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Total Return Value:</span>{' '}
            <span className="font-bold text-blue-700 dark:text-blue-400">
              {dashboard.totalValue.toLocaleString()} ETB
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ReturnsDashboardPage;