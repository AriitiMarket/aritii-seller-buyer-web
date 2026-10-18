import { useCallback, useEffect, useState } from 'react';
import sellerRegistrationApi from '@/seller-registration/api/sellerRegistrationApi';
import { EMPTY_APPLICATION } from '@/seller-registration/constants/sellerRegistrationConstants';

export default function useSellerRegistration() {
  const [application, setApplication] = useState(EMPTY_APPLICATION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const current = await sellerRegistrationApi.getMine();
      if (current) setApplication(current);
      setError('');
      return current;
    } catch (err) {
      // Handle 401 (unauthenticated) gracefully - just set empty application
      if (err.response?.status === 401) {
        setApplication(EMPTY_APPLICATION);
        setError('');
        return EMPTY_APPLICATION;
      }
      setError(err.response?.data?.message || 'Unable to load your seller application.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load().catch(() => {}); }, [load]);

  const save = useCallback(async (value, submit = false) => {
    setSaving(true);
    try {
      const saved = submit
        ? await sellerRegistrationApi.submit(value)
        : await sellerRegistrationApi.saveDraft(value);
      setApplication(saved);
      setError('');
      return saved;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save your application.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { application, setApplication, loading, saving, error, load, save };
}
