import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import HomePage from "../pages/home/HomePage";

/**
 * HomeRoute — Show HomePage for all users
 * 
 * Logic:
 * 1. Loading → Show loader
 * 2. All users (authenticated or not) → Show HomePage with hero
 * 
 * This ensures:
 * - Guests see the landing page with hero banner
 * - Authenticated buyers see the same homepage with hero
 * - Sellers can also view the homepage
 * - No unwanted redirects
 */
const HomeRoute = () => {
  const { loading } = useSelector((state) => state.user);

  // Still loading auth state
  if (loading !== false) {
    return <Loader />;
  }

  // All users see the HomePage (hero, showcase, features)
  // Whether authenticated or not
  return <HomePage />;
};

export default HomeRoute;
