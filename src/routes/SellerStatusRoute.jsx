import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from '../components/common/Loader';

/**
 * SellerStatusRoute — Smart redirect based on seller status
 * 
 * Used for:
 * 1. Manual navigation to "/" to redirect to appropriate dashboard
 * 
 * Routes authenticated users based on their seller application status:
 * - APPROVED → /business/dashboard (SellerAuthRoute will handle seller data loading)
 * - PENDING, REJECTED, DRAFT, null → /marketplace
 * 
 * NOTE: Does NOT trigger loadSeller here to avoid infinite redirect loops.
 * SellerAuthRoute (protected routes) handles seller data loading.
 */
const SellerStatusRoute = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated. Check seller status to determine redirect.
  const sellerStatus = user.sellerStatus;

  // APPROVED sellers go to business dashboard
  if (sellerStatus === 'APPROVED') {
    return <Navigate to="/business/dashboard" replace />;
  }

  // Everyone else (PENDING, REJECTED, DRAFT, null) goes to marketplace
  // Non-sellers can still apply to become sellers
  return <Navigate to="/marketplace" replace />;
};

export default SellerStatusRoute;
