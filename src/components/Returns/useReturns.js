import React, { useState, useCallback, useEffect } from 'react';
import { returnsService } from '@/services/returns.service';

/**
 * Returns Management Hook with full workflow
 */
export function useReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const clearError = useCallback(() => setError(null), []);

  const loadReturns = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await returnsService.listReturns(params);
      setReturns(result.returns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const requestReturn = useCallback(async (orderId, returnData) => {
    if (!orderId || !returnData) {
      setError('Order ID and return data are required');
      return null;
    }

    setActionLoading((prev) => ({ ...prev, [orderId]: true }));
    setError(null);

    try {
      const result = await returnsService.requestReturn(orderId, returnData);
      await loadReturns(); // Reload list
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  }, [loadReturns]);

  const approveReturn = useCallback(async (returnId, approvalData = {}) => {
    if (!returnId) {
      setError('Return ID is required');
      return false;
    }

    setActionLoading((prev) => ({ ...prev, [returnId]: true }));
    setError(null);

    try {
      await returnsService.approveReturn(returnId, approvalData);
      await loadReturns(); // Reload
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, [returnId]: false }));
    }
  }, [loadReturns]);

  const rejectReturn = useCallback(async (returnId, reason) => {
    if (!returnId || !reason) {
      setError('Return ID and rejection reason are required');
      return false;
    }

    setActionLoading((prev) => ({ ...prev, [returnId]: true }));
    setError(null);

    try {
      await returnsService.rejectReturn(returnId, reason);
      await loadReturns();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, [returnId]: false }));
    }
  }, [loadReturns]);

  const processRefund = useCallback(async (returnId, refundData = {}) => {
    if (!returnId) {
      setError('Return ID is required');
      return false;
    }

    setActionLoading((prev) => ({ ...prev, [returnId]: true }));
    setError(null);

    try {
      await returnsService.processRefund(returnId, refundData);
      await loadReturns();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, [returnId]: false }));
    }
  }, [loadReturns]);

  return {
    returns,
    loading,
    error,
    actionLoading,
    clearError,
    loadReturns,
    requestReturn,
    approveReturn,
    rejectReturn,
    processRefund,
  };
}

/**
 * Return Status Timeline Component
 */
export function ReturnTimeline({ returnData }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await returnsService.getReturnStatus(returnData._id || returnData.id);
        setStatus(data);
      } catch (err) {
        console.error('Failed to load return status:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [returnData]);

  if (loading) return <div>Loading...</div>;
  if (!status) return null;

  const getStepStyle = (completed) => ({
    opacity: completed ? 1 : 0.5,
    color: completed ? '#4CAF50' : '#999',
  });

  return (
    <div className="return-timeline">
      <div className="timeline-container">
        {status.steps.map((step, idx) => (
          <div key={idx} className="timeline-step" style={getStepStyle(step.completed)}>
            <div className="step-circle">
              {step.completed ? '✓' : idx + 1}
            </div>
            <div className="step-content">
              <p className="step-title">{step.step}</p>
              {step.date && <p className="step-date">{new Date(step.date).toLocaleDateString()}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Return List Component
 */
export function ReturnsList({ returns, loading, error, onApprove, onReject, onRefund, actionLoading }) {
  if (loading) return <div>Loading returns...</div>;

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!returns || returns.length === 0) {
    return <div className="no-data">No returns found</div>;
  }

  return (
    <div className="returns-list">
      {returns.map((ret) => (
        <ReturnItem
          key={ret._id || ret.id}
          returnItem={ret}
          isLoading={actionLoading?.[ret._id || ret.id]}
          onApprove={onApprove}
          onReject={onReject}
          onRefund={onRefund}
        />
      ))}
    </div>
  );
}

/**
 * Individual Return Item Component
 */
function ReturnItem({ returnItem, isLoading, onApprove, onReject, onRefund }) {
  const [showActions, setShowActions] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const returnId = returnItem._id || returnItem.id;
  const isPending = returnItem.status === 'PENDING';
  const isApproved = returnItem.status === 'APPROVED';

  return (
    <div className="return-item">
      <div className="return-header">
        <div>
          <h4>Return #{returnId}</h4>
          <p className="order-ref">Order: {returnItem.orderId}</p>
        </div>
        <span className={`status-badge status-${returnItem.status.toLowerCase()}`}>
          {returnItem.status}
        </span>
      </div>

      <div className="return-items">
        {returnItem.items?.map((item, idx) => (
          <div key={idx} className="return-item-row">
            <span>{item.productName}</span>
            <span className="qty">Qty: {item.quantity}</span>
            <span className="price">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="return-reason">
        <strong>Reason:</strong> {returnItem.reason}
      </div>

      {returnItem.notes && (
        <div className="return-notes">
          <strong>Notes:</strong> {returnItem.notes}
        </div>
      )}

      <div className="return-actions">
        {isPending && (
          <>
            <button
              onClick={() => onApprove?.(returnId)}
              disabled={isLoading}
              className="btn btn-success"
            >
              {isLoading ? 'Processing...' : 'Approve Return'}
            </button>

            <button
              onClick={() => setShowActions(!showActions)}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              Reject Return
            </button>
          </>
        )}

        {isApproved && (
          <button
            onClick={() => onRefund?.(returnId)}
            disabled={isLoading}
            className="btn btn-info"
          >
            {isLoading ? 'Processing...' : 'Process Refund'}
          </button>
        )}
      </div>

      {showActions && (
        <div className="rejection-form">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows="3"
          />
          <div className="form-actions">
            <button
              onClick={() => onReject?.(returnId, rejectionReason)}
              disabled={isLoading || !rejectionReason}
              className="btn btn-danger"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => {
                setShowActions(false);
                setRejectionReason('');
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
