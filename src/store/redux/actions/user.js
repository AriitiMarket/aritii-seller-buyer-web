/**
 * Redux User Actions — OAuth 2.1 + OIDC. Token-based, no cookies/sessions.
 */
import { authService, addressService, sellerService, shopService } from "../../../services";
import { tokenStore } from "../../../services/tokenStore";

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
    dispatch({ type: "LoadUserSuccess", payload: result.user });
    return result;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const loginSeller = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const result = await authService.login(email, password);
    dispatch({ type: "LoadUserSuccess", payload: result.user });
    return result;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};

export const submitSellerApplication = (applicationData) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const application = await sellerService.submitApplication(applicationData);
    dispatch({ type: "LoadUserSuccess", payload: { ...application, sellerStatus: 'PENDING' } });
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
    // If no access token in memory, user is not authenticated.
    if (!tokenStore.isAuthenticated()) {
      dispatch({ type: "LoadUserFail", payload: "Not authenticated" });
      return;
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
    const result = await authService.logout();
    dispatch({ type: "LogoutSuccess", payload: result.message });
    return result;
  } catch (error) {
    // Even if server call fails, clear local state.
    tokenStore.clear();
    dispatch({ type: "LogoutSuccess", payload: "Logged out" });
    return { message: "Logged out" };
  }
};

export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({ type: "updateUserAddressRequest" });
      const address = await addressService.add({ country, city, address1, address2, zipCode, addressType });
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

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });
    if (!tokenStore.isAuthenticated()) {
      dispatch({ type: "LoadSellerFail", payload: "User not authenticated" });
      return;
    }
    const seller = await authService.getCurrentUser();
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

export const updateShopAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });
    const shop = await shopService.updateShopAvatar(formData);
    dispatch({ type: "LoadUserSuccess", payload: shop });
    return shop;
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
    throw error;
  }
};
