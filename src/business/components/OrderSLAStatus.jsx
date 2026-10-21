import React, { useState, useEffect, useCallback } from 'react';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';
import orderService from '@/business/services/orders.service';

/**
 * OrderSLAStatus - Display order SLA countdown and status
 * 
 * @param {string} orderId - Order ID
 * @param {Object} slaData - Pre-fetched SLA data (optional)
 * @param {boolean} compact - Compact mode for table cells
 */
const OrderSLAStatus = ({ orderId, slaData: initialSlaData, compact = false }) => {
  const [slaData, setSlaData] = useState(initialSlaData || null);
  const [loading, setLoading] = useState(!initialSlaData);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isOverdue, setIsOverdue] = useState(false);

  // Fetch SLA data if not provided
  const fetchSLAData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderSLA(orderId);
      setSlaData(data);
    } catch (err) {
      console.error('Failed to fetch SLA:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!slaData?.deadline) return;
    
    const updateTimer = () => {
      const deadline = new Date(slaData.deadline);
      const now = new Date();
      const diff = deadline - now;
      
      if (diff <= 0) {
        setTimeRemaining({ overdue: true, text: 'Overdue' });
        setIsOverdue(true);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      let text = '';
      if (hours > 0) text = `${hours}h ${minutes}m`;
      else if (minutes > 0) text = `${minutes}m ${seconds}s`;
      else text = `${seconds}s`;
      
      setTimeRemaining({ overdue: false, text, hours, minutes, seconds });
      setIsOverdue(false);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [slaData]);

  useEffect(() => {
    if (!initialSlaData && orderId) {
      fetchSLAData();
    }
  }, [initialSlaData, orderId, fetchSLAData]);

  if (loading) {
    return compact 
      ? <span className="text-xs text-gray-400">Loading...</span>
      : <div className="flex items-center gap-2 text-sm text-gray-500"><FiClock size={16} /><span>Loading SLA...</span></div>;
  }

  if (!slaData) {
    return compact 
      ? <span className="text-xs text-gray-400">No SLA</span>
      : <div className="flex items-center gap-2 text-sm text-gray-500"><FiClock size={16} /><span>No SLA data</span></div>;
  }

  const statusColors = {
    pending: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  const statusIcons = {
    pending: FiClock,
    active: FiClock,
    warning: FiAlertTriangle,
    overdue: FiX,
    completed: FiCheckCircle,
  };

  const statusLabels = {
    pending: 'Pending',
    active: 'Active',
    warning: 'Warning',
    overdue: 'Overdue',
    completed: 'Completed',
  };

  const slaStatus = isOverdue ? 'overdue' : slaData.status || 'pending';
  const StatusIcon = statusIcons[slaStatus] || FiClock;
  
  const deadlineText = slaData.deadline 
    ? new Date(slaData.deadline).toLocaleString()
    : 'Not set';

  if (compact) {
    return (
      <span 
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColors[slaStatus]}`}
        title={`SLA: ${statusLabels[slaStatus]}${timeRemaining ? ` - ${timeRemaining.text}` : ''}`}
      >
        <StatusIcon size={12} />
        <span>
          {isOverdue ? 'Overdue' : timeRemaining?.text || statusLabels[slaStatus]}
        </span>
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${statusColors[slaStatus]}`}>
          <StatusIcon size={14} />
          <span>{statusLabels[slaStatus]}</span>
        </span>
        {slaData.fulfillmentTime && (
          <span className="text-xs text-gray-500">
            Fulfillment: {slaData.fulfillmentTime}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500 uppercase">Deadline</p>
          <p className="font-medium text-gray-900">{deadlineText}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500 uppercase">Time Remaining</p>
          <p className={`font-mono font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            {timeRemaining?.text || '—'}
          </p>
        </div>
      </div>

      {slaData.warningThreshold && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
          <FiAlertTriangle size={12} className="inline mr-1" />
          Warning at: {new Date(slaData.warningThreshold).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default OrderSLAStatus;
