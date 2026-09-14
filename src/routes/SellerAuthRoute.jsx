import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loader from '../components/common/Loader';
import { loadSeller } from '../store/redux/actions/user';

/**
 * SellerAuthRoute - Protects seller-only routes
 * 
 * Route access requires:
 * 1. User is authenticated (isAuthenticated = true)
 * 2. User has APPROVED seller status (sellerStatus === 'APPROVED')
 * 3. Seller data has been loaded from backend
 * 
 * Redirects:
 * - Not authenticated → /login (via ProtectedRoute parent)
 * - Authenticated but not approved seller → /marketplace
 * - Loading seller data → Show Loader
 */
const SellerAuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isSeller, seller } = useSelector((state) => state.seller);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const sellerLoadAttemptedRef = useRef(false);

  // Only load seller data if:
  // 1. User is authenticated
  // 2. User has APPROVED seller status from backend
  // 3. Haven't already attempted to load seller data
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.sellerStatus === 'APPROVED' &&
      !isSeller &&
      !sellerLoadAttemptedRef.current
    ) {
      sellerLoadAttemptedRef.current = true;
      dispatch(loadSeller());
    }
  }, [user, isSeller, isAuthenticated, dispatch]);

  // Show loader while fetching seller data
  if (isLoading === true) {
    return <Loader />;
  }

  // Double-check: User must be authenticated, approved, and have isSeller flag
  // This prevents accessing seller routes if Redux out of sync with backend
  if (!isAuthenticated || user?.sellerStatus !== 'APPROVED' || !isSeller) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

export default SellerAuthRoute;
