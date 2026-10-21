import { useState, useEffect, useCallback } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * Hook to fetch and manage provider batches
 */
export const useProviderBatches = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Callers pass a fresh object literal on every render, so the request
  // parameters are keyed by their serialised form rather than by reference.
  const paramsKey = JSON.stringify(params);
  const routeId = params.routeId;

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (routeId) {
        const result = await providerDeliveryApi.getBatchDetails(routeId);
        setData({
          batches: result.batch ? [result.batch] : [],
          count: result.batch ? 1 : 0,
          supported: result.supported !== false,
        });
        if (!result.success) setError(result.error || new Error('Batch not found'));
        return;
      }
      const response = await providerDeliveryApi.getProviderBatches(JSON.parse(paramsKey));
      setData(response);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch batches:', err);
    } finally {
      setLoading(false);
    }
  }, [paramsKey, routeId]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const acceptBatch = async (batchId) => {
    try {
      const result = await providerDeliveryApi.acceptBatch(batchId);
      if (!result?.success) throw result?.error || new Error('Could not accept this assignment');
      await fetchBatches();
    } catch (err) {
      setError(err);
      console.error('Failed to accept batch:', err);
      throw err;
    }
  };

  /**
   * Decline a batch that was offered to this rider.
   *
   * Declining releases the orders back to the ready pool, so it is the mirror
   * image of accepting — the service rejects a decline that is not legal from
   * the batch's current status, and the page shows that message.
   */
  const rejectBatch = async (batchId, reason = '') => {
    try {
      const result = await providerDeliveryApi.rejectDispatchBatch(batchId, reason);
      if (!result?.success) throw result?.error || new Error('Could not decline this assignment');
      await fetchBatches();
      return result;
    } catch (err) {
      setError(err);
      console.error('Failed to decline batch:', err);
      throw err;
    }
  };

  const getBatch = async (batchId) => (await providerDeliveryApi.getBatchDetails(batchId)).batch;
  const runBatchAction = async (action, ...args) => {
    try {
      const result = await providerDeliveryApi[action](...args);
      if (result?.success === false) throw result.error || new Error(result.message || 'Batch action failed');
      await fetchBatches();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    data,
    batches: data.batches || [],
    count: data.count || 0,
    totalPages: data.totalPages || 1,
    supported: data.supported !== false,
    batch: routeId ? (data.batches || []).find((item) => String(item.id) === String(routeId)) || null : null,
    loading,
    error,
    acceptBatch,
    rejectBatch,
    getBatch,
    refetch: fetchBatches,
    runBatchAction,
  };
};

export default useProviderBatches;
