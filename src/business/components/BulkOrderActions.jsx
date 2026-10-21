/**
 * FIX #14: Bulk Order Actions Component
 * Multi-select table with bulk action bar
 * Shows "Select All", individual checkboxes, and action buttons
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import orderService from '@/business/services/orders.service';
import { orderExportService } from '@/business/services/orderNotes.service';
// The project uses `react-icons` everywhere (130 files) — `@mui/icons-material`
// is not a dependency, so importing it broke the production build.
import { FiFileText as CsvIcon } from 'react-icons/fi';

const BulkOrderActions = ({ orders = [], onRefresh }) => {
  const [selected, setSelected] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const selectAll = (event) => {
    if (event.target.checked) {
      setSelected(orders.map((o) => o._id));
    } else {
      setSelected([]);
    }
  };

  const selectOne = (orderId) => {
    if (selected.includes(orderId)) {
      setSelected(selected.filter((id) => id !== orderId));
    } else {
      setSelected([...selected, orderId]);
    }
  };

  const handleBulkAction = (action) => {
    if (selected.length === 0) {
      setToast({
        show: true,
        message: 'Please select at least one order',
        type: 'warning',
      });
      return;
    }

    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const confirmBulkAction = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);

      const result = await orderService.bulkOrderAction({
        orderIds: selected,
        action: pendingAction,
      });

      setToast({
        show: true,
        message: `${result.successCount} orders ${pendingAction.toLowerCase()}ed successfully`,
        type: 'success',
      });

      setSelected([]);
      if (onRefresh) onRefresh();

      if (result.failureCount > 0) {
        setToast({
          show: true,
          message: `${result.failureCount} orders failed: ${result.errors
            .map((e) => e.error)
            .join(', ')}`,
          type: 'error',
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.message || 'Bulk action failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleExportCSV = async () => {
    if (selected.length === 0) {
      setToast({
        show: true,
        message: 'Please select at least one order to export',
        type: 'warning',
      });
      return;
    }
    try {
      setLoading(true);
      const blob = await orderExportService.exportCSV({
        orderIds: selected.join(','),
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setToast({ show: true, message: 'CSV exported successfully', type: 'success' });
    } catch (err) {
      console.error('CSV export failed:', err);
      setToast({
        show: true,
        message: err.message || 'Export failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PROCESSING: 'warning',
      CONFIRMED: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error',
      REFUND_REQUESTED: 'warning',
      REFUND_APPROVED: 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            p: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 1,
          }}
        >
          <span style={{ fontWeight: 600 }}>{selected.length} order(s) selected</span>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleBulkAction('ACCEPT')}
              disabled={loading}
            >
              Accept ({selected.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBulkAction('REJECT')}
              disabled={loading}
            >
              Reject ({selected.length})
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBulkAction('SHIP')}
              disabled={loading}
            >
              Ship ({selected.length})
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelected([])}
              disabled={loading}
            >
              Clear
            </Button>
            <Tooltip title="Export selected orders as CSV">
              <IconButton
                color="primary"
                variant="outlined"
                onClick={() => handleExportCSV()}
                disabled={loading || selected.length === 0}
                aria-label="Export selected orders as CSV"
              >
                <CsvIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#131921' : '#f0f2f2' }}>
            <TableRow sx={{ '& th': { borderBottom: '1px solid', borderColor: 'divider' } }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < orders.length
                  }
                  checked={
                    orders.length > 0 && selected.length === orders.length
                  }
                  onChange={selectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Buyer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                selected={selected.includes(order._id)}
                sx={{
                  backgroundColor: selected.includes(order._id)
                    ? 'rgba(25, 103, 210, 0.08)'
                    : 'transparent',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(order._id)}
                    onChange={() => selectOne(order._id)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500, fontSize: 13 }}>
                  <Link
                    to={`/business/orders/${order._id}`}
                    style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{order._id?.substring(0, 8).toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  {order.user?.name || order.shippingAddress?.fullName || order.buyer?.name || 'Customer'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                  ETB {Number(order.totalPrice ?? order.total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  {(order.cart || order.products || order.items || []).length} item(s)
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status || 'UNKNOWN'}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/business/orders/${order._id}`}
                    style={{ fontSize: 13, color: '#1976d2', fontWeight: 500 }}
                  >
                    View Details →
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Bulk Action</DialogTitle>
        <DialogContent>
          Are you sure you want to <strong>{pendingAction?.toLowerCase()}</strong> {selected.length} order(s)?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmBulkAction}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      {toast.show && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: toast.type === 'error' ? '#d32f2f' : toast.type === 'warning' ? '#f57c00' : '#388e3c',
            color: 'white',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          {toast.message}
        </Box>
      )}
    </>
  );
};

export default BulkOrderActions;
