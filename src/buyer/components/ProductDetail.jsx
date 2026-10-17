import { DeliveryAvailability } from "../../shared/components/DeliveryAvailability";
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/styles/styles';
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { AiFillStar, AiOutlineStar, AiOutlineMessage } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Ratings from '@/components/common/Ratings';
import { PlaceholderProduct } from '@/assets';
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks';
import { resolveImageUrl } from '@/shared/utils/image';
import { Avatar } from '@/components/common/ImageWithFallback';
import shopService from '@/services/shop.service';
import { useAuth } from '@/auth/hooks/useAuth';
import { TbTrendingUp } from 'react-icons/tb';

const ProductDetail = ({ data, basePath = '' }) => {

    const [click,setClick]=useState(false)
    const [count,setCount]=useState(1)
    const{wishlist} = useSelector((state)=>state.wishlist)
    const {cart} = useSelector((state)=>state.cart)
    const {user, isAuthenticated} = useSelector((state)=>state.user)
  const { currentProduct } = useSelector((state) => state.products);
    const dispatch = useDispatch();

  const [select, setSelect] = useState(0);
    const navigate = useNavigate();
    const [shopInfo, setShopInfo] = useState(null);

  // Backend is the source of truth: `available` = stock − reserved (public
  // payload) or derive from stock/reserved on full snapshots. UI only mirrors
  // it — cart add/update and checkout re-validate server-side.
  const availableUnits = data?.available !== undefined && data?.available !== null
    ? Math.max(0, Number(data.available) || 0)
    : Math.max(0, Number(data?.stock ?? 0) - Number(data?.reserved ?? 0));

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => { if (count > 1) setCount(count - 1); };


  
  // Jo jo products pehle hee wishlist main added hain to reload k baad b wo added rhen
    useEffect(() => {
      if (wishlist && data && wishlist.find((i) => i && i._id === data._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    }, [wishlist, data]);
  

     // Wishlist heart — driven purely by wishlist state (useEffect above);
     // toast only on confirmed success so a failed request never claims one.
      const addToWishlistHandler = async (product) => {
        if (!isAuthenticated) {
          toast.error('Please login to save items to your wishlist');
          return;
        }
        const saved = await dispatch(addToWishlist(product));
        if (saved) toast.success('Saved to wishlist');
      };

      const removeFromWishlistHandler = async (product) => {
        const removed = await dispatch(removeFromWishlist(product));
        if (removed) toast.success('Removed from wishlist');
      };
    


        const AddToCartHandler = async (id) => {
              const isItemExist = cart.find((i) => (i.productId || i._id) === id);
              if (isItemExist) {
                const nextQty = (isItemExist.quantity || 1) + 1;
                if (nextQty > availableUnits) {
                  toast.error(availableUnits < 1 ? 'Product is out of stock' : 'Product stock limited!');
                  return;
                }
                await dispatch(updateCartQuantity(id, nextQty));
                toast.success('Cart updated');
              } else {
                if (availableUnits < count || availableUnits < 1) {
                  toast.error(availableUnits < 1 ? 'Product is out of stock' : 'Product stock limited!');
                } else {
                  const cartData = { ...data, quantity: count };
                  const added = await dispatch(addTocart(cartData));
                  if (added) toast.success('Item added to cart');
                }
              }
            }



        // Product requests are the single way to talk to a seller: the chat
        // lives inside the request workspace, so this opens the request flow
        // with this shop pre-selected.
          const handleRequestProduct = () => {
            if (!isAuthenticated) {
              toast.error("Please login to request a product");
              return;
            }
            const shopId = data?.shop?._id || shopInfo?._id;
            navigate(
              shopId ? `/my-dashboard/requests/new/${shopId}` : '/my-dashboard/requests/new'
            );
          };


  const imageCandidates = [
    ...(Array.isArray(data?.images) ? data.images : []),
    ...(Array.isArray(data?.image_Url) ? data.image_Url : []),
    data?.image_Url,
    data?.image,
    data?.thumbnail,
  ];
  const images = imageCandidates.map(resolveImageUrl).filter(Boolean);


    const activePrice = data?.discountPrice ?? 0;
  const originalPrice = data?.originalPrice || 0;
  const shop = shopInfo || data?.shop;
  const shopRating = shop?.ratings ?? 0;
  const shopPath = basePath ? `${basePath}/shops/${shop?._id}` : `/shops/${shop?._id}`;

  useEffect(() => {
    const shopId = data?.shop?._id;

    if (!shopId) {
      setShopInfo(null);
      return;
    }

    // Guests must use the public shop endpoint (authed one redirects to login).
    const request = isAuthenticated
      ? shopService.getById(shopId)
      : shopService.getPublicById(shopId);

    request
      .then((shop) => {
        setShopInfo(shop);
      })
      .catch((error) => {
        console.error("Error fetching shop info:", error);
      });
  }, [data?.shop?._id, isAuthenticated]);



 
  return (
    <div className="bg-market-surface dark:bg-gray-900">
      {data ? (
        <>
          {/* MAIN PRODUCT SECTION */}
          <div className="max-w-7xl mx-auto px-0 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 md:gap-6">

              {/* LEFT SIDE — Image Gallery (3:4 aspect ratio) */}
              <div className="lg:col-span-2 px-4 sm:px-6 lg:px-0">
                <div className="space-y-4">
                  {/* Main Image - 3:4 aspect ratio */}
                  <div className="bg-market-surface-container-low dark:bg-gray-800 rounded-lg border border-market-border dark:border-gray-700 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={images[select] || PlaceholderProduct}
                      alt={data.name || 'Product image'}
                      className="w-full h-full object-contain p-6"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all h-20 w-20 ${
                            select === index
                              ? 'border-[#75d04b] ring-2 ring-[#75d04b]/20'
                              : 'border-market-border dark:border-gray-700 hover:border-[#75d04b] dark:hover:border-[#75d04b]'
                          }`}
                          onClick={() => setSelect(index)}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={img}
                            alt={`${data.name || 'Product'} image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE — Buy Box (Sticky on desktop) */}
              <div className="lg:col-span-1 px-4 sm:px-6 lg:px-0 lg:sticky lg:top-24 lg:h-fit">
                <div className="rounded-xl border border-market-border bg-market-surface-container-low dark:bg-gray-800 p-5 md:p-6 shadow-sm">
                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-bold text-[#131921] dark:text-white mb-3 leading-snug">
                    {data.name}
                  </h1>

                  {/* Rating + Review Count */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-market-border">
                    <Ratings rating={data?.ratings} />
                    {data?.reviews?.length > 0 && (
                      <span className="text-sm text-market-on-surface-variant dark:text-gray-400">
                        ({data.reviews.length} {data.reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      availableUnits > 8
                        ? 'bg-[#75d04b]/10 text-[#75d04b] border border-[#75d04b]/20'
                        : availableUnits > 0
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        availableUnits > 8
                          ? 'bg-[#75d04b]'
                          : availableUnits > 0
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}></span>
                      {availableUnits > 8 ? 'In Stock' : availableUnits > 0 ? `Only ${availableUnits} left` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Prime Badge */}
                  {data?.isPrime && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight bg-blue-600 text-white">
                        ✓ Prime
                      </span>
                    </div>
                  )}

                  {/* Price Display - Large */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-[#131921] dark:text-white">
                        {activePrice.toLocaleString()} ETB
                      </span>
                    </div>
                    {originalPrice && originalPrice > activePrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-market-on-surface-variant dark:text-gray-400 line-through">
                          {originalPrice.toLocaleString()} ETB
                        </span>
                        <span className="text-sm font-bold text-[#cc0c39] bg-[#cc0c39]/10 px-2.5 py-1 rounded">
                          {Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-market-on-surface-variant dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
                    {data.description}
                  </p>

                  <DeliveryAvailability shopId={data?.shopId} productId={data?._id} />

                  {isAuthenticated ? (
                    <>
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mb-4 bg-market-surface dark:bg-gray-700 rounded-lg p-1 w-fit">
                        <button
                          className="w-9 h-9 rounded-md text-market-on-surface dark:text-gray-300 font-bold hover:bg-market-surface-container dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-lg"
                          onClick={decrementCount}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-market-on-surface dark:text-white font-semibold px-5 py-2 min-w-[50px] text-center">
                          {count}
                        </span>
                        <button
                          className="w-9 h-9 rounded-md text-market-on-surface dark:text-gray-300 font-bold hover:bg-market-surface-container dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-lg"
                          onClick={incrementCount}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button - Large #75d04b green */}
                      <button
                        disabled={availableUnits < 1}
                        className={`w-full h-12 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-md mb-3 ${
                          availableUnits < 1
                            ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-[#75d04b] text-white hover:bg-[#6ac540] hover:shadow-lg active:scale-95'
                        }`}
                        onClick={() => AddToCartHandler(data._id)}
                        aria-label={availableUnits < 1 ? 'Product is out of stock' : 'Add to cart'}
                      >
                        <AiOutlineShoppingCart size={20} />
                        {availableUnits < 1 ? 'Out of Stock' : 'Add to Cart'}
                      </button>

                      {/* Wishlist Button - Heart */}
                      <button
                        className="w-full h-11 rounded-lg border-2 border-market-border dark:border-gray-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium text-market-on-surface dark:text-gray-300"
                        onClick={click ? () => removeFromWishlistHandler(data) : () => addToWishlistHandler(data)}
                        aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {click ? (
                          <AiFillHeart size={20} className="text-red-500" />
                        ) : (
                          <AiOutlineHeart size={20} />
                        )}
                        {click ? 'Saved' : 'Save'}
                      </button>

                      {/* Shop Info Card */}
                      <div className="bg-market-surface dark:bg-gray-700 rounded-lg border border-market-border dark:border-gray-600 p-4 mt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Link to={shopPath}>
                            <Avatar
                              data={shop}
                              alt={shop?.name || 'Shop avatar'}
                              className="w-12 h-12 rounded-full border-2 border-[#75d04b]"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={shopPath}>
                              <h3 className="font-semibold text-market-on-surface dark:text-white hover:text-[#75d04b] transition-colors truncate">
                                {shop?.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1 mt-0.5">
                              <AiFillStar className="text-yellow-400" size={14} />
                              <span className="text-xs text-market-on-surface-variant dark:text-gray-400">
                                {Number(shopRating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="w-full px-3 py-2 bg-[#75d04b] text-white hover:bg-[#6ac540] font-semibold rounded-lg transition-colors text-sm"
                          onClick={handleRequestProduct}
                          aria-label="Request this product from the seller"
                        >
                          Message Seller
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Guest CTA */
                    <div className="space-y-3 pt-2">
                      <Link
                        to="/sign-up"
                        className="block w-full h-12 bg-[#75d04b] text-white hover:bg-[#6ac540] font-bold rounded-lg transition-all duration-200 flex items-center justify-center text-base shadow-md hover:shadow-lg"
                      >
                        Sign Up to Buy
                      </Link>
                      <p className="text-center text-xs text-market-on-surface-variant dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#75d04b] hover:underline font-semibold">Login</Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SPECS/REVIEWS SECTION - Below image on mobile, in right column on desktop */}
          <ProductDetailInfo data={data} shop={shop} />

          {/* RELATED PRODUCTS SECTION */}
          <RelatedProductsSection productData={data} basePath="" />
        </>
      ) : null}
    </div>
  )
}


const ProductDetailInfo= ({data, shop})=>{
    const [active, setActive] = useState(1);
  const { isAuthenticated } = useAuth();
  const shopRating = shop?.ratings ?? 0;
  const tabRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  };
  const tabIds = { 1: 'tab-details', 2: 'tab-reviews', 3: 'tab-seller' };
  const panelIds = { 1: 'panel-details', 2: 'panel-reviews', 3: 'panel-seller' };
  const tabOrder = isAuthenticated ? [1, 2, 3] : [1, 2];

  const handleTabKeyDown = useCallback((e, tabId) => {
    const idx = tabOrder.indexOf(tabId);
    let nextIdx;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIdx = idx < tabOrder.length - 1 ? idx + 1 : 0;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIdx = idx > 0 ? idx - 1 : tabOrder.length - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = tabOrder.length - 1;
    } else {
      return;
    }
    const nextTab = tabOrder[nextIdx];
    setActive(nextTab);
    tabRefs[nextTab]?.current?.focus();
  }, [isAuthenticated]);

    return (

        <div className="bg-white dark:bg-gray-900 border-t border-market-border dark:border-gray-800 px-3 lg:px-10 py-8">
            <div
              className="w-full flex justify-between border-b border-market-border dark:border-gray-700 pt-10 pb-2"
              role="tablist"
              aria-label="Product information"
            >

                {/* DIV FOR PRODUCT DETAILS TAB */}
                <div className="relative">

                    <button
                        id={tabIds[1]}
                        ref={tabRefs[1]}
                        role="tab"
                        aria-selected={active === 1}
                        aria-controls={panelIds[1]}
                        tabIndex={active === 1 ? 0 : -1}
                        className={
                        `text-market-on-surface dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 1 ? 'text-market-secondary' : ''}`
                        }
                        onClick={() => setActive(1)}
                        onKeyDown={(e) => handleTabKeyDown(e, 1)}
                    >
                        Product Details
                    </button>


                     {active === 1 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}

                </div> 
                {/* END OF DIV FOR PRODUCT DETAILS TAB */}




                {/* DIV FOR PRODUCT REVIEWS TAB */}
                <div className="relative">
                    <button
                        id={tabIds[2]}
                        ref={tabRefs[2]}
                        role="tab"
                        aria-selected={active === 2}
                        aria-controls={panelIds[2]}
                        tabIndex={active === 2 ? 0 : -1}
                        className={
                        `text-market-on-surface dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 2 ? 'text-market-secondary' : ''}`
                        }
                        onClick={() => setActive(2)}
                        onKeyDown={(e) => handleTabKeyDown(e, 2)}
                    >
                        Product Reviews
                    </button>
                    {active === 2 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}
                </div>
                {/* END OF DIV FOR PRODUCT REVIEWS TAB */}






                {/* DIV FOR SELLER INFORMATION TAB (hidden for guests) */}
                {isAuthenticated && (
                <div className="relative">
                    <button
                        id={tabIds[3]}
                        ref={tabRefs[3]}
                        role="tab"
                        aria-selected={active === 3}
                        aria-controls={panelIds[3]}
                        tabIndex={active === 3 ? 0 : -1}
                        className={
                        `text-market-on-surface dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 3 ? 'text-market-secondary' : ''}`
                        }
                        onClick={() => setActive(3)}
                        onKeyDown={(e) => handleTabKeyDown(e, 3)}
                    >
                        Seller Information
                    </button>
                    {active === 3 ? (
                        <div className={`${styles.active_indicator}`} />
                    ) : null}
                </div>
                )}
                {/* END OF DIV FOR SELLER INFORMATION TAB */}



            </div>




            {/* PRODUCT DETAIL TAB */}
            {active === 1 ? (
                    <div
                      id={panelIds[1]}
                      role="tabpanel"
                      aria-labelledby={tabIds[1]}
                      tabIndex={0}
                    >
                    <p className="py-2 text-[18px] leading-8 pb-10 pt-5 whitespace-pre-line text-market-on-surface dark:text-gray-300">
                        {data.description}
                    </p>
                    </div>
            ) : null}




            {/* PRODUCT REVIEWS TAB */}
        {active === 2 ? (
        <div
          id={panelIds[2]}
          role="tabpanel"
          aria-labelledby={tabIds[2]}
          tabIndex={0}
          className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll"
        >
          {data?.reviews &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                

                {/* //resolving image of the user that gave review */}
                <Avatar
                  data={item.user}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                {/* //until this is just for resolving image */}


                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3 text-market-on-surface dark:text-white">{item.user?.name || 'Anonymous'}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="text-market-on-surface dark:text-gray-300">{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && (!data.reviews || data.reviews.length === 0) && (
              <h5 className="text-market-on-surface-variant dark:text-gray-400">No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}




            {/* SELLER INFORMATION TAB */}
            {   active === 3 && isAuthenticated ? (
                    <div
                      id={panelIds[3]}
                      role="tabpanel"
                      aria-labelledby={tabIds[3]}
                      tabIndex={0}
                      className="w-full block lg:flex items-start px-2 py-5 gap-6"
                    >

                    <Link to={basePath ? `${basePath}/shops/${data?.shop._id}` : `/shops/${data?.shop._id}`}>
                    <div className="flex-shrink-0"> {/* left side — shop info */}
                        <div className="flex items-center">
                            <Avatar
                                data={data?.shop}
                                className="w-[50px] h-[50px] rounded-full border-2 border-[#2162a1]"
                                alt=""
                            />
                            <div className="pl-3">
                                <h3 className={`${styles.shop_name}`}>
                                    {shop?.name || data?.shop?.name}
                                </h3>
                                <h5 className="pb-2 text-[15px] flex items-center text-market-on-surface dark:text-gray-300">
                            Rating: {Number(shopRating).toFixed(1)} <AiFillStar className="text-yellow-400 ml-1" size={20} />
                                </h5>
                            </div>
                        </div>
                    </div>
                    </Link>

                    

                </div>
                ) : null
                }




        </div>
    )
}

export default ProductDetail
