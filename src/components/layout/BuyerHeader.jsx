import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from '../common/ImageWithFallback';
import { BiMenuAltLeft, BiMessageSquareDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RxDashboard, RxPerson, RxBackpack, RxReader } from "react-icons/rx";
import { MdOutlineStorefront, MdOutlineCategory, MdLogout } from "react-icons/md";
import BrandLogo from '../common/BrandLogo';
import { resolveImageUrl } from '../../utils/image';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/redux/actions/user';
import { toast } from 'react-toastify';

/**
 * Unified Dashboard Header — platform-like top bar for the buyer/seller dashboard.
 *
 * Features (desktop):
 *   - Brand logo
 *   - Search bar with category dropdown (searches products, shops)
 *   - Quick nav links: Marketplace, Orders
 *   - Cart + Wishlist + Messages icons
 *   - Profile dropdown with dashboard links + logout
 *
 * Features (mobile):
 *   - Hamburger menu toggle (opens sidebar)
 *   - Brand logo
 *   - Search icon (opens search overlay)
 *   - Profile avatar
 */
const BuyerHeader = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts = [] } = useSelector((state) => state.products || {});
  const { categories = [] } = useSelector((state) => state.shop || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isAuthed = !!(user && (user.isAuthenticated ?? true));

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) { setSearchData([]); return; }

    const termLower = term.toLowerCase();
    const seen = new Set();
    const results = (allProducts || []).reduce((acc, p) => {
      const name = (p.name || "").trim();
      if (!name || seen.has(name.toLowerCase())) return acc;
      seen.add(name.toLowerCase());
      if (name.toLowerCase().includes(termLower)) {
        let img = "/product-placeholder.svg";
        const raw = p.images?.[0] || p.image_Url?.[0]?.url || p.image_Url;
        if (raw) img = resolveImageUrl(raw) || img;
        acc.push({ id: p._id, name, image: img, category: p.category });
      }
      return acc;
    }, []);
    setSearchData(results.slice(0, 8));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/my-dashboard/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchData([]);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logged out");
      window.location.href = "/";
    } catch {
      toast.error("Logout failed");
    }
  };

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <>
      {/* ═══════════════ DESKTOP HEADER ═══════════════ */}
      <header className="hidden md:flex w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-4 h-[68px]">

          {/* Logo */}
          <Link to="/my-dashboard" className="flex-shrink-0">
            <BrandLogo size="sm" showText={true} showTagline={false} linked={false} />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent overflow-hidden transition">
              {/* Category Dropdown */}
              <button type="button" onClick={() => setDropDown(!dropDown)}
                className="px-3 py-2.5 text-gray-700 font-medium text-sm border-r border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <span className="hidden lg:inline">{selectedCategory}</span>
                <span className="lg:hidden">Cat</span>
                <IoIosArrowDown size={14} className={`transition-transform ${dropDown ? 'rotate-180' : ''}`} />
              </button>

              <input type="text" placeholder="Search products, shops..." value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent" />

              <button type="submit" className="px-3 py-2.5 hover:bg-gray-100 transition-colors">
                <AiOutlineSearch size={18} className="text-gray-600" />
              </button>

              {/* Category Dropdown Menu */}
              {dropDown && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-lg z-50 rounded-b-lg border border-gray-200 max-h-72 overflow-y-auto">
                  <button onClick={() => { setSelectedCategory("All"); setDropDown(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-sm font-medium border-b border-gray-100">All Categories</button>
                  {categories.map((cat) => (
                    <button key={cat._id || cat.id}
                      onClick={() => { setSelectedCategory(cat.name); setDropDown(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-sm border-b border-gray-100 last:border-0">{cat.name}</button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {searchTerm.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg z-40 rounded-lg border border-gray-200 max-h-72 overflow-y-auto">
                  {searchData.length > 0 ? searchData.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`}
                      onClick={() => { setSearchTerm(""); setSearchData([]); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      <img src={item.image} alt="" className="w-9 h-9 object-cover rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </Link>
                  )) : (
                    <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/my-dashboard/marketplace" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition">
              <MdOutlineStorefront size={16} />
              <span>Marketplace</span>
            </Link>
            <Link to="/my-dashboard/orders" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition">
              <RxBackpack size={16} />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Link to="/my-dashboard/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <AiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/checkout"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <AiOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            <Link to="/inbox"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <BiMessageSquareDetail size={20} />
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition">
              {isAuthed && user ? (
                <Avatar data={user} fallback="/logo192.png" alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-teal-500" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
                  <RxPerson size={18} className="text-teal-700" />
                </div>
              )}
              <div className="hidden xl:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">{user?.name || "Account"}</p>
                <p className="text-[11px] text-gray-500">{isSeller ? "Seller" : "Buyer"}</p>
              </div>
              <IoIosArrowDown size={14} className={`text-gray-500 transition-transform ${openProfile ? 'rotate-180' : ''}`} />
            </button>

            {openProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenProfile(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  {/* Dashboard Links */}
                  <div className="py-1">
                    <ProfileLink to="/my-dashboard" icon={RxDashboard} label="Dashboard" onClick={() => setOpenProfile(false)} />
                    <ProfileLink to="/my-dashboard/profile" icon={RxPerson} label="My Profile" onClick={() => setOpenProfile(false)} />
                    <ProfileLink to="/my-dashboard/orders" icon={RxBackpack} label="My Orders" onClick={() => setOpenProfile(false)} />
                    <ProfileLink to="/my-dashboard/settings" icon={RxReader} label="Settings" onClick={() => setOpenProfile(false)} />
                  </div>

                  {isSeller && (
                    <div className="py-1 border-t border-gray-100">
                      <ProfileLink to="/my-dashboard/business/products" icon={MdOutlineStorefront} label="My Business" onClick={() => setOpenProfile(false)} accent />
                    </div>
                  )}

                  <div className="py-1 border-t border-gray-100">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <MdLogout size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <header className="md:hidden flex items-center justify-between h-[60px] bg-white border-b border-gray-200 px-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} aria-label="Open menu"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <BiMenuAltLeft size={22} className="text-gray-700" />
          </button>
          <Link to="/my-dashboard">
            <BrandLogo size="sm" showText={false} showTagline={false} linked={false} />
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-700">
            <AiOutlineSearch size={20} />
          </button>

          <Link to="/checkout" className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-700">
            <AiOutlineShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>

          {isAuthed && user ? (
            <Link to="/my-dashboard/profile" className="w-9 h-9 rounded-full overflow-hidden">
              <Avatar data={user} fallback="/logo192.png" alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-teal-500" />
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-teal-700">Sign in</Link>
          )}
        </div>
      </header>

      {/* ═══════════════ MOBILE SEARCH OVERLAY ═══════════════ */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden">
          <div className="flex items-center gap-2 px-3 h-[60px] border-b border-gray-200">
            <button onClick={() => setMobileSearchOpen(false)}
              className="text-gray-600 text-sm font-semibold px-2">Cancel</button>
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileSearchOpen(false); }}
              className="flex-1 flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <input autoFocus type="text" placeholder="Search products..." value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none" />
              <button type="submit" className="px-3 py-2.5">
                <AiOutlineSearch size={18} className="text-gray-500" />
              </button>
            </form>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
            {searchData.length > 0 ? searchData.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`}
                onClick={() => { setSearchTerm(""); setSearchData([]); setMobileSearchOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
              </Link>
            )) : searchTerm.trim() ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No results found</div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">Type to search products</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const ProfileLink = ({ to, icon: Icon, label, onClick, accent }) => (
  <Link to={to} onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${accent ? 'text-orange-600 hover:bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

export default BuyerHeader;
