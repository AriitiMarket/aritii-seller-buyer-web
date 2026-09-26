import React, { useState, useEffect, useCallback, useRef } from "react";
import { BUYER_PROFILE_DROPDOWN } from '@/config/navigation';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from '@/components/common/ImageWithFallback';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { MdNotifications, MdClose } from "react-icons/md";
import BrandLogo from '@/components/common/BrandLogo';
import ProfileMenu from '@/shared/components/header/ProfileMenu';
import { resolveImageUrl } from '@/shared/utils/image';
import { logoutUser } from '@/store/slices/userThunks';
import { getAllOrdersOfUser } from '@/store/slices/orderThunks';
import { toast } from 'react-toastify';
import { PlaceholderAvatar, PlaceholderProduct } from '@/assets';

const BuyerHeader = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts = [] } = useSelector((state) => state.products || {});
  const orders = useSelector((state) => state.order?.orders || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const isAuthed = !!(user && (user.isAuthenticated ?? true));
  const cartCount = cart?.reduce((t, i) => t + Number(i.quantity ?? 1), 0) || 0;
  const wishlistCount = wishlist?.length || 0;
  const pendingOrders = orders.filter(o => {
    const s = String(o.orderStatus || o.status || '').toLowerCase();
    return s !== 'delivered' && s !== 'cancelled' && s !== 'completed' && s !== 'failed' && s !== 'succeeded';
  }).length;

  // Bootstrap orders so the badge is populated on every page (not only after
  // visiting the Orders page).
  const userId = user?.id || user?._id;
  useEffect(() => {
    if (userId && isAuthed) dispatch(getAllOrdersOfUser(userId));
  }, [dispatch, userId, isAuthed]);

  // Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          searchInputRef.current?.focus();
        } else {
          setMobileSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearchChange = useCallback((e) => {
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
        let img = PlaceholderProduct;
        const raw = p.images?.[0] || p.image_Url?.[0]?.url || p.image_Url;
        if (raw) img = resolveImageUrl(raw) || img;
        const catName = typeof p.category === 'string' ? p.category : p.category?.name || p.category?.title || '';
              acc.push({ id: p._id, name, image: img, category: catName, price: p.discountPrice || 0 });
      }
      return acc;
    }, []);
    setSearchData(results.slice(0, 6));
  }, [allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/my-dashboard/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSearchData([]);
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* ═══════════════ DESKTOP HEADER ═══════════════ */}
      <header className="hidden lg:flex items-center sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-16" role="banner">
        <div className="w-full max-w-7xl mx-auto px-4 xl:px-6 flex items-center gap-4">
          {/* Logo */}
          <Link to="/my-dashboard" className="flex-shrink-0" aria-label="Aritii home">
            <BrandLogo size="sm" showText={true} showTagline={false} linked={false} />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative" role="search">
            <div className="flex items-center bg-gray-100/80 rounded-lg border border-transparent focus-within:border-[#75d04b]/40 focus-within:bg-white focus-within:shadow-sm transition-all">
              <AiOutlineSearch size={16} className="text-gray-400 ml-3 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-2 py-2 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                aria-label="Search products and shops"
              />
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 mr-2 text-[10px] font-medium text-gray-400 bg-gray-200/60 rounded">
                <span className="text-[11px]">Ctrl</span>
                <span>K</span>
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {searchTerm.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl z-50 rounded-xl border border-gray-200 overflow-hidden">
                {searchData.length > 0 ? (
                  <>
                    {searchData.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => { setSearchTerm(""); setSearchData([]); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                      >
                        <img src={item.image} alt="" className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">{typeof item.category === 'string' ? item.category : item.category?.name || item.category?.title || ''}</p>
                        </div>
                        {item.price > 0 && (
                          <span className="text-sm font-semibold text-[#75d04b] flex-shrink-0">{Number(item.price).toLocaleString()} ETB</span>
                        )}
                      </Link>
                    ))}
                    <Link
                      to={`/my-dashboard/marketplace?search=${encodeURIComponent(searchTerm.trim())}`}
                      onClick={() => { setSearchTerm(""); setSearchData([]); }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#75d04b] hover:bg-gray-50 border-t border-gray-100 transition"
                    >
                      View all results for "{searchTerm}"
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500">No results found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <button
              className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition text-gray-600"
              aria-label="Notifications"
            >
              <MdNotifications size={20} />
              {pendingOrders > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                  {pendingOrders > 9 ? '9+' : pendingOrders}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/my-dashboard/wishlist"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition text-gray-600"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <AiOutlineHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/my-dashboard/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition text-gray-600"
              aria-label={`Cart, ${cartCount} items`}
            >
              <AiOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#75d04b] text-white text-[9px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile — rightmost */}
            <ProfileMenu
              items={BUYER_PROFILE_DROPDOWN}
              user={user}
              fallback={PlaceholderAvatar}
              isSeller={isSeller}
              onLogout={handleLogout}
              menuId="buyer-profile-menu"
            />
          </div>
        </div>
      </header>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-14 flex items-center px-3 gap-2" role="banner">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <Link to="/my-dashboard" className="flex-shrink-0" aria-label="Aritii home">
          <BrandLogo size="sm" showText={false} showTagline={false} linked={false} />
        </Link>

        <div className="flex-1" />

        <button
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Search"
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
        >
          <AiOutlineSearch size={20} />
        </button>

        <Link
          to="/my-dashboard/wishlist"
          className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          aria-label="Wishlist"
        >
          <AiOutlineHeart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute top-1.5 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </Link>

        <Link
          to="/my-dashboard/cart"
          className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          aria-label="Cart"
        >
          <AiOutlineShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute top-1.5 right-1 w-3.5 h-3.5 bg-[#75d04b] text-white text-[8px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>
      </header>

      {/* ═══════════════ MOBILE SEARCH OVERLAY ═══════════════ */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col" role="dialog" aria-label="Search">
          <div className="flex items-center gap-2 px-3 h-14 border-b border-gray-200 flex-shrink-0">
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileSearchOpen(false); }} className="flex-1 flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <AiOutlineSearch size={16} className="text-gray-400 ml-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search products, brands, shops..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button type="button" onClick={() => { setSearchTerm(""); setSearchData([]); }} className="px-2 text-gray-400">
                  <MdClose size={16} />
                </button>
              )}
            </form>
            <button
              onClick={() => { setMobileSearchOpen(false); setSearchTerm(""); setSearchData([]); }}
              className="text-sm font-semibold text-gray-600 px-2 flex-shrink-0"
            >
              Cancel
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchData.length > 0 ? searchData.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                onClick={() => { setSearchTerm(""); setSearchData([]); setMobileSearchOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-50"
              >
                <img src={item.image} alt="" className="w-11 h-11 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">{typeof item.category === 'string' ? item.category : item.category?.name || item.category?.title || ''}</p>
                </div>
                {item.price > 0 && (
                  <span className="text-sm font-semibold text-[#75d04b] flex-shrink-0">{Number(item.price).toLocaleString()} ETB</span>
                )}
              </Link>
            )) : searchTerm.trim() ? (
              <div className="px-4 py-16 text-center">
                <p className="text-sm text-gray-500">No results found</p>
              </div>
            ) : (
              <div className="px-4 py-16 text-center">
                <p className="text-sm text-gray-400">Type to search products</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerHeader;
