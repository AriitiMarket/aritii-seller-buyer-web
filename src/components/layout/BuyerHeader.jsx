import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar } from '../common/ImageWithFallback';
import { BiMenuAltLeft, BiMessageSquareDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineLogout } from "react-icons/ai";
import BrandLogo from '../common/BrandLogo';

/**
 * Buyer Dashboard Header — used ONLY inside the buyer's private account area.
 *
 * Unlike the marketplace Header (search + categories + cart), this is a
 * minimal, focused header for personal account management:
 *   - Slide-out toggle (mobile) to open the buyer sidebar drawer
 *   - Aritii Market logo (links back to the buyer dashboard)
 *   - Quick "Browse Marketplace" return link
 *   - Page context placeholder + notification/quick links
 *   - Buyer profile avatar menu
 * It intentionally does NOT render marketplace search/navigation/footer.
 */
const BuyerHeader = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.user);
  const isAuthed = !!(user && (user.isAuthenticated ?? true));

  return (
    <header className="w-full h-[72px] bg-white shadow sticky top-0 left-0 z-40 flex items-center justify-between px-3 sm:px-4 border-b border-gray-200">
      {/* Left: mobile menu toggle + logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open account menu"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-[#052919]/10 text-[#052919] hover:bg-[#052919]/20 transition flex-shrink-0"
        >
          <BiMenuAltLeft size={24} />
        </button>

        <div className="flex-shrink-0">
          <BrandLogo size="sm" showText={false} showTagline={false} linked={true} />
        </div>

        <span className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#052919] whitespace-nowrap">
          <CgProfile size={18} />
          <span>My Dashboard</span>
        </span>
      </div>

      {/* Right: quick links + profile */}
      <div className="flex items-center gap-1 sm:gap-2 justify-end">
        <Link
          to="/inbox"
          className="flex items-center justify-center w-10 h-10 rounded-md bg-[#052919]/10 text-[#052919] hover:bg-[#052919]/20 transition flex-shrink-0"
          title="Messages"
          aria-label="Messages"
        >
          <BiMessageSquareDetail size={20} />
        </Link>

        <Link
          to="/my-dashboard/wishlist"
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-md bg-[#052919]/10 text-[#052919] hover:bg-[#052919]/20 transition flex-shrink-0"
          title="Wishlist"
          aria-label="Wishlist"
        >
          <AiOutlineHeart size={20} />
        </Link>

        <Link
          to="/"
          className="hidden lg:inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#052919] hover:text-[#E5A93C] transition whitespace-nowrap"
          title="Browse Marketplace"
        >
          <FiShoppingBag size={16} />
          <span className="hidden xl:inline">Browse</span>
        </Link>

        {isAuthed && user ? (
          <Link
            to="/my-dashboard/profile"
            title="My Profile"
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-[#E5A93C] transition"
          >
            <Avatar
              data={user}
              fallback="/logo192.png"
              alt={user.name || "Buyer"}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#E5A93C]"
            />
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-semibold text-[#052919] hover:text-[#E5A93C] transition px-2">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default BuyerHeader;
