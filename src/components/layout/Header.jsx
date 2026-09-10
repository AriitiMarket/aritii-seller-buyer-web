import React, { useState, useEffect, useMemo } from 'react'
import styles from '../../styles/styles';
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
import DropDown from './DropDown';
import Navbar from './Navbar';
import { resolveImageUrl, getAvatarImage } from '../../utils/image';
import Cart from '../cart/cart';
import { RxCross1 } from 'react-icons/rx';
import Wishlist from '../wishlist/wishlist';
import { logoutUser, logoutSeller } from '../../store/redux/actions/user';
import { toast } from 'react-toastify';


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

  // Unified logout: clears both the customer and seller session cookies and
  // returns to the public marketplace home.
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
          {/* ── Desktop Top Bar ── */}
          <div className="hidden 800px:flex w-11/12 mx-auto justify-around bg-brand-cream">
            <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
              <Link to="/">
                <img
                  src="/aritii-logo.svg"
                  alt="Aritii Market"
                  className="h-[56px] w-auto object-contain"
                />
              </Link>
            </div>

            {/* Search */}
            <div className="w-[50%] relative mt-5">
              <input
                type="text"
                placeholder="Search products, shops, categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[42px] w-full px-4 border-brand border-[2px] rounded-lg bg-white text-brand-charcoal focus:border-brand-primary transition"
              />
              <AiOutlineSearch
                size={26}
                className="absolute right-3 top-2.5 cursor-pointer text-brand-muted"
              />
              {searchTerm.trim().length > 0 && (
                <div className="absolute w-full max-h-60 overflow-y-auto bg-white shadow-lg z-50 p-2 mt-1 rounded-lg border border-brand">
                  {searchData && searchData.length > 0 ? (
                    searchData.slice(0, 10).map((i, index) => (
                      <Link
                        to={`/product/${i._id || i.id}`}
                        key={i._id || i.id || index}
                        onClick={() => {
                          setSearchTerm(i.name);
                          setSearchData([]);
                        }}
                      >
                        <div className="w-full flex items-center py-2 hover:bg-brand-cream rounded px-2">
                          <img
                            src={i.image}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px] object-cover rounded"
                          />
                          <h1 className="text-sm text-brand-charcoal">{i.name}</h1>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-2 px-2 text-sm text-brand-muted">No products found</div>
                  )}
                </div>
              )}
            </div>

            {/* Become Seller / Dashboard button */}
            <div className={`${styles.button} !bg-brand-primary hover:!bg-brand-primary/90`}>
              {isSeller ? (
                <Link to="/dashboard">
                  <h1 className="text-[#fff] flex items-center">
                    Seller Center <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              ) : (
                <Link to="/sell">
                  <h1 className="text-[#fff] flex items-center">
                    Sell on Aritii <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              )}
            </div>

            {/* Account / Profile — role-aware, top-right. Logged-in users get a
                clear avatar + label leading to their own dashboard; guests get
                a Login / Register link. */}
            <div className="flex items-center gap-3 ml-2">
              {isSeller ? (
                <Link
                  to="/dashboard"
                  title="Seller Center"
                  className="flex items-center gap-2 bg-white border border-brand rounded-full pl-2 pr-3 py-1.5 shadow-sm hover:border-brand-primary"
                >
                  <img
                    src={avatarSrc}
                    onError={(e) => {
                      if (e.currentTarget.src === "/logo192.png") return;
                      e.currentTarget.onError = null;
                      e.currentTarget.src = "/logo192.png";
                    }}
                    className="w-[34px] h-[34px] rounded-full object-cover border-2 border-brand-primary"
                    alt="Seller"
                  />
                  <span className="text-sm font-[600] text-brand-charcoal">Seller Center</span>
                </Link>
              ) : isAuthenticated ? (
                <Link
                  to="/my-dashboard"
                  title="My Account"
                  className="flex items-center gap-2 bg-white border border-brand rounded-full pl-2 pr-3 py-1.5 shadow-sm hover:border-brand-primary"
                >
                  <img
                    src={avatarSrc}
                    onError={(e) => {
                      if (e.currentTarget.src === "/logo192.png") return;
                      e.currentTarget.onError = null;
                      e.currentTarget.src = "/logo192.png";
                    }}
                    className="w-[34px] h-[34px] rounded-full object-cover border-2 border-brand-accent"
                    alt="My Account"
                  />
                  <span className="text-sm font-[600] text-brand-charcoal">
                    {user?.name ? user.name.split(" ")[0] : "My Account"}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white border border-brand rounded-full pl-3 pr-3 py-1.5 shadow-sm hover:border-brand-primary"
                >
                  <span className="text-sm font-[600] text-brand-charcoal">Login / Register</span>
                </Link>
              )}
            </div>
          </div>

          {/* ── Desktop Navbar ── */}
          <div className={`${active === true ? "shadow-md fixed top-0 left-0 z-50" : ""} transition w-full hidden 800px:block`}>
            <div className={`flex items-center justify-between w-full bg-brand-primary h-[70px] ${active ? "" : ""}`}>
              <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>

                {/* Categories dropdown */}
                <div>
                  <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                    <BiMenuAltLeft size={30} className="absolute top-3 left-2 text-brand-charcoal" />
                    <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md text-brand-charcoal">
                      All Categories
                    </button>
                    <IoIosArrowDown
                      size={20}
                      className="absolute right-2 top-4 cursor-pointer text-brand-charcoal"
                      onClick={() => setDropDown(!dropDown)}
                    />
                    {dropDown ? (
                      <DropDown
                        categoriesData={categories}
                        setDropDown={setDropDown}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Nav links */}
                <div className={`${styles.noramlFlex}`}>
                  <Navbar active={activeHeading} />
                </div>

                {/* Right icons — wishlist, cart, profile */}
                <div className={`flex ${styles.noramlFlex}`}>

                  {/* Wishlist */}
                  <div className={`${styles.noramlFlex}`}>
                    <div
                      className="relative cursor-pointer mr-[15px]"
                      onClick={() => setOpenWishlist(true)}
                    >
                      <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                      <span className="absolute right-0 top-0 rounded-full bg-brand-accent w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                        {wishlist && wishlist.length}
                      </span>
                    </div>
                  </div>

                  {/* Cart */}
                  <div className={`${styles.noramlFlex}`}>
                    <div
                      className="relative cursor-pointer mr-[15px]"
                      onClick={() => setOpenCart(true)}
                    >
                      <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                      <span className="absolute right-0 top-0 rounded-full bg-brand-accent w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                        {cart && cart.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile Header ── */}
          <div
            className={`${
              active === true ? "fixed top-0 left-0 z-50 shadow-md" : ""
            } w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
          >
            <div className="w-full flex items-center justify-between px-4 h-full">
              <div>
                <BiMenuAltLeft
                  size={40}
                  className="cursor-pointer text-brand-charcoal"
                  onClick={() => setOpen(true)}
                />
              </div>
              <div>
                <Link to="/">
                  <img
                    src="/aritii-logo.svg"
                    alt="Aritii Market"
                    className="h-[44px] w-auto object-contain cursor-pointer"
                  />
                </Link>
              </div>
              <div>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenCart(true)}
                >
                  <AiOutlineShoppingCart size={30} className="text-brand-charcoal" />
                  <span className="absolute right-0 top-0 rounded-full bg-brand-accent w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {cart && cart.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Drawer */}
            {open && (
              <div className="fixed w-full h-full bg-[#00000030] z-50 top-0 left-0" onClick={() => setOpen(false)}>
                <div
                  className="fixed w-[75%] sm:w-[60%] bg-[#fff] h-screen top-0 left-0 z-50 overflow-y-auto shadow-2xl flex flex-col justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <div className="w-full flex justify-between items-center p-4 border-b border-brand bg-brand-cream">
                      <div
                        className="relative mr-[15px] cursor-pointer"
                        onClick={() => {
                          setOpenWishlist(true);
                          setOpen(false);
                        }}
                      >
                        <AiOutlineHeart size={30} className="text-brand-charcoal" />
                        <span className="absolute right-0 top-0 rounded-full bg-brand-accent w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                          {wishlist && wishlist.length}
                        </span>
                      </div>
                      <RxCross1
                        size={30}
                        className="cursor-pointer text-brand-charcoal hover:text-brand-primary transition"
                        onClick={() => setOpen(false)}
                      />
                    </div>

                    <div className="px-4 mt-4 flex items-center justify-between">
                      <Link to="/" onClick={() => setOpen(false)}>
                        <span className="text-xl font-semibold text-brand-primary">Aritii Market</span>
                      </Link>
                    </div>

                    {/* Search inside drawer */}
                    <div className="px-4 my-4 relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="h-[40px] w-full px-3 border-brand border-[2px] rounded-lg text-sm outline-none text-brand-charcoal focus:border-brand-primary"
                      />
                      <AiOutlineSearch
                        size={25}
                        className="absolute right-6 top-2 cursor-pointer text-brand-muted"
                      />
                      {searchTerm.trim().length > 0 && (
                        <div className="absolute w-[calc(100%-2rem)] max-h-60 overflow-y-auto bg-white shadow-lg z-50 p-2 mt-1 rounded-lg border border-brand">
                          {searchData && searchData.length > 0 ? (
                            searchData.map((i, index) => (
                              <Link
                                to={`/product/${i._id || i.id}`}
                                key={i._id || i.id || index}
                                onClick={() => {
                                  setSearchTerm(i.name);
                                  setSearchData([]);
                                  setOpen(false);
                                }}
                              >
                                <div className="w-full flex items-center py-2 hover:bg-brand-cream rounded px-2">
                                  <img
                                    src={i.image}
                                    alt=""
                                    className="w-[40px] h-[40px] mr-[10px] object-cover rounded"
                                  />
                                  <h1 className="text-sm text-brand-charcoal font-medium">{i.name}</h1>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="py-2 px-2 text-sm text-brand-muted">No products found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Nav links */}
                    <div className="mt-6 px-4">
                      <Navbar active={activeHeading} />
                    </div>
                  </div>

                  {/* Drawer footer */}
                  <div className="p-4 border-t border-brand bg-brand-cream">
                    <div className="flex w-full justify-center mb-6">
                      {isSeller ? (
                        <Link to="/dashboard" onClick={() => setOpen(false)}>
                          <div className="w-[150px] bg-brand-primary h-[45px] flex items-center justify-center rounded-lg cursor-pointer">
                            <h1 className="text-[#fff] flex items-center text-sm font-medium">
                              Seller Center <IoIosArrowForward className="ml-1" />
                            </h1>
                          </div>
                        </Link>
                      ) : (
                        <Link to="/sell" onClick={() => setOpen(false)}>
                          <div className="w-[150px] bg-brand-accent h-[45px] flex items-center justify-center rounded-lg cursor-pointer">
                            <h1 className="text-brand-charcoal flex items-center text-sm font-medium">
                              Sell on Aritii <IoIosArrowForward className="ml-1" />
                            </h1>
                          </div>
                        </Link>
                      )}
                    </div>

                    <div className="flex w-full justify-center">
                      {isSeller ? (
                        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                          <img
                            src={avatarSrc}
                            onError={(e) => {
                              if (e.currentTarget.src === "/logo192.png") return;
                              e.currentTarget.onError = null;
                              e.currentTarget.src = "/logo192.png";
                            }}
                            className="w-[40px] h-[40px] rounded-full border border-gray-300 object-cover"
                            alt="My Shop"
                          />
                          <span className="text-brand-charcoal font-semibold text-sm">
                            {(seller && seller.name) || "My Shop"}
                          </span>
                        </Link>
                      ) : isAuthenticated ? (
                        <Link to="/my-dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                          <img
                            src={avatarSrc}
                            onError={(e) => {
                              if (e.currentTarget.src === "/logo192.png") return;
                              e.currentTarget.onError = null;
                              e.currentTarget.src = "/logo192.png";
                            }}
                            className="w-[40px] h-[40px] rounded-full border border-gray-300 object-cover"
                            alt="user avatar"
                          />
                          <span className="text-brand-charcoal font-semibold text-sm">
                            {user?.name || "My Profile"}
                          </span>
                        </Link>
                      ) : (
                        <Link to="/login" className="flex items-center gap-2 text-brand-charcoal hover:text-brand-primary font-semibold" onClick={() => setOpen(false)}>
                          <span className="text-sm">Login / Register</span>
                        </Link>
                      )}

                      {/* Logout (mobile) */}
                      {(isAuthenticated || isSeller) && (
                        <div
                          className="flex items-center gap-2 text-brand-primary cursor-pointer mt-3"
                          onClick={() => {
                            setOpen(false);
                            handleLogout();
                          }}
                        >
                          <AiOutlineLogout size={26} />
                          <span className="text-sm font-semibold">Logout</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* Wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}

        </>
      )}
    </>
  );
};

export default Header;