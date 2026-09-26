/**
 * Redux User Actions — OAuth 2.1 + OIDC. Token-based, no cookies/sessions.
 */
import { authService, addressService, sellerService, shopService } from "@/services";
import { refreshAccessToken, tokenStore } from "@/services/tokenStore";
import { disconnectRealtime } from "@/services/realtime";
import { fetchWishlist } from "./wishlistThunks";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const result = await authService.register(userData);
    dispatch({ type: "LoadUserSuccess", payload: result.user });
    return result;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const result = await authService.login(email, password);
    // login() returns tokens, fetch the user profile
    const user = await authService.getCurrentUser();
    // If seller role, signal capability check is pending so guard waits
    if (user?.role === 'SELLER') {
      dispatch({ type: "LoadSellerRequest" });
    }
    dispatch({ type: "LoadUserSuccess", payload: user });
    // Hydrate this account's wishlist (header badge + heart states).
    dispatch(fetchWishlist());
    // Ensure seller capability is resolved for role-based routing
    await dispatch(loadSeller());
    return { ...result, user };
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const loginSeller = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const result = await authService.login(email, password);
    // login() returns tokens, fetch the user profile to get role
    const user = await authService.getCurrentUser();
    dispatch({ type: "LoadUserSuccess", payload: user });
    dispatch(fetchWishlist());
    return { ...result, user };
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const submitSellerApplication = (applicationData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const application = await sellerService.submitApplication(applicationData);
    // Applying must not replace the authenticated identity with the application
    // document. Keep the buyer account intact; seller capability is granted only
    // after admin approval and is picked up on the next profile refresh.
    const currentUser = getState()?.user?.user;
    dispatch({ type: "LoadUserSuccess", payload: { ...(currentUser || {}), sellerStatus: application?.status || 'PENDING_REVIEW', application } });
    return application;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const updateUserAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const user = await authService.updateAvatar(formData);
    dispatch({ type: "LoadUserSuccess", payload: user });
    return user;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    if (!tokenStore.isAuthenticated()) {
      if (!tokenStore.getRefreshToken()) {
        dispatch({ type: "LoadUserFail", payload: "Not authenticated" });
        return;
      }
      await refreshAccessToken();
    }
    const user = await authService.getCurrentUser();
    dispatch({ type: "LoadUserSuccess", payload: user });
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LogoutRequest" });
    // Stop the realtime socket before credentials go away.
    disconnectRealtime();
    const result = await authService.logout();
    dispatch({ type: "LogoutSuccess", payload: result.message });
    // Also clear seller capability state so account switch works cleanly
    dispatch({ type: "SellerLogoutSuccess" });
    // Drop the wishlist cache so the next account on this browser starts clean.
    // (The wishlist slice also clears its state on LogoutSuccess.)
    localStorage.removeItem("wishlistItems");
    return result;
  } catch (error) {
    // Even if server call fails, clear local state.
    tokenStore.clear();
    dispatch({ type: "LogoutSuccess", payload: "Logged out" });
    dispatch({ type: "SellerLogoutSuccess" });
    localStorage.removeItem("wishlistItems");
    return { message: "Logged out" };
  }
};

export const updatUserAddress =
  (addressData) =>
  async (dispatch) => {
    try {
      dispatch({ type: "updateUserAddressRequest" });
      let address;
      if (addressData._id) {
        address = await addressService.update(addressData._id, addressData);
      } else {
        address = await addressService.add(addressData);
      }
      dispatch({ type: "updateUserAddressSuccess", payload: { updateAddressSuccessMessage: "User address updated successfully!", address } });
    } catch (error) {
      dispatch({ type: "updateUserAddressFailed", payload: error.response?.data?.message || error.message });
    }
  };

export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteUserAddressRequest" });
    await addressService.delete(id);
    dispatch({ type: "deleteUserAddressSuccess", payload: { successMessage: "Address deleted successfully!", addressId: id } });
  } catch (error) {
    dispatch({ type: "deleteUserAddressFailed", payload: error.response?.data?.message || error.message });
  }
};

export const loadSeller = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    // If the user is already loaded in Redux, use it directly (avoids redundant API call).
    const existingUser = getState()?.user?.user;
    if (existingUser) {
      const status = existingUser.sellerStatus || existingUser.application?.status;
      // A suspended business keeps role=SELLER (the one-account model), so the
      // role/shopId checks below must never win over an explicit suspension —
      // otherwise a deactivated seller keeps the whole business dashboard.
      if (String(existingUser.sellerStatus || '').toUpperCase() === 'SUSPENDED') {
        dispatch({ type: "LoadSellerFail", payload: "Your seller account is suspended." });
        return;
      }
      const approved = existingUser.role === "SELLER"
        || Boolean(existingUser.shopId)
        || status === "APPROVED"
        || status === "APPROVED_SELLER";
      if (!approved) {
        dispatch({ type: "LoadSellerFail", payload: "Seller approval is required." });
        return;
      }
      dispatch({ type: "LoadSellerSuccess", payload: existingUser });
      return;
    }

    // Fallback: fetch from API (only works if access token is available)
    if (!tokenStore.isAuthenticated()) {
      dispatch({ type: "LoadSellerFail", payload: "User not authenticated" });
      return;
    }
    const seller = await authService.getCurrentUser();
    const status = seller?.sellerStatus || seller?.application?.status;
    if (String(seller?.sellerStatus || '').toUpperCase() === 'SUSPENDED') {
      dispatch({ type: "LoadSellerFail", payload: "Your seller account is suspended." });
      return;
    }
    const approved = seller?.role === "SELLER"
      || Boolean(seller?.shopId)
      || status === "APPROVED"
      || status === "APPROVED_SELLER";
    if (!approved) {
      dispatch({ type: "LoadSellerFail", payload: "Seller approval is required." });
      return;
    }
    dispatch({ type: "LoadSellerSuccess", payload: seller });
  } catch (error) {
    if (error.response?.status === 404) {
      dispatch({ type: "LoadSellerFail", payload: "No seller shop found. User may not be an approved seller yet." });
    } else if (error.response?.status === 401) {
      dispatch({ type: "LoadSellerFail", payload: "User not authenticated" });
    } else {
      dispatch({ type: "LoadSellerFail", payload: error.response?.data?.message || error.message });
    }
  }
};

export const logoutSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "SellerLogoutRequest" });
    disconnectRealtime();
    const result = await authService.logout();
    dispatch({ type: "SellerLogoutSuccess", payload: result.message });
    return result;
  } catch (error) {
    tokenStore.clear();
    dispatch({ type: "SellerLogoutSuccess", payload: "Logged out" });
    return { message: "Logged out" };
  }
};

export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({ type: "updateUserInfoRequest" });
      const user = await authService.updateProfile({ email, password, phoneNumber, name });
      dispatch({ type: "updateUserInfoSuccess", payload: user });
    } catch (error) {
      dispatch({ type: "updateUserInfoFailed", payload: error.response?.data?.message || error.message });
    }
  };

export const updateShopAvatar = (shopId, formData) => async () => {
  // No local state is written here: the caller refreshes the shop list
  // (`useBusinessShops().refresh()`), which is the single source of truth for
  // shop data. This thunk previously pushed a SHOP into the USER slice.
  return shopService.updateShopAvatar(shopId, formData);
};
