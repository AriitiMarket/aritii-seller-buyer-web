import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '@/components/common/Loading';

export default function SellerRegistrationGuard() {
  const location = useLocation();
  const { loading, isAuthenticated } = useSelector((state) => state.user || {});
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/seller-sign-up" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
