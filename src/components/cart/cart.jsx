import React, { useState, useEffect } from 'react'
import { RxCross1 } from "react-icons/rx";
import styles from '../../styles/styles';
import { IoBagHandleOutline } from "react-icons/io5";
import { HiPlus , HiOutlineMinus} from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../../store/redux/actions/cart';
import { addTocart } from '../../store/redux/actions/cart';
import { ProductImage } from '../common/ImageWithFallback';
import { EmptyCart } from '../../assets';
import { toast } from 'react-toastify';

const Cart = ({setOpenCart}) => {
    const { cart, isLoading, error } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    // Show error if any
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const removefromCartHandler = (data) => {
        dispatch(removeFromCart(data));
    }

    const totalPriceOfALLCart= (cart.reduce((acc, item) => acc + item.discountPrice * item.qty, 0)).toFixed(2);

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-[100]">
            <div className="fixed top-0 right-0 h-full w-[50%] sm:w-[45%] 800px:w-[35%] 1100px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
                <div>
                    <div className="flex w-full justify-START pt-5 pr-5">
                        <RxCross1 
                            className="fixed right-4 top-2 cursor-pointer"
                            size={25}
                            onClick={() => setOpenCart(false)}
                        />   

                        {/* ITEMS LENGTH */}
                        <div className={`${styles.noramlFlex} p-4`}>
                            <IoBagHandleOutline size={25} />
                            <h5 className="text-[20px] font-[500]">
                                {cart && cart.length} items
                            </h5>
                        </div>
                    </div>  

                    {/* CART SINGLE ITEM */}
                    <br />
                    <div className="w-full border-t">
                        {cart && cart.map((i, index) => (
                            <CartSingle                               
                                key={index}
                                data={i}
                                onRemove={removefromCartHandler}
                            />
                        ))}
                    </div>
                </div>

                {
                    (cart && cart.length == 0) ? (
                        <div className="text-center w-full flex flex-col items-center justify-center px-6">
                            <img
                                src={EmptyCart}
                                alt="Empty cart"
                                className="w-[220px] h-auto object-contain mb-2"
                                loading="lazy"
                            />
                            <p className="font-medium text-brand-muted mt-2">
                                No items in your cart yet
                            </p>
                            <p className="text-sm text-brand-muted/70">
                                Add something you love to get started
                            </p>
                        </div>
                    ) : (
                        <div className="px-3 sm:px-5 mb-3">
                            {/* checkout buttons */}
                            <Link to="/checkout" onClick={() => setOpenCart(false)}>
                                <div
                                    className={`h-12 sm:h-[45px] flex items-center justify-center w-[100%] bg-brand-primary rounded-[5px] hover:bg-opacity-90 transition ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <h1 className="text-[#fff] text-sm sm:text-base font-[600]">
                                        {isLoading ? 'Processing...' : `Checkout (${totalPriceOfALLCart})`}
                                    </h1>
                                </div>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const CartSingle = ({data, onRemove}) => {
    const [value, setValue] = useState(data.qty || 1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [maxStock, setMaxStock] = useState(data.stock || 1);
    const dispatch = useDispatch();
    const totalPrice = data.discountPrice * value;

    const handleRemove = () => {
        onRemove(data);
    }

    const increment = async () => {
        if (value >= maxStock) {
            toast.error(`Maximum ${maxStock} items available in stock`);
            return;
        }
        
        const newQty = value + 1;
        setIsUpdating(true);
        
        const result = await dispatch(updateCartQuantity(data._id, newQty));
        
        if (result) {
            setValue(newQty);
        }
        setIsUpdating(false);
    }

    const decrement = async () => {
        if (value <= 1) return;
        
        const newQty = value - 1;
        setIsUpdating(true);
        
        const result = await dispatch(updateCartQuantity(data._id, newQty));
        
        if (result) {
            setValue(newQty);
        }
        setIsUpdating(false);
    }

    return(
        <div className="border-b p-3 sm:p-4">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">

                {/* Product Image - Responsive sizing */}
                <ProductImage
                    data={data}
                    alt={data.name}
                    className="w-20 h-24 sm:w-28 sm:h-32 object-contain rounded-[5px] flex-shrink-0"
                />

                {/* Product Info - Stack on mobile */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-sm sm:text-base font-medium truncate">{data.name}</h1>
                    <h4 className="font-[400] text-xs sm:text-sm text-[#00000082] mt-1">
                        ${data.discountPrice} × {value}
                    </h4>
                    <h4 className="font-[600] text-sm sm:text-base pt-1 text-brand-secondary font-Roboto">
                        US${totalPrice.toFixed(2)}
                    </h4>
                    {/* Stock indicator */}
                    {data.stock !== undefined && (
                        <p className={`text-xs pt-1 font-medium ${
                            data.stock <= 0 ? 'text-red-600' : 
                            data.stock <= 5 ? 'text-orange-600' : 
                            'text-green-600'
                        }`}>
                            {data.stock <= 0 ? '❌ Out of stock' : `✓ ${data.stock} in stock`}
                        </p>
                    )}
                </div>

                {/* Quantity Controls - Responsive layout */}
                {data.stock > 0 ? (
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0"> 
                        <button
                            type="button"
                            className={`bg-brand-primary border border-brand-primary rounded-full w-7 h-7 sm:w-8 sm:h-8 ${styles.noramlFlex} justify-center cursor-pointer hover:opacity-90 transition min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={increment}
                            disabled={isUpdating || value >= maxStock}
                            aria-label="Increase quantity"
                        > 
                            <HiPlus size={16} color="#fff" />
                        </button>

                        <span className="text-sm sm:text-base font-medium w-6 text-center">
                            {value}
                        </span>

                        <button
                            type="button"
                            className="bg-[#a7abb14f] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer hover:bg-[#a7abb130] transition min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={decrement}
                            disabled={isUpdating || value <= 1}
                            aria-label="Decrease quantity"
                        >
                            <HiOutlineMinus size={16} color="#7d879c" />
                        </button>
                    </div>
                ) : (
                    <div className="text-red-600 text-xs font-semibold flex-shrink-0">
                        Out of Stock
                    </div>
                )}

                {/* Remove Button */}
                <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition p-1 min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
                    onClick={handleRemove}
                    disabled={isUpdating}
                    aria-label="Remove from cart"
                >
                    <RxCross1 size={20} />
                </button>

            </div>
        </div>
    )
}

export default Cart
