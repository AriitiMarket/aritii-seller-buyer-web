/**
 * Redux Order Actions
 * Uses centralized API services from /services
 */
import { orderService } from "../../../services";

//get all orders of a user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest"
    })

    const orders = await orderService.getBuyerOrders(userId);
    
    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: orders
    })
  }
  catch (err) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: err.response?.data?.message || err.message
    })
  }
}

//get all orders of a shop
export const getAllOrdersOfShop = (sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest"
    })

    const orders = await orderService.getSellerOrders(sellerId);
    
    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: orders
    })
  }
  catch (err) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: err.response?.data?.message || err.message
    })
  }
}

//cancel an order (buyer)
export const cancelOrder = (orderId, reason) => async (dispatch) => {
  try {
    dispatch({
      type: "cancelOrderRequest"
    })

    const order = await orderService.cancelOrder(orderId, reason);
    
    dispatch({
      type: "cancelOrderSuccess",
      payload: order
    })
  }
  catch (err) {
    dispatch({
      type: "cancelOrderFailed",
      payload: err.response?.data?.message || err.message
    })
  }
}
