import { useState, useEffect } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * Hook to fetch and manage available delivery work (assignments)
 */
export const useAvailableWork = (params = {}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  const fetchAvailableWork = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await providerDeliveryApi.getAvailableWork(params);
      setAssignments(response.assignments || []);
      setSupported(response.supported !== false);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch available work:', err);
      setSupported(false);
    } finally {
      setLoading(false);
    }
  };

  const respondToAssignment = async (assignmentId, accepted, reason = '') => {
    try {
      const response = await providerDeliveryApi.respondToAssignment(assignmentId, accepted, reason);
      if (response.success) {
        // Refresh the list after responding
        await fetchAvailableWork();
      }
      return response;
    } catch (err) {
      console.error('Failed to respond to assignment:', err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchAvailableWork();
  }, [JSON.stringify(params)]);

  return {
    assignments,
    count: assignments.length,
    loading,
    error,
    supported,
    refetch: fetchAvailableWork,
    respondToAssignment,
  };
};

export default useAvailableWork;
