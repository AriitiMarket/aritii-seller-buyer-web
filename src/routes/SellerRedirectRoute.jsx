import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from '../components/common/Loader';

/**
 * SellerRedirectRoute — Redirects sellers to the unified dashboard.
 * Non-sellers see the wrapped content.
 */
const SellerRedirectRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);

  if (isLoading === true) {
    return <Loader />;
  }

  if (isSeller) {
    return <Navigate to="/my-dashboard" replace />;
  }

  return children;
};

export default SellerRedirectRoute;
