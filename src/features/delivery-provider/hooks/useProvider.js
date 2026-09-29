import { useSelector } from 'react-redux';

/**
 * Hook to access provider data from Redux store
 */
export const useProvider = () => {
  const { user } = useSelector((state) => state.user || {});
  
  const isProvider = user?.capabilities?.includes('PROVIDER') || user?.role === 'PROVIDER';
  const providerId = user?.id || user?._id;
  
  return {
    isProvider,
    providerId,
    provider: user,
  };
};

export default useProvider;
