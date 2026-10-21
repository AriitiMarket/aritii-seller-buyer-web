import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdCheck, MdClose, MdStore, MdLocationOn, MdInventory, MdOutlineAssignment } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useProviderBatches } from '../hooks/useProviderBatches';
import {
  BATCH_STATUS,
  getBatchStatusLabel,
  getBatchStatusColor,
  formatDeliveryAddress,
  shortReference,
  formatDeliveryTime,
  formatCurrency,
  apiErrorMessage
} from '../utils/providerDeliveryHelpers';

/**
 * AvailableWork - the work offered to this rider, waiting for their answer.
 *
 * Work reaches a rider as a DISPATCH BATCH (the grouped assignment the admin
 * creates for them), not as a row of the legacy single `Assignment`
 * collection — so this page reads the rider's own batches and shows the ones
 * still awaiting their response. Reading the assignment collection here made
 * the page permanently empty ("No available assignments"), while the work it
 * was meant to offer sat on the Batches page as "Available".
 */
const AvailableWork = () => {
  const { batches, loading, error, supported, acceptBatch, rejectBatch, refetch } = useProviderBatches({ page: 1, limit: 50 });
  const [respondingId, setRespondingId] = useState(null);

  // Only the batches that are still waiting for this rider's answer.
  const offers = useMemo(
    () => batches.filter((batch) => batch.originalStatus === 'waiting_acceptance'),
    [batches],
  );

  useEffect(() => {
    if (error) console.error('Available work error:', error);
  }, [error]);

  const handleAccept = async (batchId) => {
    setRespondingId(batchId);
    try {
      await acceptBatch(batchId);
      toast.success('Assignment accepted — you can start the pickup leg');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to accept this assignment'));
    } finally {
      setRespondingId(null);
    }
  };

  const handleDecline = async (batchId) => {
    setRespondingId(batchId);
    try {
      await rejectBatch(batchId, 'Declined by provider');
      toast.success('Assignment declined');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to decline this assignment'));
    } finally {
      setRespondingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Work</h1>
          <p className="text-gray-600 mt-1">Browse and accept delivery assignments.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-gray-400">Loading assignments...</div>
        </div>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Work</h1>
          <p className="text-gray-600 mt-1">Browse and accept delivery assignments.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Available work could not be loaded:</strong> {apiErrorMessage(error, 'The delivery service is not responding.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Work</h1>
          <p className="text-gray-600 mt-1">
            {offers.length} assignment{offers.length !== 1 ? 's' : ''} waiting for your response
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {apiErrorMessage(error, 'Could not load available work.')}
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <MdOutlineAssignment className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No available assignments</h3>
          <p className="text-gray-500 mb-4">
            There are no delivery assignments available at the moment. Check back later, or look at the
            batches already assigned to you.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/provider/batches"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
            >
              My Batches
            </Link>
            <Link
              to="/provider"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {offers.map((batch) => {
            const stops = batch.assignments || [];
            // One checkout can span several shops: the platform splits it into
            // one seller order per shop, and the rider collects the parcel at
            // EVERY one of them. The card therefore lists each seller stop,
            // not just the first delivery's shop.
            const stopsBySeller = [];
            stops.forEach((stop) => {
              const key = stop.sellerId || stop.sellerName || 'seller';
              const known = stopsBySeller.find((entry) => entry.key === key);
              if (known) {
                known.orders.push(stop);
                return;
              }
              stopsBySeller.push({
                key,
                shopName: stop.sellerName || stop.pickupAddress?.shopName || '',
                address: stop.pickupAddress,
                orders: [stop],
              });
            });
            const earnings = stops.reduce(
              (sum, stop) => sum + Number(stop.paymentAmount || 0),
              0,
            );
            return (
              <div key={batch.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-mono text-gray-500">{batch.reference || shortReference(batch.id)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchStatusColor(batch.status || BATCH_STATUS.AVAILABLE)}`}>
                        {getBatchStatusLabel(batch.status || BATCH_STATUS.AVAILABLE)}
                      </span>
                      {batch.createdAt && (
                        <span className="text-xs text-gray-500">Posted {formatDeliveryTime(batch.createdAt)}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {batch.reference ? `Delivery Batch ${batch.reference}` : 'Delivery Batch'}
                    </h3>

                    {/* Pickup — one entry per shop the rider collects from */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">Pickup</p>
                      {stopsBySeller.map((stop) => (
                        <div key={stop.key} className="flex items-start gap-2 mb-1">
                          <MdStore className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600 truncate">
                              {formatDeliveryAddress(stop.address) || 'Address not specified'}
                            </p>
                            {stop.shopName && <p className="text-xs text-gray-500">{stop.shopName}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Destination — one entry per order in the batch */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">Destination</p>
                      {stops.map((stop) => (
                        <div key={stop._id || stop.orderId} className="flex items-start gap-2 mb-1">
                          <MdLocationOn className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600 truncate">
                              {formatDeliveryAddress(stop.dropoffAddress) || 'Address not specified'}
                            </p>
                            {stop.buyerName && <p className="text-xs text-gray-500">{stop.buyerName}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MdInventory size={16} />
                        <span>{batch.count} order{batch.count > 1 ? 's' : ''}</span>
                      </div>
                      {stopsBySeller.length > 1 && (
                        <span className="text-gray-500">from {stopsBySeller.length} shops</span>
                      )}
                      {earnings > 0 && (
                        <span className="font-semibold text-green-700">{formatCurrency(earnings)} to collect</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => handleAccept(batch.id)}
                      disabled={respondingId === batch.id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {respondingId === batch.id ? (
                        <span>Accepting...</span>
                      ) : (
                        <>
                          <MdCheck size={18} />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecline(batch.id)}
                      disabled={respondingId === batch.id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {respondingId === batch.id ? (
                        <span>Declining...</span>
                      ) : (
                        <>
                          <MdClose size={18} />
                          Decline
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableWork;
