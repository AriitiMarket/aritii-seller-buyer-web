import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import api from '../../services/api';
import { toast } from "react-toastify";
import styles from '../../styles/styles';

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); //move to top of the page when component is mounted
  }, []);


  
  const paymentSubmit = () => {
   if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
   } else{
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
   }
  };





  //this is the subtotal price variable which is calculated by multiplying the quantity of each item in the cart by its discounted price and then summing up all the values.
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost  (3% of the subtotal price)
  const shipping = subTotalPrice * 0.03;



  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await api.get(`/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId; //which specific shop this coupon belongs to
      const couponCodeValue = res.data.couponCode?.value; // the discount percentage (e.g. 10 meaning 10% off).
      
      if (res.data.couponCode !== null) {  //if a coupon exists
        
//Check if the coupon is valid for items actually in the cart as  coupons are shop-specific
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

//If no product in the cart has belong to that shop for which coupon code is valid
        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
//This sums up the total price of only the eligible items (the ones from the matching shop)
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };


//if a valid coupon has been applied (couponCodeData exists), use the calculated discountPrice.
  const discountAmount  = couponCodeData ? discountPrice : "";



//This calculates the final checkout total:
// If a coupon is applied: subtotal + shipping - discountAmount
// If no coupon applied: just subtotal + shipping
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountAmount ).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);


  console.log(discountAmount );

  return (
    <div className="w-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <ShippingInfo
              user={user}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              address1={address1}
              setAddress1={setAddress1}
              address2={address2}
              setAddress2={setAddress2}
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>

          {/* Order Summary */}
          <div>
            <CartData
              handleSubmit={handleSubmit}
              totalPrice={totalPrice}
              shipping={shipping}
              subTotalPrice={subTotalPrice}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discountAmount={discountAmount}
            />
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={paymentSubmit}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
          >
            Proceed to Payment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h5 className="text-lg font-bold text-gray-900 mb-6">Shipping Address</h5>
      <form className="space-y-4">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              disabled
            />
          </div>
        </div>

        {/* Phone and Zip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Country and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City/State</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your city</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              placeholder="Apartment, suite, etc."
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setUserInfo(!userInfo)}
          className="text-sm font-semibold text-green-600 hover:text-green-700"
        >
          {userInfo ? "Hide saved addresses" : "Use saved address"}
        </button>
        {userInfo && user?.addresses && user.addresses.length > 0 && (
          <div className="mt-4 space-y-2">
            {user.addresses.map((item, index) => (
              <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="saved-address"
                  className="w-4 h-4 text-green-600"
                  onChange={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">{item.addressType}</p>
                  <p className="text-xs text-gray-600">{item.address1}, {item.city}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountAmount,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Price Breakdown */}
      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-semibold text-gray-900">${Number(subTotalPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm font-semibold text-gray-900">${Number(shipping).toFixed(2)}</span>
        </div>
        {discountAmount && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Discount</span>
            <span className="text-sm font-semibold text-green-600">-${Number(discountAmount).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-green-600">${Number(totalPrice).toFixed(2)}</span>
      </div>

      {/* Coupon Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Have a discount code? Enter it here</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;