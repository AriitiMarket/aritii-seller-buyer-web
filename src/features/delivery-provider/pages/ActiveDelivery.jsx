import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack, MdStore, MdLocationOn, MdCheck, MdCamera, MdAttachMoney, MdPhone, MdLocalShipping } from 'react-icons/md';
import { useProviderDelivery } from '../hooks/useProviderDelivery';
import { deliveryService } from '@/services/delivery.service';
import {
  DELIVERY_STATUSES,
  normalizeDeliveryStatus,
  getDeliveryStatusLabel,
  getDeliveryStatusColor,
  formatDeliveryAddress,
  shortReference,
  formatDeliveryTime,
  formatCurrency,
  formatPhoneNumber,
  calculateDeliveryProgress,
  apiErrorMessage
} from '../utils/providerDeliveryHelpers';
import { toast } from 'react-toastify';

/**
 * ActiveDelivery - shows details and controls for an active delivery.
 * Supports pickup workflow, delivery stops, proof of delivery, and COD confirmation.
 */
const ActiveDelivery = () => {
  const { id } = useParams();
  const { delivery, loading, error, supported, updateStatus, confirmCod, getTracking } = useProviderDelivery(id);
  const [updating, setUpdating] = useState(false);
  const [showCodConfirm, setShowCodConfirm] = useState(false);
  const [codAmount, setCodAmount] = useState('');
  const [batch, setBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  const status = normalizeDeliveryStatus(delivery?.status);
  const progress = calculateDeliveryProgress(delivery?.status);

  // Fetch the batch this delivery belongs to (if any) to gate rider actions.
  useEffect(() => {
    if (!delivery?.assignmentId) {
      setBatch(null);
      return;
    }
    let cancelled = false;
    setBatchLoading(true);
    deliveryService
      .getMyDispatchBatch(delivery.assignmentId)
      .then((b) => {
        if (!cancelled) setBatch(b);
      })
      .catch(() => {
        if (!cancelled) setBatch(null);
      })
      .finally(() => {
        if (!cancelled) setBatchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [delivery?.assignmentId]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await updateStatus(id, newStatus);
      if (response.success) {
        toast.success('Status updated successfully');
      } else {
        toast.error(response.message || apiErrorMessage(response.error, 'Failed to update status'));
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to update status'));
    } finally {
      setUpdating(false);
    }
  };

  const handleAcceptBatch = async () => {
    if (!delivery?.assignmentId) return;
    setUpdating(true);
    try {
      const result = await deliveryService.respondToDispatchBatch(delivery.assignmentId, true);
      if (result) {
        toast.success('Batch assignment accepted');
        setBatch(result);
      } else {
        toast.error('Failed to accept batch assignment');
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to accept batch assignment'));
    } finally {
      setUpdating(false);
    }
  };

  const handleCodConfirm = async (e) => {
    e.preventDefault();
    if (!codAmount || isNaN(codAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }
    setUpdating(true);
    try {
      const response = await confirmCod(id, parseFloat(codAmount));
      if (response.success) {
        toast.success('Delivery completed and cash confirmed');
        setShowCodConfirm(false);
        setCodAmount('');
      } else {
        toast.error(response.message || apiErrorMessage(response.error, 'Failed to confirm COD'));
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to confirm COD'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Delivery</h1>
          <p className="text-gray-600 mt-1">Track and manage this delivery.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-gray-400">Loading delivery details...</div>
        </div>
      </div>
    );
  }

  if (!supported || !delivery) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Delivery</h1>
          <p className="text-gray-600 mt-1">Track and manage this delivery.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            {!supported 
              ? 'Delivery Service Unavailable: The delivery service is not responding. Delivery details cannot be loaded at this time.'
              : 'Delivery not found. The delivery may have been removed or you may not have access to it.'}
          </p>
        </div>
        <Link
          to="/provider/deliveries"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
        >
          Back to My Deliveries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/provider/deliveries"
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <MdArrowBack size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Active Delivery</h1>
          <p className="text-gray-600 mt-1">
            {shortReference(delivery._id)} • {getDeliveryStatusLabel(delivery.status)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Delivery Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#75d04b] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span>Assigned</span>
          <span>Picked Up</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          
          {/* Status */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getDeliveryStatusColor(delivery.status)}`}>
              {getDeliveryStatusLabel(delivery.status)}
            </span>
          </div>

          {/* Order Reference */}
          {delivery.orderId && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Order Reference</p>
              <p className="text-sm font-mono text-gray-900">{shortReference(delivery.orderId)}</p>
            </div>
          )}

          {/* Created/Updated */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Timeline</p>
            <p className="text-sm text-gray-600">
              Created {formatDeliveryTime(delivery.createdAt)}
              {delivery.updatedAt && ` • Updated ${formatDeliveryTime(delivery.updatedAt)}`}
            </p>
          </div>

          {/* COD Information */}
          {delivery.paymentMethod === 'COD' && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MdAttachMoney className="text-amber-600" size={20} />
                <p className="font-semibold text-amber-900">Cash on Delivery</p>
              </div>
              <p className="text-lg font-bold text-amber-900 mb-2">
                {formatCurrency(delivery.paymentAmount)}
              </p>
              {delivery.proofOfDelivery?.codConfirmed ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Collected
                </span>
              ) : status === DELIVERY_STATUSES.IN_TRANSIT ? (
                <button
                  onClick={() => setShowCodConfirm(true)}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded text-sm font-medium hover:bg-amber-700 transition"
                >
                  Confirm &amp; Complete
                </button>
              ) : <span className="text-xs text-amber-800">Confirm collection after starting delivery.</span>}
            </div>
          )}

          {/* Proof Required */}
          {delivery.proofRequired && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MdCamera className="text-blue-600" size={20} />
                <p className="font-semibold text-blue-900">Proof of Delivery Required</p>
              </div>
              {delivery.proofSubmitted ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Submitted
                </span>
              ) : (
                <p className="text-xs text-blue-800">
                  Proof (photo, signature, or COD confirmation) is submitted when you mark the delivery complete.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Route Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h2>
          
          {/* Pickup */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <MdStore className="text-blue-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Pickup Location</p>
                <p className="text-sm text-gray-600 mb-1">
                  {formatDeliveryAddress(delivery.origin) || 'Address not specified'}
                </p>
                {delivery.sellerName && (
                  <p className="text-xs text-gray-500">{delivery.sellerName}</p>
                )}
                {delivery.sellerPhone && (
                  <a
                    href={`tel:${delivery.sellerPhone}`}
                    className="flex items-center gap-1 text-sm text-[#75d04b] hover:underline mt-1"
                  >
                    <MdPhone size={14} />
                    {formatPhoneNumber(delivery.sellerPhone)}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Destination */}
          <div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <MdLocationOn className="text-green-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Delivery Destination</p>
                <p className="text-sm text-gray-600 mb-1">
                  {formatDeliveryAddress(delivery.destination) || 'Address not specified'}
                </p>
                {delivery.buyerName && (
                  <p className="text-xs text-gray-500">{delivery.buyerName}</p>
                )}
                {delivery.buyerPhone && (
                  <a
                    href={`tel:${delivery.buyerPhone}`}
                    className="flex items-center gap-1 text-sm text-[#75d04b] hover:underline mt-1"
                  >
                    <MdPhone size={14} />
                    {formatPhoneNumber(delivery.buyerPhone)}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Instructions */}
          {delivery.deliveryInstructions && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Delivery Instructions</p>
              <p className="text-sm text-gray-600">{delivery.deliveryInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {batchLoading && (
            <span className="text-sm text-gray-500">Loading batch info…</span>
          )}

          {!batchLoading && !batch && delivery?.assignmentId && (
            <div className="px-4 py-2.5 bg-amber-50 text-amber-800 rounded-lg font-medium text-sm">
              This delivery is not part of a batch. Contact operations for assistance.
            </div>
          )}

          {!batchLoading && batch?.status === 'waiting_acceptance' && (
            <button
              onClick={handleAcceptBatch}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdCheck size={18} />
              {updating ? 'Accepting...' : 'Accept Assignment'}
            </button>
          )}

          {!batchLoading && batch && batch.status !== 'waiting_acceptance' && status === DELIVERY_STATUSES.ASSIGNED && (
            <button
              onClick={() => handleStatusUpdate(DELIVERY_STATUSES.PICKUP)}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdStore size={18} />
              {updating ? 'Updating...' : 'Start Pickup'}
            </button>
          )}

          {!batchLoading && batch && batch.status !== 'waiting_acceptance' && status === DELIVERY_STATUSES.PICKUP && (
            <button
              onClick={() => handleStatusUpdate(DELIVERY_STATUSES.IN_TRANSIT)}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdLocalShipping size={18} />
              {updating ? 'Updating...' : 'Start Delivery'}
            </button>
          )}

          {!batchLoading && batch && batch.status !== 'waiting_acceptance' && status === DELIVERY_STATUSES.IN_TRANSIT && (
            <button
              onClick={() => handleStatusUpdate(DELIVERY_STATUSES.DELIVERED)}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdCheck size={18} />
              {updating ? 'Updating...' : 'Mark Delivered'}
            </button>
          )}

          {status === DELIVERY_STATUSES.DELIVERED && (
            <div className="px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium">
              ✓ Delivery Completed
            </div>
          )}

          {!batchLoading && !['assigned', 'pickup', 'in_transit', 'delivered'].includes(status) && (
            <div className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg font-medium text-sm">
              This delivery is being handled by operations.
            </div>
          )}
        </div>
      </div>

      {/* COD Confirmation Modal */}
      {showCodConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm COD &amp; Complete Delivery</h3>
            <p className="text-sm text-gray-600 mb-4">
              This records the cash you collected and marks the delivery complete.
            </p>
            <form onSubmit={handleCodConfirm}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Collected (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  placeholder={delivery.paymentAmount?.toString()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50"
                >
                  {updating ? 'Confirming...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCodConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDelivery;
