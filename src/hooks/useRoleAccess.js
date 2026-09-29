import { useState, useEffect } from 'react';
import api from '@/services/api';

/**
 * Hook to check role access status for portal authorization
 * Returns the access status for a specific role (SELLER, PROVIDER, etc.)
 */
export const useRoleAccess = (role) => {
  const [access, setAccess] = useState({
    allowed: false,
    status: 'UNKNOWN',
    message: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setAccess(prev => ({ ...prev, loading: true, error: null }));
        const { data } = await api.get(`/auth/role-status/${role}`);
        const result = data.data || data;
        setAccess({
          allowed: result.allowed || false,
          status: result.status || 'UNKNOWN',
          message: result.message || '',
          loading: false,
          error: null,
        });
      } catch (error) {
        setAccess({
          allowed: false,
          status: 'ERROR',
          message: error.response?.data?.message || 'Failed to check role access',
          loading: false,
          error: error.message,
        });
      }
    };

    if (role) {
      checkAccess();
    }
  }, [role]);

  return access;
};

/**
 * Hook to check multiple role access statuses at once
 * Useful for dashboards that need to show available roles
 */
export const useMultipleRoleAccess = (roles = []) => {
  const [accessStatus, setAccessStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAllAccess = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await Promise.all(
          roles.map(async (role) => {
            try {
              const { data } = await api.get(`/auth/role-status/${role}`);
              const result = data.data || data;
              return {
                role,
                allowed: result.allowed || false,
                status: result.status || 'UNKNOWN',
                message: result.message || '',
              };
            } catch (err) {
              return {
                role,
                allowed: false,
                status: 'ERROR',
                message: err.response?.data?.message || 'Failed to check access',
              };
            }
          })
        );

        const statusMap = {};
        results.forEach(result => {
          statusMap[result.role] = result;
        });
        
        setAccessStatus(statusMap);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (roles.length > 0) {
      checkAllAccess();
    }
  }, [roles]);

  return { accessStatus, loading, error };
};