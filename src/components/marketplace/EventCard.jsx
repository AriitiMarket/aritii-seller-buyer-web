import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/styles'
import CountDown from './CountDown'
import { ProductImage } from '../common/ImageWithFallback'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { addTocart } from '../../store/redux/actions/cart'
import { toast } from 'react-toastify'

const EventCard = ({ active, data }) => {

  const dispatch = useDispatch();
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
  

  return (
    <div className={`w-full block border border-brand-border  bg-white rounded-lg lg:flex p-2 ${active ? "unset" : "mb-12"}`}>
      <div className="w-full lg:w-[50%] m-auto flex justify-center items-center">
        <ProductImage
          data={data}
          alt={data?.name || "Event"}
          className="max-h-[300px] max-w-full object-contain"
        />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center p-4">
        <h2 className={`${styles.productTitle}`}>{data?.name || "Event Title"}</h2>
        <p className="text-gray-600 text-[14px] mt-2 line-clamp-4 leading-relaxed">
          {data?.description || "No description available for this event."}
        </p>
        
        <div className="flex py-2 mt-3 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data?.originalPrice ? `${data.originalPrice}$` : ""}
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data?.discountPrice ? `${data.discountPrice}$` : `${data?.price || 0}$`}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data?.sold_out || 0} sold
          </span>
        </div>

        <CountDown data={data} />
        
        <div className="flex items-center gap-4 mt-5">
          <Link to={`/product/${data?.name?.replace(/\s+/g, "-")}?isEvent=true`} className={`${styles.button} text-white !mt-0 !h-10 flex items-center justify-center !rounded`}>
            See Details
          </Link>
          <div className={`${styles.button} text-white bg-black !mt-0 !h-10 flex items-center justify-center !rounded cursor-pointer`} onClick={() => AddToCartHandler(data._id)}>
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard;