import React, { useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from '../common/ImageWithFallback';
import { BiMessageSquareDetail, BiMenuAltLeft } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { logoutUser } from '../../store/redux/actions/user';

const DashboardHeader = ({ onMenuClick }) => {
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-40 flex items-center justify-between px-4 border-b border-brand">
      <div className="flex items-center gap-3">
        {/* Mobile: open the seller sidebar drawer */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open seller menu"
          className="800px:hidden flex items-center justify-center w-[40px] h-[40px] rounded-md bg-brand-primary/10 text-brand-primary"
        >
          <BiMenuAltLeft size={26} />
        </button>

        <Link to="/business/dashboard">
          <img
            src="/aritii-logo.svg"
            alt="Aritii Market"
            className="h-[44px] w-auto object-contain"
          />
        </Link>

        <span className="hidden 800px:inline-flex items-center gap-1 ml-1">
          <span className="text-sm font-[600] text-brand-primary">Seller Portal</span>
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex items-center mr-4">

          <Link to="/business/products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
              title="Products"
            />
          </Link>

          <Link to="/business/orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer hover:text-brand-primary" title="Orders" />
          </Link>

          <Link to="/business/analytics" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
              title="Analytics"
            />
          </Link>

          {/* Profile menu button */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center justify-center w-[44px] h-[44px] rounded-full border-2 border-brand-primary hover:bg-brand-primary/5 transition-colors"
              aria-label="Profile menu"
            >
              {seller ? (
                <Avatar
                  data={seller}
                  fallback="/logo192.png"
                  alt={seller.name || "Seller"}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1119.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>

            {/* Profile dropdown menu */}
            {profileMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-[40]"
                  onClick={() => setProfileMenuOpen(false)}
                  aria-hidden="true"
                />

                {/* Menu */}
                <div className="absolute right-0 top-[60px] z-[41] w-[250px] bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Menu</span>
                    <button
                      onClick={() => setProfileMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <RxCross1 size={18} />
                    </button>
                  </div>

                  {/* Business Section */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs uppercase text-gray-500 font-semibold px-1 py-1">Business</p>
                    <Link
                      to="/business/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <FiShoppingBag size={16} />
                      <span>Store Profile</span>
                    </Link>
                  </div>

                  {/* Buyer Section */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs uppercase text-gray-500 font-semibold px-1 py-1">Buyer</p>
                    <Link
                      to="/my-dashboard/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/my-dashboard/orders"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <FiPackage size={16} />
                      <span>My Purchases</span>
                    </Link>
                    <Link
                      to="/my-dashboard/wishlist"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <AiOutlineGift size={16} />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/my-dashboard/addresses"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Addresses</span>
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="px-3 py-2">
                    <Link
                      to="/marketplace"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary/10 rounded-md transition"
                    >
                      <FiShoppingBag size={16} />
                      <span>Go to Marketplace</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;