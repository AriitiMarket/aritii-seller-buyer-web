import React, { useState, useEffect } from 'react';
import { Modal, Button, Textarea, Select, FileUpload } from '@/components/common';
import { buyerService } from '@/services/buyer.service';
import { useToast } from '@/hooks/useToast';

export const BuyerReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [returnForm, setReturnForm] = useState({
    reason: '',
    description: '',
    images: [],
  });
  const { toast } = useToast();

  const limit = 10;

  useEffect(() => {
    loadMyReturns();
  }, [page]);

  const loadMyReturns = async () => {
    setLoading(true);
    try {
      const result = await buyerService.getMyReturns(page, limit);
      setReturns(result.returns);
    } catch (err) {
      toast({ message: 'Failed to load returns', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReturn = async (orderId) => {
    if (!returnForm.reason || !returnForm.description) {
      toast({ message: 'Fill all required fields', type: 'error' });
      return;
    }

    try {
      await buyerService.createReturnRequest(orderId, returnForm);
      toast({ message: 'Return request created', type: 'success' });
      setShowModal(false);
      setReturnForm({ reason: '', description: '', images: [] });
      loadMyReturns();
    } catch (err) {
      toast({ message: 'Failed to create return', type: 'error' });
    }
  };

  const handleCancelReturn = async (returnId) => {
    try {
      await buyerService.cancelReturn(returnId);
      toast({ message: 'Return cancelled', type: 'success' });
      loadMyReturns();
    } catch (err) {
      toast({ message: 'Failed to cancel return', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800',
      PICKED_UP: 'bg-purple-100 text-purple-800',
      RETURNED: 'bg-indigo-100 text-indigo-800',
      REFUNDED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Returns</h1>
        <p className="text-gray-600">Track and manage your product returns</p>
      </div>

      {returns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No returns yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {returns.map((returnItem) => (
            <div key={returnItem._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{returnItem.orderId}</p>
                  <p className="text-gray-600 text-sm">
                    Requested: {new Date(returnItem.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(returnItem.status)}`}>
                  {returnItem.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Reason</p>
                  <p className="font-semibold">{returnItem.reason}</p>
                </div>
                <div>
                  <p className="text-gray-600">Return Amount</p>
                  <p className="font-semibold">${returnItem.returnAmount}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{returnItem.description}</p>

              {returnItem.status === 'REQUESTED' && (
                <Button
                  onClick={() => handleCancelReturn(returnItem._id)}
                  variant="destructive"
                  size="sm"
                >
                  Cancel Return
                </Button>
              )}

              {returnItem.status === 'APPROVED' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                  Your return has been approved. Please prepare the package for pickup.
                </div>
              )}

              {returnItem.status === 'REFUNDED' && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
                  Refund of ${returnItem.returnAmount} has been processed.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CreateReturnModal = ({ orderId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    reason: '',
    description: '',
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await buyerService.createReturnRequest(orderId, form);
      toast({ message: 'Return request created', type: 'success' });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({ message: 'Failed to create return', type: 'error' });
    }
  };

  return (
    <Modal title="Request Return" onClose={onClose}>
      <div className="space-y-4">
        <Select
          label="Reason for Return"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          options={[
            { label: 'Select reason...', value: '' },
            { label: 'Damaged', value: 'DAMAGED' },
            { label: 'Wrong Item', value: 'WRONG_ITEM' },
            { label: 'Not as Described', value: 'NOT_AS_DESCRIBED' },
            { label: 'Defective', value: 'DEFECTIVE' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the issue..."
        />

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} variant="primary">
            Submit Return Request
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
