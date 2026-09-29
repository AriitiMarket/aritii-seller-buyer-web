import { useState, useEffect } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * Hook to fetch and manage provider batches
 */
export const useProviderBatches = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getProviderBatches(params);
      setData(response);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [JSON.stringify(params)]);

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
    supported: data.supported !== false,
    batch: params.routeId ? (data.batches || []).find((item) => String(item.id) === String(params.routeId)) || null : null,
    loading,
    error,
    acceptBatch,
    getBatch,
    refetch: fetchBatches,
    runBatchAction,
  };
};

export default useProviderBatches;
