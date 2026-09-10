import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../styles/styles';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from '../../services/api';
import { toast } from "react-toastify";
import { clearCart } from "../../store/redux/actions/cart";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);

    console.log(orderData);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await api
    .post('/order/create-order', order)
    .then((res) => {
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCart());
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  cashOnDeliveryHandler,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <div className="w-full border-b pb-5 mb-4">
        <h4 className="text-[18px] font-[600] text-[#000000b1]">
          Cash on Delivery
        </h4>
        <p className="mt-2 text-[15px] text-[#5f5f5f]">
          Pay when your order is delivered to your address.
        </p>
      </div>

      <div>
        <form className="w-full" onSubmit={cashOnDeliveryHandler}>
          <input
            type="submit"
            value="Confirm Order"
            className={`${styles.button} !bg-[#0B6E4F] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
          />
        </form>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">{orderData?.discountPrice? "$" + orderData.discountPrice : "-"}</h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;