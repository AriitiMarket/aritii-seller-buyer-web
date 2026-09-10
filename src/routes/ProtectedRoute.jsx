import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  // While the initial auth check is still resolving, show a loader instead of
  // a blank screen.
  if (loading !== false) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;