import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdWorkOutline, MdLocalShipping, MdTrendingUp, MdWifi, MdWifiOff } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useProviderBatches } from '../hooks/useProviderBatches';
import { useProviderAvailability } from '../hooks/useProviderAvailability';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * ProviderOverview - the main dashboard for delivery providers.
 *
 * Shows key metrics, available work summary, and quick access to
 * important provider actions. Answers "What do I need to do now?"
 */
const ProviderOverview = () => {
  const { user } = useSelector((state) => state.user);
  const { isOnline, toggling, toggleAvailability, error: availabilityError } = useProviderAvailability();
  const [metrics, setMetrics] = useState({ activeDeliveries: 0, completedToday: 0, supported: false });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    let cancelled = false;
    providerDeliveryApi.getProviderDeliveryMetrics().then((result) => {
      if (!cancelled) setMetrics(result);
    }).finally(() => {
      if (!cancelled) setLoadingMetrics(false);
    });
    return () => { cancelled = true; };
  }, []);

  // The work offered to this rider: the dispatch batches that are still
  // waiting for their answer. (The legacy single-assignment collection is not
  // what the platform dispatches, so counting it always showed zero.)
  const { batches, loading: loadingWork, supported: workSupported } = useProviderBatches({ page: 1, limit: 50 });
  const availableCount = useMemo(
    () => batches.filter((batch) => batch.originalStatus === 'waiting_acceptance').length,
    [batches],
  );

  const { activeDeliveries, completedToday } = metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || user?.fullName || 'Provider'}! Here's what's happening today.
          </p>
        </div>
        <button
          onClick={toggleAvailability}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            isOnline
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {isOnline ? <MdWifi size={20} /> : <MdWifiOff size={20} />}
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {availabilityError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{availabilityError}</p>}
      {!loadingMetrics && workSupported && !metrics.supported && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Delivery metrics are currently unavailable from the delivery service.</p>}

      {/* Availability Notice */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <MdWifiOff className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-amber-900">You're currently offline</p>
            <p className="text-sm text-amber-700 mt-1">
              You won't receive new delivery assignments while offline. Go online to start receiving work.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Work</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loadingWork ? '...' : workSupported ? availableCount : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <MdWorkOutline className="text-blue-600" size={24} />
            </div>
          </div>
          <Link to="/provider/available-work" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loadingMetrics ? '...' : metrics.supported ? activeDeliveries : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <MdLocalShipping className="text-green-600" size={24} />
            </div>
          </div>
          <Link to="/provider/deliveries" className="text-sm text-green-600 hover:underline mt-3 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loadingMetrics ? '...' : metrics.supported ? completedToday : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <MdTrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isOnline ? 'bg-green-50' : 'bg-gray-50'}`}>
              {isOnline ? <MdWifi className="text-green-600" size={24} /> : <MdWifiOff className="text-gray-600" size={24} />}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      {availableCount > 0 && isOnline && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {availableCount} delivery assignment{availableCount > 1 ? 's' : ''} available
              </h2>
              <p className="text-sm text-gray-600">
                Review and accept assignments to start your deliveries.
              </p>
            </div>
            <Link
              to="/provider/available-work"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
            >
              View Assignments
              <MdWorkOutline size={18} />
            </Link>
          </div>
        </div>
      )}

      {activeDeliveries > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {activeDeliveries} active delivery{activeDeliveries > 1 ? 'ies' : ''} in progress
              </h2>
              <p className="text-sm text-gray-600">
                Continue your current pickups and deliveries.
              </p>
            </div>
            <Link
              to="/provider/deliveries"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
            >
              View Deliveries
              <MdLocalShipping size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/provider/available-work"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#75d04b] hover:bg-green-50 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MdWorkOutline className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Find Work</p>
              <p className="text-sm text-gray-500">Browse available deliveries</p>
            </div>
          </Link>

          <Link
            to="/provider/deliveries"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#75d04b] hover:bg-green-50 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <MdLocalShipping className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">My Deliveries</p>
              <p className="text-sm text-gray-500">View active deliveries</p>
            </div>
          </Link>

          <Link
            to="/provider/batches"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#75d04b] hover:bg-green-50 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <MdLocalShipping className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Batches</p>
              <p className="text-sm text-gray-500">Manage delivery batches</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Service Unavailable Notice */}
      {!workSupported && !metrics.supported && !loadingMetrics && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Delivery Service Unavailable:</strong> The delivery service is not responding. Some features may be limited.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderOverview;
