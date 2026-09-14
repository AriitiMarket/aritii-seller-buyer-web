import { productService } from '../../../services';

/**
 * Add to cart with backend validation
 * Validates product availability and stock before adding
 */
export const addTocart = (data) => async (dispatch, getState) => {
  try {
    // Set loading state
    dispatch({
      type: "setCartLoading",
      payload: true,
    });

    // Fetch fresh product data from backend to validate stock
    try {
      const product = await productService.getById(data._id);
      
      // Check if product is still available
      if (!product) {
        dispatch({
          type: "setCartError",
          payload: "Product is no longer available",
        });
        dispatch({
          type: "setCartLoading",
          payload: false,
        });
        return null;
      }

      // Validate requested quantity against available stock
      if (data.qty > product.stock) {
        dispatch({
          type: "setCartError",
          payload: `Only ${product.stock} items available in stock`,
        });
        dispatch({
          type: "setCartLoading",
          payload: false,
        });
        return null;
      }

      // Check if out of stock
      if (product.stock <= 0) {
        dispatch({
          type: "setCartError",
          payload: "This product is out of stock",
        });
        dispatch({
          type: "setCartLoading",
          payload: false,
        });
        return null;
      }
    } catch (error) {
      console.log("Error fetching product for validation:", error);
      // Continue with add to cart even if validation fails, but log it
    }

    // Add to cart with validated data
    dispatch({
      type: "addToCart",
      payload: data,
    });

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    
    // Clear error and loading states
    dispatch({
      type: "setCartError",
      payload: null,
    });
    dispatch({
      type: "setCartLoading",
      payload: false,
    });

    return data;
  } catch (error) {
    console.log("addTocart error:", error);
    dispatch({
      type: "setCartError",
      payload: error.message || "Failed to add item to cart",
    });
    dispatch({
      type: "setCartLoading",
      payload: false,
    });
    return null;
  }
};

/**
 * Update cart quantity with backend validation
 * Ensures requested quantity doesn't exceed stock
 */
export const updateCartQuantity = (productId, newQuantity) => async (dispatch, getState) => {
  try {
    dispatch({
      type: "setCartLoading",
      payload: true,
    });

    const state = getState();
    const cartItem = state.cart.cart.find(item => item._id === productId);

    if (!cartItem) {
      dispatch({
        type: "setCartError",
        payload: "Item not found in cart",
      });
      dispatch({
        type: "setCartLoading",
        payload: false,
      });
      return null;
    }

    // Fetch fresh product data to validate new quantity
    const product = await productService.getById(productId);

    if (!product || product.stock <= 0) {
      dispatch({
        type: "setCartError",
        payload: "Product is no longer available",
      });
      dispatch({
        type: "setCartLoading",
        payload: false,
      });
      return null;
    }

    if (newQuantity > product.stock) {
      dispatch({
        type: "setCartError",
        payload: `Only ${product.stock} items available in stock`,
      });
      dispatch({
        type: "setCartLoading",
        payload: false,
      });
      return null;
    }

    if (newQuantity <= 0) {
      dispatch({
        type: "setCartError",
        payload: "Quantity must be at least 1",
      });
      dispatch({
        type: "setCartLoading",
        payload: false,
      });
      return null;
    }

    // Update quantity
    dispatch({
      type: "updateQuantity",
      payload: { productId, qty: newQuantity },
    });

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    
    dispatch({
      type: "setCartError",
      payload: null,
    });
    dispatch({
      type: "setCartLoading",
      payload: false,
    });

    return { productId, qty: newQuantity };
  } catch (error) {
    console.log("updateCartQuantity error:", error);
    dispatch({
      type: "setCartError",
      payload: error.message || "Failed to update quantity",
    });
    dispatch({
      type: "setCartLoading",
      payload: false,
    });
    return null;
  }
};

/**
 * Remove from cart
 */
export const removeFromCart = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: "removeFromCart",
      payload: data._id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    dispatch({
      type: "setCartError",
      payload: null,
    });
    return data;
  } catch (error) {
    console.log("removeFromCart error:", error);
    dispatch({
      type: "setCartError",
      payload: error.message || "Failed to remove item",
    });
    return null;
  }
};

/**
 * Clear cart
 */
export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: "clearCart" });
    localStorage.setItem("cartItems", JSON.stringify([]));
    dispatch({
      type: "setCartError",
      payload: null,
    });
  } catch (error) {
    console.log("clearCart error:", error);
    dispatch({
      type: "setCartError",
      payload: error.message || "Failed to clear cart",
    });
  }
};

/**
 * Validate entire cart against current product availability
 * Returns validation result with any out-of-stock or unavailable items
 */
export const validateCart = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: "setCartLoading",
      payload: true,
    });

    const state = getState();
    const { cart } = state.cart;
    const invalidItems = [];
    const updatedCart = [];

    // Validate each item in cart
    for (const item of cart) {
      try {
        const product = await productService.getById(item._id);
        
        if (!product || product.stock <= 0) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: "Product is no longer available",
          });
        } else if (item.qty > product.stock) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: `Only ${product.stock} items available (you have ${item.qty})`,
          });
          // Keep in cart but with reduced quantity
          updatedCart.push({ ...item, qty: Math.min(item.qty, product.stock) });
        } else {
          // Item is valid
          updatedCart.push(item);
        }
      } catch (error) {
        console.log(`Error validating product ${item._id}:`, error);
        // Keep in cart if validation fails (allow user to proceed)
        updatedCart.push(item);
      }
    }

    // Update cart with validated items
    if (invalidItems.length > 0) {
      dispatch({
        type: "setCart",
        payload: updatedCart,
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }

    dispatch({
      type: "setCartLoading",
      payload: false,
    });

    return {
      isValid: invalidItems.length === 0,
      invalidItems,
      validCart: updatedCart,
    };
  } catch (error) {
    console.log("validateCart error:", error);
    dispatch({
      type: "setCartError",
      payload: error.message || "Failed to validate cart",
    });
    dispatch({
      type: "setCartLoading",
      payload: false,
    });
    return {
      isValid: false,
      invalidItems: [],
      validCart: getState().cart.cart,
    };
  }
};