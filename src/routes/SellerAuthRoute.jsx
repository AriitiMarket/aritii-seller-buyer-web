import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loader from '../components/common/Loader';
import { loadSeller } from '../store/redux/actions/user';

/**
 * SellerAuthRoute — Protects seller-only business routes.
 *
 * Requires: authenticated + approved seller application.
 * One account — seller is just a buyer with approved business capabilities.
 */
const SellerAuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const sellerLoadAttemptedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !isSeller && !sellerLoadAttemptedRef.current) {
      sellerLoadAttemptedRef.current = true;
      dispatch(loadSeller());
    }
  }, [isAuthenticated, isSeller, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/my-dashboard" replace />;
  }

  return children;
};

export default SellerAuthRoute;
