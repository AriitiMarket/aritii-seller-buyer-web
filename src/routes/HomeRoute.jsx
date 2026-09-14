import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import HomePage from "../pages/home/HomePage";

/**
 * HomeRoute — Smart home page routing
 * 
 * Logic:
 * 1. Unauthenticated users → Show HomePage (hero, showcase, features)
 * 2. Authenticated users → Check seller status:
 *    - APPROVED → Redirect to /business/dashboard
 *    - Other → Redirect to /marketplace
 * 
 * This ensures:
 * - Guests see the landing page with hero banner
 * - Smart redirect for logged-in users
 * - Sellers go directly to their dashboard
 */
const HomeRoute = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  // Still loading auth state
  if (loading !== false) {
    return <Loader />;
  }

  // Unauthenticated users see the HomePage (hero, showcase, features)
  if (!isAuthenticated) {
    return <HomePage />;
  }

  // Authenticated user - check seller status
  if (user) {
    const sellerStatus = user.sellerStatus;

    // APPROVED sellers go to business dashboard
    if (sellerStatus === 'APPROVED') {
      return <Navigate to="/business/dashboard" replace />;
    }
  }

  // Authenticated but not approved seller → marketplace
  return <Navigate to="/marketplace" replace />;
};

export default HomeRoute;
