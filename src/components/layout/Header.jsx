import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineLogout,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { RxCross1 } from 'react-icons/rx';
import DropDown from './DropDown';
import Navbar from './Navbar';
import BrandLogo from '../common/BrandLogo';
import { resolveImageUrl, getAvatarImage } from '../../utils/image';
import Cart from '../cart/cart';
import Wishlist from '../wishlist/wishlist';
import { logoutUser, logoutSeller } from '../../store/redux/actions/user';
import { toast } from 'react-toastify';

/**
 * Header Component (MainHeader equivalent)
 * Premium unified marketplace header with:
 * - Brand logo with 'A' monogram + text + tagline
 * - Multi-category search form with category dropdown
 * - User account section with avatar
 * - Wishlist with badge count
 * - Shopping cart with badge count and total
 * - White background with sticky positioning
 * - Fully responsive mobile/tablet/desktop layouts using standard Tailwind breakpoints
 */
const Header = ({ activeHeading }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [openExplore, setOpenExplore] = useState(false);

  const { allProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.shop);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchData([]);
      return;
    }

    const termLower = term.toLowerCase();

    const normalized = (allProducts || []).reduce((acc, p) => {
      const name = (p.name || "").trim();
      if (!name) return acc;
      const key = name.toLowerCase();
      if (!acc.map.has(key)) {
        acc.map.set(key, true);

        let resolvedImage = "/product-placeholder.svg";
        const rawImg = p.images?.[0] || p.image_Url?.[0]?.url || p.image_Url;
        if (rawImg) {
          resolvedImage = resolveImageUrl(rawImg) || resolvedImage;
        }

        acc.list.push({
          id: p._id || p.id,
          name,
          image: resolvedImage,
        });
      }
      return acc;
    }, { map: new Map(), list: [] }).list;

    const filtered = normalized.filter((p) => p.name.toLowerCase().includes(termLower));
    setSearchData(filtered.slice(0, 10));
  };

  // Calculate cart total
  const cartTotal = useMemo(() => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const avatarSrc = useMemo(
    () => getAvatarImage(isSeller ? seller || user : user) || "/logo192.png",
    [isSeller, seller, user]
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e?.preventDefault?.();
    try {
      await dispatch(logoutUser());
    } catch { /* ignore non-fatal */ }
    try {
      await dispatch(logoutSeller());
    } catch { /* ignore non-fatal */ }
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <>
      {loading ? null : (
        <>
          {/* ════════════════════════════════════════════════════════════ */}
          {/* ──────────────── DESKTOP HEADER (md+: 768px+) ───────────── */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className="hidden md:flex w-full justify-center bg-white border-b border-gray-200 py-3 lg:py-4 shadow-sm sticky top-0 z-50">
            <div className="w-full max-w-7xl px-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-6">
              
              {/* Logo */}
              <BrandLogo size="md" showText={true} showTagline={true} />

              {/* Search Bar */}
              <div className="flex-1 max-w-xl relative">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-[#E5A93C] focus-within:border-transparent overflow-hidden transition">
                  
                  {/* Category Dropdown */}
                  <button
                    onClick={() => setDropDown(!dropDown)}
                    className="px-3 lg:px-4 py-2 lg:py-3 text-gray-700 font-medium text-sm border-r border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">{selectedCategory}</span>
                    <span className="sm:hidden">Cat</span>
                    <IoIosArrowDown size={16} className={`transition-transform ${dropDown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1 px-3 lg:px-4 py-2 lg:py-3 text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                  />
                  
                  {/* Search Button */}
                  <button className="px-3 lg:px-4 py-2 lg:py-3 hover:bg-gray-100 transition-colors">
                    <AiOutlineSearch size={20} className="text-gray-600" />
                  </button>

                  {/* Category Dropdown Menu */}
                  {dropDown && (
                    <div className="absolute top-full left-0 w-64 bg-white shadow-lg z-50 rounded-b-lg border border-gray-200 mt-0 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSelectedCategory("All Categories");
                            setDropDown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-green-50 rounded transition-colors font-medium text-sm text-gray-900 border-b border-gray-100 last:border-b-0"
                        >
                          All Categories
                        </button>
                        {categories && categories.length > 0 ? (
                          categories.map((cat) => (
                            <button
                              key={cat._id || cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.name);
                                setDropDown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-green-50 rounded transition-colors font-medium text-sm text-gray-900 border-b border-gray-100 last:border-b-0"
                            >
                              {cat.name}
                            </button>
                          ))
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {searchTerm.trim().length > 0 && (
                  <div className="absolute w-full max-h-60 overflow-y-auto bg-white shadow-lg z-40 rounded-lg border border-gray-200 mt-2">
                    {searchData && searchData.length > 0 ? (
                      searchData.slice(0, 10).map((i, index) => (
                        <Link
                          to={`/product/${i.id}`}
                          key={i.id || index}
                          onClick={() => {
                            setSearchTerm(i.name);
                            setSearchData([]);
                          }}
                        >
                          <div className="w-full flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0">
                            <img src={i.image} alt="" className="w-10 h-10 object-cover rounded" />
                            <p className="text-sm text-gray-900">{i.name}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="py-3 px-4 text-sm text-gray-600">No products found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Explore Dropdown */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setOpenExplore(!openExplore)}
                  className="flex items-center gap-1.5 px-4 py-2 text-[#052919] hover:bg-[#052919]/10 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  <span>Explore</span>
                  <IoIosArrowDown size={14} className={`transition-transform ${openExplore ? 'rotate-180' : ''}`} />
                </button>

                {openExplore && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenExplore(false)} />
                    <div className="absolute top-full right-0 mt-2 w-[520px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-5">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Marketplace */}
                        <div>
                          <h4 className="text-xs font-bold text-[#052919] uppercase tracking-wider mb-3">Marketplace</h4>
                          <div className="space-y-1">
                            <Link to="/explore/products" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">📦</span>
                              <span>Products</span>
                            </Link>
                            <Link to="/explore/shops" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">🏪</span>
                              <span>Shops</span>
                            </Link>
                            <Link to="/explore/categories" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">📂</span>
                              <span>Categories</span>
                            </Link>
                            <Link to="/best-selling" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">🔥</span>
                              <span>Best Selling</span>
                            </Link>
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="text-xs font-bold text-[#052919] uppercase tracking-wider mb-3">Features</h4>
                          <div className="space-y-1">
                            <Link to="/events" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">🎉</span>
                              <span>Deals & Events</span>
                            </Link>
                            <Link to="/how-it-works" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">⚙️</span>
                              <span>How It Works</span>
                            </Link>
                            <Link to="/sell" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">💼</span>
                              <span>Seller Portal</span>
                            </Link>
                            <Link to="/shops" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">🏬</span>
                              <span>All Shops</span>
                            </Link>
                          </div>
                        </div>

                        {/* About */}
                        <div>
                          <h4 className="text-xs font-bold text-[#052919] uppercase tracking-wider mb-3">About</h4>
                          <div className="space-y-1">
                            <Link to="/about-platform" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">ℹ️</span>
                              <span>About Aritii</span>
                            </Link>
                            <Link to="/faq" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">❓</span>
                              <span>FAQ</span>
                            </Link>
                            <Link to="/explore/events" onClick={() => setOpenExplore(false)} className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-700 hover:bg-[#052919]/5 hover:text-[#052919] rounded-lg transition-colors">
                              <span className="text-base">📅</span>
                              <span>Events</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Wishlist & Cart Icons */}
              <div className="flex items-center gap-2 lg:gap-4">
                
                {/* Wishlist */}
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setOpenWishlist(true)}
                  title="Wishlist"
                >
                  <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <AiOutlineHeart size={24} className="text-gray-700 group-hover:text-[#E5A93C]" />
                    {wishlist && wishlist.length > 0 && (
                      <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#C8522C] text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shopping Cart */}
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setOpenCart(true)}
                  title="Shopping Cart"
                >
                  <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <AiOutlineShoppingCart size={24} className="text-gray-700 group-hover:text-[#E5A93C]" />
                    {cart && cart.length > 0 && (
                      <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#C8522C] text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  {cart && cart.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {cartTotal.toFixed(2)} ETB
                    </div>
                  )}
                </div>
              </div>

              {/* Account */}
              <div className="flex items-center gap-2 lg:gap-3 border-l border-gray-200 pl-3 lg:pl-4">
                {isSeller ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-2 lg:px-3 py-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all group"
                  >
                    <img
                      src={avatarSrc}
                      onError={(e) => {
                        if (e.currentTarget.src === "/logo192.png") return;
                        e.currentTarget.onError = null;
                        e.currentTarget.src = "/logo192.png";
                      }}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#E5A93C]"
                      alt="Seller"
                    />
                    <span className="text-sm font-semibold text-gray-900 hidden lg:inline">Seller</span>
                  </Link>
                ) : isAuthenticated ? (
                  <Link
                    to="/my-dashboard"
                    className="flex items-center gap-2 px-2 lg:px-3 py-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all group"
                  >
                    <img
                      src={avatarSrc}
                      onError={(e) => {
                        if (e.currentTarget.src === "/logo192.png") return;
                        e.currentTarget.onError = null;
                        e.currentTarget.src = "/logo192.png";
                      }}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#E5A93C]"
                      alt="Account"
                    />
                    <span className="text-sm font-semibold text-gray-900 hidden lg:inline">
                      {user?.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 text-sm whitespace-nowrap"
                  >
                    Login
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <AiOutlineLogout size={22} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ──────────────── MOBILE HEADER (< 768px) ────────────────── */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className={`${active === true ? "fixed top-0 left-0 z-50 shadow-lg" : "sticky top-0 z-50"} md:hidden transition w-full h-16 bg-white border-b border-gray-200`}>
            <div className="w-full flex items-center justify-between px-3 h-full gap-2">
              
              {/* Menu Button */}
              <button
                className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setOpen(true)}
              >
                <BiMenuAltLeft size={24} className="text-gray-900" />
              </button>

              {/* Logo */}
              <Link to="/" className="flex-1 flex justify-center items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#052919] to-green-700 flex items-center justify-center border-2 border-[#E5A93C]">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="text-sm font-bold text-[#052919]">Aritii</span>
              </Link>

              {/* Wishlist & Cart */}
              <div className="flex items-center gap-1">
                {/* Wishlist */}
                <button
                  className="relative flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setOpenWishlist(true)}
                >
                  <AiOutlineHeart size={20} className="text-[#052919]" />
                  {wishlist && wishlist.length > 0 && (
                    <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-[#C8522C] text-white text-xs font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  className="relative flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setOpenCart(true)}
                >
                  <AiOutlineShoppingCart size={20} className="text-[#052919]" />
                  {cart && cart.length > 0 && (
                    <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-[#C8522C] text-white text-xs font-bold flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Drawer */}
            {open && (
              <div className="fixed inset-0 bg-black/30 z-40 top-16" onClick={() => setOpen(false)}>
                <div
                  className="fixed w-4/5 sm:w-1/2 bg-white h-screen top-16 left-0 z-50 overflow-y-auto shadow-xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A93C]"
                      />
                      <AiOutlineSearch size={18} className="absolute right-3 top-2.5 text-gray-500" />
                      {searchTerm.trim().length > 0 && (
                        <div className="absolute w-full top-full mt-2 max-h-60 overflow-y-auto bg-white shadow-lg z-50 rounded-lg border border-gray-200">
                          {searchData && searchData.length > 0 ? (
                            searchData.map((i, index) => (
                              <Link
                                to={`/product/${i.id}`}
                                key={i.id || index}
                                onClick={() => {
                                  setSearchTerm(i.name);
                                  setSearchData([]);
                                  setOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                  <img src={i.image} alt="" className="w-8 h-8 object-cover rounded" />
                                  <p className="text-sm text-gray-900">{i.name}</p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="py-2 px-3 text-sm text-gray-600">No products found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="border-b border-gray-200 py-3">
                    <Navbar active={activeHeading} />
                  </nav>

                  {/* Categories */}
                  <div className="border-b border-gray-200 p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Categories</h3>
                    <div className="space-y-2">
                      {categories && categories.length > 0
                        ? categories.slice(0, 8).map((cat) => (
                            <Link
                              key={cat._id || cat.id}
                              to={`/category/${cat._id || cat.id}`}
                              onClick={() => setOpen(false)}
                              className="block px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium"
                            >
                              {cat.name}
                            </Link>
                          ))
                        : null}
                    </div>
                  </div>

                  {/* Explore Section */}
                  <div className="border-b border-gray-200 p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Explore</h3>
                    <div className="space-y-1">
                      <Link to="/explore/products" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#052919] hover:bg-[#052919]/5 rounded text-sm font-semibold">
                        <span>📦</span><span>Products</span>
                      </Link>
                      <Link to="/explore/shops" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#052919] hover:bg-[#052919]/5 rounded text-sm font-semibold">
                        <span>🏪</span><span>Shops</span>
                      </Link>
                      <Link to="/explore/categories" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#052919] hover:bg-[#052919]/5 rounded text-sm font-semibold">
                        <span>📂</span><span>Categories</span>
                      </Link>
                      <Link to="/best-selling" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#052919] hover:bg-[#052919]/5 rounded text-sm font-semibold">
                        <span>🔥</span><span>Best Selling</span>
                      </Link>
                      <Link to="/events" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#052919] hover:bg-[#052919]/5 rounded text-sm font-semibold">
                        <span>🎉</span><span>Deals & Events</span>
                      </Link>
                    </div>
                  </div>

                  {/* Features & About */}
                  <div className="border-b border-gray-200 p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Features & About</h3>
                    <div className="space-y-1">
                      <Link to="/how-it-works" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium">
                        <span>⚙️</span><span>How It Works</span>
                      </Link>
                      <Link to="/sell" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium">
                        <span>💼</span><span>Seller Portal</span>
                      </Link>
                      <Link to="/shops" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium">
                        <span>🏬</span><span>All Shops</span>
                      </Link>
                      <Link to="/about-platform" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium">
                        <span>ℹ️</span><span>About Aritii</span>
                      </Link>
                      <Link to="/faq" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#052919]/5 rounded text-sm font-medium">
                        <span>❓</span><span>FAQ</span>
                      </Link>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-3 bg-gray-50 space-y-2 mt-auto">
                    {isSeller ? (
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="w-full block px-3 py-2 bg-gradient-to-r from-[#052919] to-green-600 text-white rounded-lg font-semibold text-center text-sm"
                      >
                        Seller Center
                      </Link>
                    ) : (
                      <Link
                        to="/sell"
                        onClick={() => setOpen(false)}
                        className="w-full block px-3 py-2 bg-gradient-to-r from-[#052919] to-green-600 text-white rounded-lg font-semibold text-center text-sm"
                      >
                        Sell on Aritii
                      </Link>
                    )}

                    {isAuthenticated ? (
                      <button
                        onClick={(e) => {
                          handleLogout(e);
                          setOpen(false);
                        }}
                        className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="w-full block px-3 py-2 bg-white border border-gray-300 text-[#052919] rounded-lg font-semibold text-center text-sm"
                      >
                        Login / Register
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Popup */}
          {openCart && <Cart setOpenCart={setOpenCart} />}

          {/* Wishlist Popup */}
          {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
        </>
      )}
    </>
  );
};

export default Header;
