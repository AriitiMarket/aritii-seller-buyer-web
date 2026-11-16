import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdLocalShipping, MdFilterList, MdStore, MdLocationOn, MdInventory, MdRefresh } from 'react-icons/md';
import { useProviderDelivery } from '../hooks/useProviderDelivery';
import { 
  DELIVERY_STATUSES, 
  getDeliveryStatusLabel, 
  getDeliveryStatusColor, 
  formatDeliveryAddress, 
  shortReference,
  formatDeliveryTime,
  apiErrorMessage,
} from '../utils/providerDeliveryHelpers';

/**
 * MyDeliveries - shows provider's active and completed deliveries with filtering.
 */
const MyDeliveries = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const search = searchParams.get('search') || '';
  useEffect(() => { setPage(1); }, [search]);
  const { deliveries, total, totalPages, loading, error, supported, refetch } = useProviderDelivery(null, {
    limit: 50,
    page,
    status: filter === 'all' ? undefined : filter,
    search,
  });
  const filteredDeliveries = deliveries;
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const selectFilter = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
          <p className="text-gray-600 mt-1">Manage your delivery assignments.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-gray-400">Loading deliveries...</div>
        </div>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
          <p className="text-gray-600 mt-1">Manage your delivery assignments.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Deliveries could not be loaded:</strong> {apiErrorMessage(error, 'The delivery service is not responding.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
          <p className="text-gray-600 mt-1">
            {total} matching deliver{total !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
        >
          <MdRefresh size={18} />
          Refresh
        </button>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MdFilterList className="text-gray-500" size={18} />
          <span className="text-sm font-medium text-gray-700">Filter by status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.ASSIGNED)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === DELIVERY_STATUSES.ASSIGNED
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.REASSIGNED)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === DELIVERY_STATUSES.REASSIGNED ? 'bg-[#75d04b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Reassigned
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.PICKUP)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === DELIVERY_STATUSES.PICKUP
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Picking Up
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.IN_TRANSIT)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === DELIVERY_STATUSES.IN_TRANSIT
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Transit
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.DELIVERED)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === DELIVERY_STATUSES.DELIVERED
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.CANCELLED)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === DELIVERY_STATUSES.CANCELLED ? 'bg-[#75d04b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancelled
          </button>
          <button
            onClick={() => selectFilter(DELIVERY_STATUSES.FAILED)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === DELIVERY_STATUSES.FAILED
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <MdLocalShipping className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No deliveries yet' : `No ${getDeliveryStatusLabel(filter)} deliveries`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all'
              ? 'You have no delivery assignments yet. Check available work to get started.'
              : `There are no deliveries with status "${getDeliveryStatusLabel(filter)}".`}
          </p>
          {filter === 'all' && (
            <Link
              to="/provider/available-work"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
            >
              Browse Available Work
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Delivery Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-gray-500">
                      {shortReference(delivery._id)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                      {getDeliveryStatusLabel(delivery.status)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {delivery.orderId ? (
                      <span>Order {shortReference(delivery.orderId)}</span>
                    ) : (
                      'Delivery'
                    )}
                  </h3>

                  {/* Pickup */}
                  <div className="flex items-start gap-2 mb-3">
                    <MdStore className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-600 truncate">
                        {formatDeliveryAddress(delivery.pickupAddress) || 'Address not specified'}
                      </p>
                      {delivery.sellerName && (
                        <p className="text-xs text-gray-500">{delivery.sellerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-2 mb-3">
                    <MdLocationOn className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Destination</p>
                      <p className="text-sm text-gray-600 truncate">
                        {formatDeliveryAddress(delivery.deliveryAddress) || 'Address not specified'}
                      </p>
                      {delivery.buyerName && (
                        <p className="text-xs text-gray-500">{delivery.buyerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {delivery.itemCount && (
                      <div className="flex items-center gap-1">
                        <MdInventory size={16} />
                        <span>{delivery.itemCount} item{delivery.itemCount > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {delivery.createdAt && (
                      <span>Created {formatDeliveryTime(delivery.createdAt)}</span>
                    )}
                    {delivery.updatedAt && (
                      <span>Updated {formatDeliveryTime(delivery.updatedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                  <Link
                    to={`/provider/deliveries/${delivery._id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Previous</button>
            <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDeliveries;
