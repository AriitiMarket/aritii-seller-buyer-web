import React, { useState, useEffect, useCallback } from 'react';
import returnsService from '@/business/services/returns.service';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import './SellerFinancePages.css';

/**
 * SELLER REFUND MANAGEMENT PAGE - Handle customer refund requests
 *
 * All requests go through `returnsService`, which uses the shared axios
 * client. The backend exposes the seller returns dashboard at
 * GET /return/shop/:shopId/dashboard and approves/rejects with POST.
 */
export function RefundManagementPage() {
  const { activeShopId: shopId } = useBusinessShops();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundAction, setRefundAction] = useState(null);
  const [actionReason, setActionReason] = useState('');

  const loadRefunds = useCallback(async () => {
    if (!shopId) {
      setRefunds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await returnsService.getSellerReturnsDashboard(shopId);
      const rows = data?.returns || data?.data?.returns || [];
      setRefunds(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(err.message || 'Failed to load refunds');
      console.error('Load refunds error:', err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const handleApproveRefund = async (refundId, reason = '') => {
    try {
      setActionLoading(true);
      setError(null);

      // Send approval to backend. The route is POST /return/:returnId/approve.
      await returnsService.approveReturn(refundId);

      // Update local state
      setRefunds((prev) =>
        prev.map((r) =>
          r.id === refundId
            ? {
                ...r,
                status: 'APPROVED',
                approvedAt: new Date().toISOString(),
                approvalNotes: reason,
              }
            : r
        )
      );
      setSelectedRefund(null);
      setRefundAction(null);
    } catch (err) {
      setError(err.message || 'Failed to approve refund');
      console.error('Approve refund error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRefund = async (refundId, reason) => {
    try {
      setActionLoading(true);
      setError(null);

      // Send rejection to backend. The route is POST /return/:returnId/reject.
      await returnsService.rejectReturn(refundId, reason);

      // Update local state
      setRefunds((prev) =>
        prev.map((r) =>
          r.id === refundId
            ? {
                ...r,
                status: 'REJECTED',
                rejectedAt: new Date().toISOString(),
                rejectionReason: reason,
              }
            : r
        )
      );
      setSelectedRefund(null);
      setRefundAction(null);
    } catch (err) {
      setError(err.message || 'Failed to reject refund');
      console.error('Reject refund error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRefunds = refunds.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  );

  const stats = {
    pending: refunds.filter((r) => r.status === 'PENDING').length,
    approved: refunds.filter((r) => r.status === 'APPROVED').length,
    rejected: refunds.filter((r) => r.status === 'REJECTED').length,
    totalAmount: refunds
      .filter((r) => r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="seller-refund-management-page">
      <div className="page-header">
        <h1>Refund Requests</h1>
        <p>Manage and respond to customer refund requests</p>
      </div>

      {error && (
        <div className="alert alert-error" onClick={() => setError(null)}>
          {error} ✕
        </div>
      )}

      {loading ? (
        <div className="loading-state"><p>Loading refunds...</p></div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Pending Refunds" value={stats.pending} icon="⏱️" color="warning" />
            <StatCard label="Approved" value={stats.approved} icon="✓" color="success" />
            <StatCard label="Rejected" value={stats.rejected} icon="✗" color="error" />
            <StatCard label="Total Amount" value={`${stats.totalAmount.toLocaleString()} ETB`} icon="💰" />
          </div>

          <div className="filter-group">
            <label>Filter:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Refunds</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {filteredRefunds.length === 0 ? (
            <div className="empty-state"><p>No refunds to display</p></div>
          ) : (
            <div className="refunds-list">
              {filteredRefunds.map((refund) => (
                <RefundItemCard
                  key={refund.id}
                  refund={refund}
                  onSelect={() => setSelectedRefund(refund)}
                  loading={actionLoading}
                />
              ))}
            </div>
          )}

          {selectedRefund && (
            <RefundDetailsModal
              refund={selectedRefund}
              onClose={() => setSelectedRefund(null)}
              onApprove={() => {
                setRefundAction('approve');
              }}
              onReject={() => {
                setRefundAction('reject');
              }}
              loading={actionLoading}
            />
          )}

          {refundAction && (
            <div className="modal-overlay" onClick={() => setRefundAction(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{refundAction === 'approve' ? 'Approve Refund' : 'Reject Refund'}</h3>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={refundAction === 'approve' ? 'Approval notes (optional)' : 'Rejection reason (required)'}
                  rows="4"
                />
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      if (refundAction === 'approve') {
                        handleApproveRefund(selectedRefund.id, actionReason);
                      } else {
                        if (!actionReason.trim()) {
                          setError('Rejection reason is required');
                          return;
                        }
                        handleRejectRefund(selectedRefund.id, actionReason);
                      }
                      setActionReason('');
                    }}
                    disabled={actionLoading}
                    className="btn btn-primary"
                  >
                    {refundAction === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                  <button
                    onClick={() => {
                      setRefundAction(null);
                      setActionReason('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <span className="stat-icon">{icon}</span>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

function RefundItemCard({ refund, onSelect, _loading }) {
  const statusColors = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
  };

  return (
    <div className="refund-item-card" onClick={onSelect}>
      <div className="refund-status">
        <span className={`badge status-${statusColors[refund.status]}`}>
          {refund.status}
        </span>
      </div>
      <div className="refund-info">
        <h4>{refund.customerName}</h4>
        <p>Order: {refund.orderId} | Reason: {refund.reason}</p>
        <p className="items-count">{(refund.items || []).length} item(s)</p>
      </div>
      <div className="refund-amount">
        <span>{refund.amount.toLocaleString()} {refund.currency}</span>
      </div>
      <button className="expand-btn">→</button>
    </div>
  );
}

function RefundDetailsModal({
  refund,
  onClose,
  onApprove,
  onReject,
  loading,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Refund Details</h2>
        <div className="detail-grid">
          <div><strong>Order ID:</strong> {refund.orderId}</div>
          <div><strong>Customer:</strong> {refund.customerName}</div>
          <div><strong>Amount:</strong> {refund.amount.toLocaleString()} {refund.currency}</div>
          <div><strong>Reason:</strong> {refund.reason}</div>
          <div><strong>Items:</strong> {(refund.items || []).map((item) => item.productName || item.name || item.productId || item).join(', ')}</div>
          <div><strong>Requested:</strong> {new Date(refund.requestedAt).toLocaleString()}</div>
        </div>
        <div className="modal-actions">
          {refund.status === 'PENDING' && (
            <>
              <button onClick={onApprove} disabled={loading} className="btn btn-success">Approve</button>
              <button onClick={onReject} disabled={loading} className="btn btn-danger">Reject</button>
            </>
          )}
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}

export default RefundManagementPage;
