import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from '../components/common/Loader';

/**
 * SellerStatusRoute — Redirect authenticated users to the unified dashboard.
 *
 * All authenticated users go to /my-dashboard regardless of seller status.
 * The sidebar within the dashboard handles showing/hiding business features.
 */
const SellerStatusRoute = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // All authenticated users go to the unified dashboard
  return <Navigate to="/my-dashboard" replace />;
};

export default SellerStatusRoute;
