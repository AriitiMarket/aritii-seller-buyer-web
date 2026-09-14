import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/styles';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import ProductDetailsCard from './ProductDetailsCard';
import { ProductImage } from '../common/ImageWithFallback';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../store/redux/actions/wishlist';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { addTocart } from '../../store/redux/actions/cart';
import Ratings from '../common/Ratings';



// THE DATA WE DEAL WITH HERE IS THE REAL PRODUCT DATA LOADED FROM THE
// BACKEND (via redux -> /product/get-all-products) and passed to this
// component as the `data` prop, then displayed in card format.


const ProductCard = ({ data }) => {

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const{wishlist} = useSelector((state)=>state.wishlist)
  const {cart} = useSelector((state)=>state.cart)






  //jab user Add to cart button pe click karega to ye function call hoga aur ye product ko cart me add karega
      const AddToCartHandler = async (id) => {
        const isItemExist= cart.find((i)=>i._id===id)  //ye check karega ki ye product already cart me hai ya nahi
        if(isItemExist){
          toast.error("Item Already in cart!")
        }
        else{
          if(data.stock < 1){
            toast.error("Product stock limited!")
          }
          else{
            const cartData = { ...data, qty: 1 };  //cartData me product data aur quantity store kar rahe hain
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
    toast.success("Item added to wishlist successfully!");
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





  const d = data?.name || '';
  const productId = data?._id || ''; // Use _id for routing to match backend
  const shopName = data?.shop?.name || 'Unknown shop';
  const shopId = data?.shop?._id || '';
  const displayPrice = data?.price ?? data?.discountPrice ?? data?.discount_price ?? 0;
  const soldCount = data?.total_sell ?? data?.sold_out ?? 0;

  return (
    <>

    <div className="w-full h-[370px] bg-white rounded-lg border-2 shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>

        <Link to={`/product/${productId}`}>
          <ProductImage data={data}
          className='w-full h-[170px] object-contain'
          alt={d} />
        </Link>



        {/* Link to the PUBLIC shop page for buyers */}
        <Link to={`/shops/${shopId}`}>
         <h5 className={`${styles.shop_name}`}>
            {shopName}
         </h5> 
        </Link>





        {/* name of the product */}
        <Link to={`/product/${productId}`}>
         <h4 className='pb-3 font-[500]'>
            {d.length > 40 ? d.slice(0, 40) + "..." : d}
         </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />

          </div>





          {/* for showing price */}
          <div className="flex items-center justify-between py-2">
              <div className='flex'>
                <h5 className={`${styles.productDiscountPrice}`}>
                  {`${displayPrice}$`}
                </h5>

              </div>



                {/* shows kitne sold hue hain */}
                <span className="font-[400] text-[17px] text-[#68d284]">
                  {soldCount} sold
                </span>
          </div>

          </Link>






          {/* side wale icons jo teen hain */}
          <div>

{/* If NOT clicked THEN SHOW A HOLLOW HEART SIGN AND AGAR CLICK KR DIYA TO WO RED HO JAE GA , UN K TITLE B US HISAAB SE UPDATE KRLO */}
            {click? (
              <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={async () => await removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title='Remove from wishlist'
              />
            ) : (

              <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5" 
              onClick={async () => await addToWishlistHandler(data)}
              title='Add to wishlist'
              />

            )}



              <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)} // isse hum open state ko toggle kar rahe hain jab bhi user eye icon pe click karega to open state true ya false ho jayega
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={23}
            className="cursor-pointer absolute right-2 top-24"
            color="#444"
            onClick={() => AddToCartHandler(data._id)}
            title="Add to cart"
          />


            {/* agar open true hoga (tb hoga jb hum eye walee icon pe click kren ge)  to productDetailsCard  dikha do */}
            
            {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}   {/* setOpen is passed as a prop to ProductDetailsCard so that the child component can close itself.  we r also passing data as a prop so it can use it*/}



          </div>

        


    </div>
    
    </>
  )
}

export default ProductCard