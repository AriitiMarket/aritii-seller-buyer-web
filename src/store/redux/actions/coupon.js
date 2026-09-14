import { catalogService } from "../../../services";

/**
 * Get all coupons for a seller
 * @param {string} sellerId - Seller ID
 */
export const getSellerCoupons = (sellerId) => async (dispatch) => {
  try {
    dispatch({ type: "getSellerCouponsRequest" });
    const coupons = await catalogService.getSellerCoupons(sellerId);
    dispatch({ type: "getSellerCouponsSuccess", payload: coupons });
  } catch (error) {
    dispatch({
      type: "getSellerCouponsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Create a new coupon
 * @param {Object} couponData - Coupon details
 */
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: "createCouponRequest" });
    const coupon = await catalogService.createCoupon(couponData);
    dispatch({ type: "createCouponSuccess", payload: coupon });
    return coupon;
  } catch (error) {
    dispatch({
      type: "createCouponFailed",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/**
 * Delete a coupon
 * @param {string} couponId - Coupon ID
 */
export const deleteCoupon = (couponId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteCouponRequest" });
    const message = await catalogService.deleteCoupon(couponId);
    dispatch({ type: "deleteCouponSuccess", payload: couponId });
    return message;
  } catch (error) {
    dispatch({
      type: "deleteCouponFailed",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
