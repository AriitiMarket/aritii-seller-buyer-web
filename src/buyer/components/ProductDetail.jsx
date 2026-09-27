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
    <div className="bg-white dark:bg-gray-900">
      {data ? (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

              {/* LEFT SIDE — images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={images[select] || PlaceholderProduct}
                    alt={data.name || 'Product image'}
                    className="w-full h-full object-contain p-8"
                  />
                </div>

                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <div 
                        key={index} 
                        className={`flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          select === index 
                            ? 'border-[#75d04b] ring-2 ring-[#75d04b]/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelect(index)}
                      >
                        <img
                          src={img}
                          alt={`${data.name || 'Product'} image ${index + 1}`}
                          className="h-20 w-20 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE — product info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {data.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Ratings rating={data?.ratings} />
                    {data?.reviews?.length > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({data.reviews.length} reviews)
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <h4 className="text-3xl font-bold text-[#75d04b]">
                    {activePrice} ETB
                  </h4>
                  {originalPrice && originalPrice > activePrice ? (
                    <h3 className="text-xl text-gray-400 line-through">
                      {originalPrice} ETB
                    </h3>
                  ) : null}
                  {originalPrice && originalPrice > activePrice && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                      {Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Stock Status — mirrors backend `available`; out-of-stock rows
                    are already filtered from public lists by the API. */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    availableUnits > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${availableUnits > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {availableUnits > 0 ? `${availableUnits} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.description}
                </p>

                <DeliveryAvailability shopId={data?.shopId} productId={data?._id} />

                {isAuthenticated ? (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-[#f3ffee] dark:hover:bg-gray-800 transition-colors flex items-center justify-center text-lg"
                          onClick={decrementCount}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold px-6 py-3 rounded-xl min-w-[60px] text-center">
                          {count}
                        </span>
                        <button
                          className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-[#f3ffee] dark:hover:bg-gray-800 transition-colors flex items-center justify-center text-lg"
                          onClick={incrementCount}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={click ? () => removeFromWishlistHandler(data) : () => addToWishlistHandler(data)}
                        aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {click ? (
                          <AiFillHeart size={24} className="text-red-500" />
                        ) : (
                          <AiOutlineHeart size={24} className="text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>

                    {/* Add to Cart Button — disabled when backend available ≤ 0 */}
                    <button
                      disabled={availableUnits < 1}
                      className={`w-full h-14 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg ${
                        availableUnits < 1
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#75d04b] hover:bg-[#5ac12f] text-white hover:shadow-xl'
                      }`}
                      onClick={() => AddToCartHandler(data._id)}
                      aria-label={availableUnits < 1 ? 'Product is out of stock' : 'Add to cart'}
                    >
                      <AiOutlineShoppingCart size={22} />
                      {availableUnits < 1 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    {/* Shop Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <Link to={shopPath}>
                          <Avatar
                            data={shop}
                            alt={shop?.name || 'Shop avatar'}
                            className="w-14 h-14 rounded-full border-2 border-[#75d04b]"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link to={shopPath}>
                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-[#75d04b] transition-colors">
                              {shop?.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            <AiFillStar className="text-yellow-400" size={16} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Number(shopRating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <button
                          className="px-4 py-2 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-medium rounded-lg transition-colors text-sm"
                          onClick={handleRequestProduct}
                          aria-label="Request this product from the seller"
                        >
                          Request Product
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Guest CTA */
                  <div className="space-y-4 pt-4">
                    <Link
                      to="/sign-up"
                      className="block w-full h-14 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl"
                    >
                      Sign Up to Buy
                    </Link>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Already have an account?{' '}
                      <Link to="/login" className="text-[#75d04b] hover:underline font-medium">Login</Link>
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          <ProductDetailInfo data={data} shop={shop} />
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

        <div className="bg-gray-50 dark:bg-gray-800 px-3 lg:px-10 py-8 rounded-md">
            <div
              className="w-full flex justify-between border-b border-gray-200 dark:border-gray-700 pt-10 pb-2"
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
                        `text-gray-900 dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 1 ? 'text-[#75d04b]' : ''}`
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
                        `text-gray-900 dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 2 ? 'text-[#75d04b]' : ''}`
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
                        `text-gray-900 dark:text-white text-[18px] px-1 leading-5 font-[600] cursor-pointer lg:text-[20px] ${active === 3 ? 'text-[#75d04b]' : ''}`
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
                    <p className="py-2 text-[18px] leading-8 pb-10 pt-5 whitespace-pre-line text-gray-700 dark:text-gray-300">
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
                    <h1 className="font-[500] mr-3 text-gray-900 dark:text-white">{item.user?.name || 'Anonymous'}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && (!data.reviews || data.reviews.length === 0) && (
              <h5 className="text-gray-500 dark:text-gray-400">No Reviews have for this product!</h5>
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
                                className="w-[50px] h-[50px] rounded-full border-2 border-[#75d04b]"
                                alt=""
                            />
                            <div className="pl-3">
                                <h3 className={`${styles.shop_name}`}>
                                    {shop?.name || data?.shop?.name}
                                </h3>
                                <h5 className="pb-2 text-[15px] flex items-center text-gray-700 dark:text-gray-300">
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