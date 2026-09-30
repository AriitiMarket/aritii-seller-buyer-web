import { useSelector } from 'react-redux';

/**
 * Hook to access provider data from Redux store.
 *
 * NOTE: `providerId` here is the IDENTITY user id, NOT the delivery Provider
 * document `_id`. The Provider `_id` is only available via
 * `GET /delivery/provider/me` (see useProviderAvailability). Do not pass
 * `providerId` to provider endpoints that expect the Provider document id
 * (e.g. `PUT /delivery/provider/:id/online`) — it will 404.
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
