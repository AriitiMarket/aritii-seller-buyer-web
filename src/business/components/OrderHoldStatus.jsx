import React, { useState } from 'react';
import { FiPauseCircle, FiPlayCircle, FiAlertTriangle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderService from '@/business/services/orders.service';

/**
 * OrderHoldStatus - Hold/Release order component
 * Shows hold status and provides hold/release actions
 */
const OrderHoldStatus = ({ 
  orderId, 
  currentStatus, 
  isHeld = false, 
  onStatusChange,
  compact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [holdReason, setHoldReason] = useState('');

  if (compact) {
    if (isHeld) {
      return (
        <span 
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full"
          title="Order on hold"
        >
          <FiPauseCircle size={12} />
          <span>On Hold</span>
        </span>
      );
    }
    return null;
  }

  const handleHold = async () => {
    if (!holdReason.trim()) {
      toast.error('Please provide a reason for holding this order');
      return;
    }

    setIsLoading(true);
    try {
      await orderService.holdOrder(orderId, holdReason);
      toast.success('Order placed on hold');
      onStatusChange?.('HOLD');
      setShowModal(false);
      setHoldReason('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to hold order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelease = async () => {
    setIsLoading(true);
    try {
      await orderService.releaseOrder(orderId);
      toast.success('Order released from hold');
      onStatusChange?.(currentStatus);
      setShowModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to release order');
    } finally {
      setIsLoading(false);
    }
  };

  const openHoldModal = () => {
    setModalAction('hold');
    setShowModal(true);
  };

  const openReleaseModal = () => {
    setModalAction('release');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setHoldReason('');
  };

  return (
    <>
      {isHeld && (
        <div className="flex items-center gap-2 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <FiAlertTriangle className="text-amber-600" size={20} />
          <div className="flex-1">
            <p className="font-medium text-amber-800">Order On Hold</p>
            <p className="text-sm text-amber-700">This order cannot be processed until released</p>
          </div>
          <button
            onClick={openReleaseModal}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            <FiPlayCircle size={14} className="mr-1" />
            Release
          </button>
        </div>
      )}

      {!isHeld && (
        <button
          onClick={openHoldModal}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 disabled:opacity-50 transition flex items-center gap-1.5"
        >
          <FiPauseCircle size={14} />
          Hold Order
        </button>
      )}

      {/* Hold/Release Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modalAction === 'hold' ? 'Place Order on Hold' : 'Release Order from Hold'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            {modalAction === 'hold' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This will prevent the order from being processed. The buyer will be notified.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Hold *</label>
                  <textarea
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                    rows={3}
                    placeholder="e.g., Waiting for customer confirmation, Inventory issue, Payment verification..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleHold}
                    disabled={isLoading || !holdReason.trim()}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium"
                  >
                    {isLoading ? 'Holding...' : 'Confirm Hold'}
                  </button>
                </div>
              </div>
            )}

            {modalAction === 'release' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  This will allow the order to proceed through normal processing.
                </p>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRelease}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {isLoading ? 'Releasing...' : 'Confirm Release'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHoldStatus;
