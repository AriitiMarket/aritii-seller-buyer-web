/**
 * FIX #15: Seller Returns Management Page
 * Shows all returns by status with status tabs
 * Allows approval, rejection, refund processing
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import returnsService from '../../services/returns.service';

const RETURN_STATUSES = ['PENDING', 'APPROVED', 'INSPECTING', 'COMPLETED'];

const SellerReturnsPage = () => {
  const activeShop = useSelector((state) => state.seller?.activeShopId);
  const [activeTab, setActiveTab] = useState(0);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(null); // 'approve', 'reject', 'refund'
  const [dialogData, setDialogData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeShop) {
      fetchReturns();
    }
  }, [activeShop, activeTab]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      // This would call the backend endpoint to fetch returns for the shop
      // For now, returning empty list
      const data = [];
      setReturns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async () => {
    try {
      setLoading(true);
      await returnsService.approveReturn(selectedReturn._id);
      setDialogOpen(false);
      setSelectedReturn(null);
      fetchReturns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectReturn = async () => {
    try {
      setLoading(true);
      await returnsService.rejectReturn(selectedReturn._id, {
        reason: dialogData.reason,
      });
      setDialogOpen(false);
      setSelectedReturn(null);
      fetchReturns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    try {
      setLoading(true);
      await returnsService.processRefund(selectedReturn._id, {
        amount: parseFloat(dialogData.refundAmount),
        method: dialogData.refundMethod,
        notes: dialogData.notes,
      });
      setDialogOpen(false);
      setSelectedReturn(null);
      fetchReturns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredReturns = returns.filter(
    (r) => r.status === RETURN_STATUSES[activeTab]
  );


  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <h1>Returns Management</h1>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          {RETURN_STATUSES.map((status, idx) => (
            <Tab
              key={idx}
              label={`${status} (${
                returns.filter((r) => r.status === status).length
              })`}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Returns Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Return ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Buyer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Requested</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 3 }}>
                    No returns in this status
                  </TableCell>
                </TableRow>
              ) : (
                filteredReturns.map((ret) => (
                  <TableRow key={ret._id}>
                    <TableCell sx={{ fontWeight: 500, fontSize: 13 }}>
                      #{ret._id?.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      #{ret.orderId?.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {ret.buyerName || 'Unknown'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{ret.reason}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {ret.items?.length || 0}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ${ret.totalRefundRequested?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {new Date(ret.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedReturn(ret);
                          setDialogMode('details');
                          setDialogOpen(true);
                        }}
                      >
                        Details
                      </Button>
                      {ret.status === 'PENDING' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            variant="text"
                            onClick={() => {
                              setSelectedReturn(ret);
                              setDialogMode('approve');
                              setDialogOpen(true);
                            }}
                            sx={{ ml: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="text"
                            onClick={() => {
                              setSelectedReturn(ret);
                              setDialogMode('reject');
                              setDialogOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {ret.status === 'APPROVED' && (
                        <Button
                          size="small"
                          color="primary"
                          variant="text"
                          onClick={() => {
                            setSelectedReturn(ret);
                            setDialogMode('refund');
                            setDialogData({
                              refundAmount: ret.totalRefundRequested,
                            });
                            setDialogOpen(true);
                          }}
                        >
                          Process Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedReturn(null);
          setDialogData({});
          setDialogMode(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {dialogMode === 'approve' && 'Approve Return'}
          {dialogMode === 'reject' && 'Reject Return'}
          {dialogMode === 'refund' && 'Process Refund'}
          {dialogMode === 'details' && 'Return Details'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {dialogMode === 'reject' && (
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={3}
              value={dialogData.reason || ''}
              onChange={(e) =>
                setDialogData({ ...dialogData, reason: e.target.value })
              }
            />
          )}
          {dialogMode === 'refund' && (
            <>
              <TextField
                fullWidth
                label="Refund Amount"
                type="number"
                value={dialogData.refundAmount || ''}
                onChange={(e) =>
                  setDialogData({ ...dialogData, refundAmount: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Refund Method"
                select
                SelectProps={{ native: true }}
                value={dialogData.refundMethod || 'ORIGINAL_PAYMENT_METHOD'}
                onChange={(e) =>
                  setDialogData({
                    ...dialogData,
                    refundMethod: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              >
                <option value="ORIGINAL_PAYMENT_METHOD">Original Payment Method</option>
                <option value="STORE_CREDIT">Store Credit</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </TextField>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={dialogData.notes || ''}
                onChange={(e) =>
                  setDialogData({ ...dialogData, notes: e.target.value })
                }
              />
            </>
          )}
          {dialogMode === 'details' && selectedReturn && (
            <Box>
              <p><strong>Return ID:</strong> {selectedReturn._id}</p>
              <p><strong>Order ID:</strong> {selectedReturn.orderId}</p>
              <p><strong>Reason:</strong> {selectedReturn.reason}</p>
              <p><strong>Items:</strong> {selectedReturn.items?.length}</p>
              <p><strong>Total Value:</strong> ${selectedReturn.totalRefundRequested}</p>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setSelectedReturn(null);
              setDialogData({});
              setDialogMode(null);
            }}
          >
            Cancel
          </Button>
          {dialogMode === 'approve' && (
            <Button
              onClick={handleApproveReturn}
              variant="contained"
              color="success"
              disabled={loading}
            >
              Approve
            </Button>
          )}
          {dialogMode === 'reject' && (
            <Button
              onClick={handleRejectReturn}
              variant="contained"
              color="error"
              disabled={loading}
            >
              Reject
            </Button>
          )}
          {dialogMode === 'refund' && (
            <Button
              onClick={handleProcessRefund}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Process
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerReturnsPage;
