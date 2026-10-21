import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineStop, AiOutlinePlayCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import api from '@/services/api';

const OrderHoldBadge = ({ orderId }) => {
  const [holdData, setHoldData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [releasing, setReleasing] = useState(false);

  const fetchHoldStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order-hold/${orderId}`);
      setHoldData(res.data?.data || null);
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.error('Failed to fetch hold status:', err);
      }
      setHoldData(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchHoldStatus();
  }, [fetchHoldStatus]);

  const handleReleaseHold = async () => {
    setReleasing(true);
    try {
      await api.post(`/order-hold/${orderId}/release`, {});
      toast.success('Order hold released');
      await fetchHoldStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to release hold');
    } finally {
      setReleasing(false);
    }
  };

  if (loading) {
    return <div className="bg-gray-100 text-gray-600 rounded-lg p-4">Loading...</div>;
  }

  if (!holdData) {
    return null;
  }

  const heldDuration = new Date() - new Date(holdData.createdAt);
  const hours = Math.floor(heldDuration / (1000 * 60 * 60));
  const minutes = Math.floor((heldDuration % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex items-center gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg my-4">
      <div className="text-2xl text-yellow-600">
        <AiOutlineStop />
      </div>
      <div className="flex-1">
        <strong className="block text-gray-800">Order on Hold</strong>
        <div className="text-sm text-gray-700">{holdData.reason}</div>
        <small className="text-gray-500">
          Held for {hours}h {minutes}m
        </small>
      </div>
      <button
        onClick={handleReleaseHold}
        disabled={releasing}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 transition"
        title="Release hold"
      >
        <AiOutlinePlayCircle /> Release
      </button>
    </div>
  );
};

export default OrderHoldBadge;
