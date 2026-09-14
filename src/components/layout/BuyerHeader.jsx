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
    <header className="w-full h-[72px] bg-white shadow sticky top-0 left-0 z-40 flex items-center justify-between px-4 border-b border-gray-200">
      {/* Left: mobile menu toggle + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open account menu"
          className="md:hidden flex items-center justify-center w-[40px] h-[40px] rounded-md bg-[#052919]/10 text-[#052919]"
        >
          <BiMenuAltLeft size={26} />
        </button>

        <BrandLogo size="sm" showText={false} showTagline={false} linked={true} />

        <span className="hidden md:inline-flex items-center gap-1 ml-2">
          <CgProfile size={20} className="text-[#052919]" />
          <span className="text-sm font-medium text-[#052919]">My Dashboard</span>
        </span>
      </div>

      {/* Right: quick links + profile */}
      <div className="flex items-center gap-3">
        <Link
          to="/inbox"
          className="flex items-center justify-center w-[40px] h-[40px] rounded-md bg-[#052919]/10 text-[#052919]"
          title="Messages"
        >
          <BiMessageSquareDetail size={22} />
        </Link>

        <Link
          to="/my-dashboard/wishlist"
          className="hidden sm:flex items-center justify-center w-[40px] h-[40px] rounded-md bg-[#052919]/10 text-[#052919]"
          title="Wishlist"
        >
          <AiOutlineHeart size={22} />
        </Link>

        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#052919] hover:text-[#E5A93C]"
          title="Browse Marketplace"
        >
          <FiShoppingBag size={18} />
          <span>Browse Marketplace</span>
        </Link>

        {isAuthed && user ? (
          <Link
            to="/my-dashboard/profile"
            title="My Profile"
            className="flex items-center justify-center w-[42px] h-[42px] rounded-full overflow-hidden"
          >
            <Avatar
              data={user}
              fallback="/logo192.png"
              alt={user.name || "Buyer"}
              className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#E5A93C]"
            />
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-semibold text-[#052919]">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default BuyerHeader;
