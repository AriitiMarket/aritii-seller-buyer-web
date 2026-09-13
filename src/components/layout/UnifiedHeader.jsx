import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineShoppingCart, AiOutlineLogout } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'
import { FiShoppingBag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { logoutUser } from '../../store/redux/actions/user'

/**
 * UnifiedHeader — Smart header for both buyer and seller contexts
 * 
 * Shows different navigation based on current path:
 * - /business/* → Business Dashboard nav
 * - /marketplace → Marketplace nav
 * - /my-dashboard/* → Buyer Dashboard nav
 */
const UnifiedHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine if user is on business or buyer side
  const currentPath = window.location.pathname;
  const isBusinessContext = currentPath.includes('/business');
  const isBuyerContext = currentPath.includes('/my-dashboard') || currentPath.includes('/marketplace');
  const isApprovedSeller = user?.sellerStatus === 'APPROVED';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/aritii-logo.svg" alt="Aritii" className="h-8 w-auto" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {isBusinessContext && isApprovedSeller && (
            <>
              <Link to="/business/dashboard" className="hover:text-brand-primary">My Business</Link>
              <Link to="/marketplace" className="hover:text-brand-primary">Marketplace</Link>
              <Link to="/my-dashboard/orders" className="hover:text-brand-primary">Orders</Link>
            </>
          )}
          
          {isBuyerContext && (
            <>
              <Link to="/marketplace" className="hover:text-brand-primary">Marketplace</Link>
              {isApprovedSeller && (
                <Link to="/business/dashboard" className="hover:text-brand-primary">My Business</Link>
              )}
              <Link to="/my-dashboard/orders" className="hover:text-brand-primary">Orders</Link>
            </>
          )}
        </nav>

        {/* Right side: Cart, Profile, Logout */}
        <div className="flex items-center gap-4">
          {!isBusinessContext && (
            <Link to="/checkout" className="relative">
              <AiOutlineShoppingCart size={24} />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:text-brand-primary"
            >
              <BiUser size={24} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-md shadow-lg z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-[600] text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <div className="py-2">
                  <Link
                    to="/my-dashboard/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 My Buyer Profile
                  </Link>

                  {isApprovedSeller && (
                    <Link
                      to="/business/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🏪 My Business Profile
                    </Link>
                  )}

                  <Link
                    to="/my-dashboard/orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📦 My Orders
                  </Link>

                  {isApprovedSeller && (
                    <Link
                      to="/business/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiShoppingBag className="inline mr-2" />
                      My Business
                    </Link>
                  )}

                  {!isApprovedSeller && user?.sellerStatus !== 'APPROVED' && (
                    <Link
                      to="/sell"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 border-t"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🏬 Become a Seller
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-t text-red-600 flex items-center gap-2"
                  >
                    <AiOutlineLogout /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
