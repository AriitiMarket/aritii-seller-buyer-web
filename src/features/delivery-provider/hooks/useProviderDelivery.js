import { useState, useEffect } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * Hook to fetch and manage provider deliveries (shipments)
 */
export const useProviderDelivery = (deliveryId = null, params = {}) => {
  const [delivery, setDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getProviderDeliveries(params);
      setDeliveries(response.deliveries || []);
      setSupported(response.supported !== false);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch deliveries:', err);
      setSupported(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryDetails = async () => {
    if (!deliveryId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getDeliveryDetails(deliveryId);
      setDelivery(response.delivery || null);
      setSupported(true);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch delivery details:', err);
      setSupported(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    } else {
      fetchDeliveries();
    }
  }, [deliveryId, JSON.stringify(params)]);

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

  const uploadProof = async (id, file) => {
    try {
      const response = await providerDeliveryApi.uploadProofOfDelivery(id, file);
      if (response.success) {
        if (deliveryId === id) {
          await fetchDeliveryDetails();
        } else {
          await fetchDeliveries();
        }
      }
      return response;
    } catch (err) {
      console.error('Failed to upload proof:', err);
      return { success: false, error: err };
    }
  };

  const confirmCod = async (id, amount) => {
    try {
      const response = await providerDeliveryApi.confirmCodCollection(id, amount);
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
    loading,
    error,
    supported,
    refetch: deliveryId ? fetchDeliveryDetails : fetchDeliveries,
    respondToAssignment,
    updateStatus,
    uploadProof,
    confirmCod,
    getTracking,
    getLatestLocation,
  };
};

export default useProviderDelivery;
