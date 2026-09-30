import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdCheck, MdClose, MdStore, MdLocationOn, MdInventory, MdOutlineAssignment } from 'react-icons/md';
import { useAvailableWork } from '../hooks/useAvailableWork';
import {
  getDeliveryStatusLabel,
  getDeliveryStatusColor,
  formatDeliveryAddress,
  shortReference,
  formatDeliveryTime,
  formatCurrency,
  apiErrorMessage
} from '../utils/providerDeliveryHelpers';
import { toast } from 'react-toastify';

/**
 * AvailableWork - shows delivery assignments available for providers to accept.
 */
const AvailableWork = () => {
  const { assignments, count, loading, error, supported, respondToAssignment } = useAvailableWork();
  const [responding, setResponding] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Tick every second so expiry countdowns stay live.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const getTimeLeft = (expiresAt) => {
    if (!expiresAt) return null;
    const ms = new Date(expiresAt).getTime() - now;
    if (ms <= 0) return 'Expired';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAccept = async (assignmentId) => {
    setResponding(assignmentId);
    try {
      const response = await respondToAssignment(assignmentId, true);
      if (response.success) {
        toast.success('Assignment accepted successfully!');
      } else {
        toast.error(apiErrorMessage(response.error, 'Failed to accept assignment'));
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to accept assignment'));
    } finally {
      setResponding(null);
    }
  };

  const handleDecline = async (assignmentId) => {
    setResponding(assignmentId);
    try {
      const response = await respondToAssignment(assignmentId, false, 'Declined by provider');
      if (response.success) {
        toast.success('Assignment declined');
      } else {
        toast.error(apiErrorMessage(response.error, 'Failed to decline assignment'));
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to decline assignment'));
    } finally {
      setResponding(null);
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
            <strong>Delivery Service Unavailable:</strong> The delivery service is not responding. Available work cannot be loaded at this time.
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
            {count} assignment{count !== 1 ? 's' : ''} available for acceptance
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <MdOutlineAssignment className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No available assignments</h3>
          <p className="text-gray-500 mb-4">
            There are no delivery assignments available at the moment. Check back later.
          </p>
          <Link
            to="/provider"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
          >
            Return to Overview
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Assignment Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-gray-500">
                      {shortReference(assignment._id)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(assignment.status)}`}>
                      {getDeliveryStatusLabel(assignment.status)}
                    </span>
                    {assignment.expiresAt && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getTimeLeft(assignment.expiresAt) === 'Expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        Expires in {getTimeLeft(assignment.expiresAt)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {assignment.deliveryRequestId || assignment.orderId ? (
                      <span>Delivery Request {shortReference(assignment.deliveryRequestId || assignment.orderId)}</span>
                    ) : (
                      'Delivery Assignment'
                    )}
                  </h3>

                  {/* Pickup */}
                  <div className="flex items-start gap-2 mb-3">
                    <MdStore className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-600 truncate">
                        {formatDeliveryAddress(assignment.pickupAddress) || 'Address not specified'}
                      </p>
                      {assignment.sellerName && (
                        <p className="text-xs text-gray-500">{assignment.sellerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-2 mb-3">
                    <MdLocationOn className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Destination</p>
                      <p className="text-sm text-gray-600 truncate">
                        {formatDeliveryAddress(assignment.deliveryAddress) || 'Address not specified'}
                      </p>
                      {assignment.buyerName && (
                        <p className="text-xs text-gray-500">{assignment.buyerName}</p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {assignment.itemCount && (
                      <div className="flex items-center gap-1">
                        <MdInventory size={16} />
                        <span>{assignment.itemCount} item{assignment.itemCount > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {assignment.createdAt && (
                      <span>Posted {formatDeliveryTime(assignment.createdAt)}</span>
                    )}
                    {assignment.estimatedEarnings && (
                      <span className="font-semibold text-green-700">
                        {formatCurrency(assignment.estimatedEarnings)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                  <button
                    onClick={() => handleAccept(assignment._id)}
                    disabled={responding === assignment._id}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding === assignment._id ? (
                      <span>Accepting...</span>
                    ) : (
                      <>
                        <MdCheck size={18} />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDecline(assignment._id)}
                    disabled={responding === assignment._id}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding === assignment._id ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableWork;
