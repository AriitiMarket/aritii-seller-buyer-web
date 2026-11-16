import { useState, useEffect, useCallback } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * Hook to fetch and manage provider deliveries (shipments)
 */
export const useProviderDelivery = (deliveryId = null, params = {}) => {
  const [delivery, setDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  // Callers pass a fresh object literal on every render, so the request
  // parameters are keyed by their serialised form rather than by reference.
  const paramsKey = JSON.stringify(params);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getProviderDeliveries(JSON.parse(paramsKey));
      setDeliveries(response.deliveries || []);
      setTotal(response.total ?? response.deliveries?.length ?? 0);
      setTotalPages(response.totalPages ?? 1);
      setSupported(response.supported !== false);
      setError(response.error || null);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch deliveries:', err);
      setSupported(false);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  const fetchDeliveryDetails = useCallback(async () => {
    if (!deliveryId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getDeliveryDetails(deliveryId);
      setDelivery(response.delivery || null);
      setSupported(response.supported !== false);
      setError(response.error || null);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch delivery details:', err);
      setSupported(false);
    } finally {
      setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    } else {
      fetchDeliveries();
    }
  }, [deliveryId, fetchDeliveries, fetchDeliveryDetails]);

  const respondToAssignment = async (assignmentId, accepted, reason = '') => {
    try {
      const response = await providerDeliveryApi.respondToAssignment(assignmentId, accepted, reason);
      if (response.success) {
        await fetchDeliveries();
      }
      return response;
    } catch (err) {
      console.error('Failed to respond to assignment:', err);
      return { success: false, error: err };
    }
  };

  const updateStatus = async (id, status, data = {}) => {
    try {
      const response = await providerDeliveryApi.updateDeliveryStatus(id, status, data);
      if (response.success) {
        if (deliveryId === id) {
          await fetchDeliveryDetails();
        } else {
          await fetchDeliveries();
        }
      }
      return response;
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      return { success: false, error: err };
    }
  };

  const confirmCod = async (id, amount, proof = {}) => {
    try {
      const response = await providerDeliveryApi.confirmCodCollection(id, amount, proof);
      if (response.success) {
        if (deliveryId === id) {
          await fetchDeliveryDetails();
        } else {
          await fetchDeliveries();
        }
      }
      return response;
    } catch (err) {
      console.error('Failed to confirm COD:', err);
      return { success: false, error: err };
    }
  };

  const getTracking = async (id) => {
    try {
      const response = await providerDeliveryApi.getDeliveryTracking(id);
      return response;
    } catch (err) {
      console.error('Failed to fetch tracking:', err);
      return { events: [], supported: false };
    }
  };

  const getLatestLocation = async (id) => {
    try {
      const response = await providerDeliveryApi.getLatestLocation(id);
      return response;
    } catch (err) {
      console.error('Failed to fetch latest location:', err);
      return { location: null, success: false };
    }
  };

  return {
    delivery,
    deliveries,
    count: deliveries.length,
    total,
    totalPages,
    loading,
    error,
    supported,
    refetch: deliveryId ? fetchDeliveryDetails : fetchDeliveries,
    respondToAssignment,
    updateStatus,
    confirmCod,
    getTracking,
    getLatestLocation,
  };
};

export default useProviderDelivery;
