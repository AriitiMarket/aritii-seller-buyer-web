import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from '../components/common/Loader';

const SellerAuthRoute = ({ children }) => {
  const { isLoading, isSeller, seller } = useSelector((state) => state.seller);

  if (isLoading === true) {
    return <Loader />;
  }
  else{// If the user is not an approved seller, redirect them to the unified login.
    if (!isSeller) {
    
     return <Navigate to={`/login`} replace />;
  } }

  return children;
};

export default SellerAuthRoute;
