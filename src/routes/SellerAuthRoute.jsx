import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loader from '../components/common/Loader';
import { loadSeller } from '../store/redux/actions/user';

const SellerAuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isSeller, seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const sellerLoadAttemptedRef = useRef(false);

  // Only load seller data if user is actually approved as a seller
  // Check sellerStatus from backend user object (APPROVED, PENDING, REJECTED, or null)
  useEffect(() => {
    if (user && user.sellerStatus === 'APPROVED' && !isSeller && !sellerLoadAttemptedRef.current) {
      sellerLoadAttemptedRef.current = true;
      dispatch(loadSeller());
    }
  }, [user, isSeller, dispatch]);

  // Show loader while fetching seller data
  if (isLoading === true) {
    return <Loader />;
  }

  // Only approved sellers with loaded seller data can access this route
  if (!isSeller) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

export default SellerAuthRoute;
