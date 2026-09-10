import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import styles from '../../styles/styles';
import api from '../../services/api';
import { ProductImage } from '../common/ImageWithFallback';
import { Avatar } from '../common/ImageWithFallback';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addTocart } from '../../store/redux/actions/cart';
import { addToWishlist, removeFromWishlist } from '../../store/redux/actions/wishlist';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



// IS MAIN JO HUM DATA RECEIVE KAR RAHE HAIN AS PROP
// WO ACTUALLY PRODUCT DATA HAI JO HUM BACKEND SE LE RAHE HAIN 
// AUR PHIR HUM USSE IS COMPONENT ME PASS KAR RAHE HAIN 
// AUR PHIR HUM USSE CARD FORMAT ME DISPLAY KAR RAHE HAIN


const ProductDetailsCard = ({setOpen, data}) => {
    const [count,setCount]=useState(1)
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(false)
  const [shopInfo, setShopInfo] = useState(null);
    const {cart} =useSelector((state)=>state.cart)
    const dispatch = useDispatch()

    const {wishlist} = useSelector((state)=>state.wishlist)





    //jab user Add to cart button pe click karega to ye function call hoga aur ye product ko cart me add karega
    const AddToCartHandler = async (id) => {
      const isItemExist= cart.find((i)=>i._id===id)  //ye check karega ki ye product already cart me hai ya nahi
      if(isItemExist){
        toast.error("Item Already in cart!")
      }
      else{
        if(data.stock < count){
          toast.error("Product stock limited!")
        }
        else{
          const cartData = { ...data, qty: count };  //cartData me product data aur quantity store kar rahe hain
         await dispatch(addTocart(cartData));
          toast.success("Item added to cart successfully!");
        }
      }
      console.log("Cart state right now:", JSON.parse(localStorage.getItem("cartItems")));
    }





    // Function to handle adding an item to the wishlist
      const addToWishlistHandler = async (data) => {
        setClick(!click);
        await dispatch(addToWishlist(data));
      }
    
      // Function to handle removing an item from the wishlist
      const removeFromWishlistHandler = async (data) => {
        setClick(!click);
        await dispatch(removeFromWishlist(data));
      }
    
    
    
    
    // Jo jo products pehle hee wishlist main added hain to reload k baad b wo added rhen
      useEffect(() => {
        if (wishlist && data && wishlist.find((i) => i && i._id === data._id)) {
          setClick(true);
        } else {
          setClick(false);
        }
      }, [wishlist, data]);

      useEffect(() => {
        const shopId = data?.shop?._id;

        if (!shopId) {
          setShopInfo(null);
          return;
        }

        api
          .get(`/shop/get-shop-info/${shopId}`)
          .then((res) => {
            setShopInfo(res.data.shop);
          })
          .catch((error) => {
            console.error("Error fetching shop info:", error);
          });
      }, [data?.shop?._id]);
    





    const handleMessageSubmit = () => {};




    // THE SHOP DATA WE DISPLAY IN THE QUICK VIEW MODAL
    const shop = shopInfo || data?.shop;
    const shopName = shop?.name || 'Unknown shop';
    const shopId = shop?._id || '';
    const shopRating = shop?.ratings ?? 0;







      const decrementCount = () => {
       if (count > 1) {
       setCount(count - 1);
    }
  };




  const incrementCount = () => {
    setCount(count + 1);
  };


  // Calculate prices based on backend schema: discountPrice is the active current price, originalPrice is the old price
  const activePrice = data?.discountPrice ?? data?.price ?? data?.discount_price ?? 0;
  const originalPrice = data?.originalPrice ?? data?.original_price;
  const soldCount = data?.total_sell ?? data?.sold_out ?? 0;

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />


            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <div className="flex items-center justify-center bg-brand-cream rounded-md p-3">
                  <ProductImage
                    data={data}
                    alt={data.name}
                    className="w-[85%] h-[260px] object-contain"
                  />
                </div>
                <Link to={`/shop/${shopId}`}>
                <div className="flex mt-3">
                    <Avatar
                      data={shop}
                      alt={shopName}
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />


{/* show shop name and rating inside product card */}
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {shopName}
                      </h3>
                      <h5 className="pb-3 text-[15px]">({Number(shopRating).toFixed(1)}) Ratings</h5>
                    </div>

                </div>
                </Link>


{/* MESSAGE BUTTON */}
                <div
                  className={`${styles.button} bg-[#000] mx-8 mt-2 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>

                 <h5 className="text-[16px] text-[red] mx-2 mt-5"> ({soldCount}) Sold out</h5>

                 </div>




               {/* right side */}
            <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {activePrice}$
                  </h4>
                  {originalPrice ? (
                    <h3 className={`${styles.price}`}>
                      {originalPrice}$
                    </h3>
                  ) : null}
                </div>




                {/* increment and decrement buttons */}
                <div className="flex items-center mt-12 justify-between pr-3">
                    <div>
                        <button
                        className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={decrementCount}
                        >
                        -
                        </button>
                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                        {count}
                        </span>
                        <button
                        className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={incrementCount}
                        >
                        +
                        </button>
                    </div>


                
                {/* wishlist wala jo inc/dec buttons k righht side pe heart a */}
                    <div>
                        {click ? (
                        <AiFillHeart
                            size={30}
                            onClick={()=> removeFromWishlistHandler(data)}
                            className="cursor-pointer"
                            color={click ? "red" : "#333"}
                            title="Remove from wishlist"
                        />
                        ) : (
                        <AiOutlineHeart
                            size={30}
                            onClick={()=> addToWishlistHandler(data)}
                            className="cursor-pointer"
                            title="Add to wishlist"
                        />
                        )}
                    </div>

                </div> {/* closes increment and decrement buttons and tthe heart icon as well mean these were two divs and were flex display*/}

                
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => AddToCartHandler(data._id)}
                  >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>



            </div>  {/* ✅ closes right side — was <div/> */}

          </div>  {/* ✅ closes block w-full 800px:flex */}
          </div>  {/* ✅ closes modal white box */}
        </div>    
      ) : null}
    </div>        
  )
}

export default ProductDetailsCard