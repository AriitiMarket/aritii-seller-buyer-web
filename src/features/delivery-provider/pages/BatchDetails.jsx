import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack, MdStore, MdLocationOn, MdInventory, MdRoute } from 'react-icons/md';
import { useProviderBatches } from '../hooks/useProviderBatches';
import { deliveryService } from '@/services/delivery.service';
import { toast } from 'react-toastify';
import {
  shortReference,
  formatDeliveryAddress,
  formatDeliveryTime,
  DELIVERY_STATUSES,
  normalizeDeliveryStatus,
  getDeliveryStatusLabel,
  getDeliveryStatusColor,
  calculateBatchProgress,
  apiErrorMessage
} from '../utils/providerDeliveryHelpers';

/**
 * BatchDetails - shows details of a specific delivery batch with pickup and delivery stops.
 */
const BatchDetails = () => {
  const { id } = useParams();
  const { batch, loading, error, supported, runBatchAction, refetch } = useProviderBatches({ routeId: id });
  const [responding, setResponding] = useState(false);
  const [actioning, setActioning] = useState(false);

  const handleRespond = async (accepted) => {
    setResponding(true);
    try {
      const result = await deliveryService.respondToDispatchBatch(id, accepted);
      if (result) {
        toast.success(accepted ? 'Batch accepted' : 'Batch declined');
        await refetch();
      } else {
        toast.error('Failed to respond to batch');
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to respond to batch'));
    } finally {
      setResponding(false);
    }
  };

  const handleBatchAction = async (action, ...args) => {
    setActioning(true);
    try {
      await runBatchAction(action, ...args);
      toast.success('Action completed');
      await refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err, `Failed to ${action}`));
    } finally {
      setActioning(false);
    }
  };

  const deliverOrder = (item) => {
    let proof = {};
    if (item.paymentMethod === 'COD') {
      const amount = window.prompt(`Confirm cash collected (order total: ${item.paymentAmount})`);
      if (amount === null) return;
      const collected = Number(amount);
      if (!Number.isFinite(collected) || collected !== Number(item.paymentAmount)) {
        window.alert('Enter the exact order total to confirm COD collection.');
        return;
      }
      proof = { proofOfDelivery: { codConfirmed: true, codCollectedAmount: collected, confirmedAt: new Date().toISOString() } };
    }
    handleBatchAction('confirmDispatchDelivery', batch.id, item.orderId, proof);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
          <p className="text-gray-600 mt-1">View batch information and delivery stops.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-gray-400">Loading batch details...</div>
        </div>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/provider/batches"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <MdArrowBack size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
            <p className="text-gray-600 mt-1">View batch information and delivery stops.</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Batch Management Not Available:</strong> Batch functionality is not currently supported by the delivery service. Use individual assignments instead.
          </p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/provider/batches"
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <MdArrowBack size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
            <p className="text-gray-600 mt-1">View batch information and delivery stops.</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            {error ? `Could not load this batch: ${apiErrorMessage(error, 'Please retry.')}` : 'Batch not found. It may have been removed or you may not have access to it.'}
          </p>
        </div>
        <Link
          to="/provider/batches"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
        >
          Back to Batches
        </Link>
      </div>
    );
  }

  const assignments = batch.assignments || [];
  const progress = calculateBatchProgress(assignments);
  const batchStatus = batch.originalStatus || batch.status;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/provider/batches"
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <MdArrowBack size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
          <p className="text-gray-600 mt-1">
            {shortReference(batch.id)} • {batch.count} order{batch.count > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Batch Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Batch Overview</h2>
          <div className="flex items-center gap-2">
            <MdRoute className="text-gray-500" size={20} />
            <span className="text-sm text-gray-600">{progress}% Complete</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-[#75d04b] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="font-semibold text-gray-900">{batch.count}</p>
          </div>
          <div>
            <p className="text-gray-500">Completed</p>
            <p className="font-semibold text-gray-900">
              {assignments.filter(a => normalizeDeliveryStatus(a.status) === DELIVERY_STATUSES.DELIVERED).length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">In Progress</p>
            <p className="font-semibold text-gray-900">
              {assignments.filter(a => {
                const s = normalizeDeliveryStatus(a.status);
                return s === DELIVERY_STATUSES.ASSIGNED || s === DELIVERY_STATUSES.PICKUP || s === DELIVERY_STATUSES.IN_TRANSIT;
              }).length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-semibold text-gray-900">{formatDeliveryTime(batch.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Delivery Stops */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Stops</h2>
        
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No deliveries in this batch</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment, index) => {
              const status = normalizeDeliveryStatus(assignment.status);
              const isCompleted = status === DELIVERY_STATUSES.DELIVERED;
              const isCurrent = !isCompleted && (status === DELIVERY_STATUSES.ASSIGNED || status === DELIVERY_STATUSES.PICKUP || status === DELIVERY_STATUSES.IN_TRANSIT);
              
              return (
                <div
                  key={assignment._id}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : isCurrent 
                        ? 'border-[#75d04b] bg-green-50' 
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Stop Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-[#75d04b] text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        {shortReference(assignment._id)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDeliveryStatusColor(assignment.status)}`}>
                        {getDeliveryStatusLabel(assignment.status)}
                      </span>
                    </div>

                    {/* Pickup */}
                    <div className="flex items-start gap-2 mb-2">
                      <MdStore className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm text-gray-900 truncate">
                          {formatDeliveryAddress(assignment.pickupAddress) || 'Address not specified'}
                        </p>
                        {assignment.sellerName && (
                          <p className="text-xs text-gray-500">{assignment.sellerName}</p>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-2">
                      <MdLocationOn className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm text-gray-900 truncate">
                          {formatDeliveryAddress(assignment.dropoffAddress || assignment.deliveryAddress) || 'Address not specified'}
                        </p>
                        {assignment.buyerName && (
                          <p className="text-xs text-gray-500">{assignment.buyerName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {assignment.itemCount && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                      <MdInventory size={16} />
                      <span>{assignment.itemCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="flex gap-3">
        {batchStatus === 'waiting_acceptance' && (
          <>
            <button
              onClick={() => handleRespond(true)}
              disabled={responding}
              className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
            >
              {responding ? 'Accepting...' : 'Accept Batch'}
            </button>
            <button
              onClick={() => handleRespond(false)}
              disabled={responding}
              className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
            >
              {responding ? 'Declining...' : 'Decline'}
            </button>
          </>
        )}
        {batchStatus === 'accepted' && (
          <button
            onClick={() => handleBatchAction('startDispatchPickup', batch.id)}
            disabled={actioning}
            className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
          >
            {actioning ? 'Starting...' : 'Start Pickup'}
          </button>
        )}
        {batchStatus === 'picking_up' && (batch.pickupPlan || []).filter((stop) => !stop.completed).map((stop) => (
          <button
            key={stop.sellerId}
            onClick={() => handleBatchAction('confirmDispatchPickup', batch.id, stop.sellerId)}
            disabled={actioning}
            className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
          >
            {actioning ? 'Confirming...' : `Confirm pickup: ${stop.shopName || stop.sellerName}`}
          </button>
        ))}
        {batchStatus === 'picked_up' && (
          <button
            onClick={() => handleBatchAction('startDispatchTransit', batch.id)}
            disabled={actioning}
            className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
          >
            {actioning ? 'Starting...' : 'Start Delivery'}
          </button>
        )}
        {batchStatus === 'in_transit' && (batch.assignments || []).filter((item) => item.status !== 'delivered').map((item) => (
          <button
            key={item.orderId}
            onClick={() => deliverOrder(item)}
            disabled={actioning}
            className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
          >
            {actioning ? 'Processing...' : `Mark ${shortReference(item.orderId)} delivered`}
          </button>
        ))}
        <Link
          to="/provider/deliveries"
          className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition text-center"
        >
          View Individual Deliveries
        </Link>
      </div>
    </div>
  );
};

export default BatchDetails;
