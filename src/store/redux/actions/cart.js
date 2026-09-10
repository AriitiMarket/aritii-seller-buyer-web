// add to cart
export const addTocart = (data) => async (dispatch, getState) => {

  try{

    dispatch({
      type: "addToCart",
      payload: data,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
}
catch (error) {
    console.log("addTocart error:", error);
  }
};



// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {

  try{
    dispatch({
      type: "removeFromCart",
      payload: data._id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
  }
catch (error) {
    console.log("removeFromCart error:", error);
  }
};

// clear cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: "clearCart" });
    localStorage.setItem("cartItems", JSON.stringify([]));
  } catch (error) {
    console.log("clearCart error:", error);
  }
};