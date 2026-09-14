/**
 * Redux User Actions
 * Uses centralized API services from /services
 */
import { authService, addressService, sellerService, shopService } from "../../../services";

/**
 * Register a new user account
 * @param {Object} userData - { name, email, password }
 */
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const user = await authService.register(userData);
    dispatch({
      type: "LoadUserSuccess",
      payload: user,
    });
    return user;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const user = await authService.login(email, password);
    dispatch({
      type: "LoadUserSuccess",
      payload: user,
    });
    return user;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/**
 * Login seller with email and password
 * @param {string} email - Seller email
 * @param {string} password - Seller password
 */
export const loginSeller = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const user = await authService.login(email, password);
    dispatch({
      type: "LoadUserSuccess",
      payload: user,
    });
    return user;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/**
 * Submit seller application to become a seller
 * @param {Object} applicationData - { name, description, category, businessType }
 */
export const submitSellerApplication = (applicationData) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const application = await sellerService.submitApplication(applicationData);
    dispatch({
      type: "LoadUserSuccess",
      payload: { ...application, sellerStatus: 'PENDING' },
    });
    return application;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

/**
 * Update user avatar
 * @param {FormData} formData - FormData with 'image' field
 */
export const updateUserAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const user = await authService.updateAvatar(formData);
    dispatch({
      type: "LoadUserSuccess",
      payload: user,
    });
    return user;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const user = await authService.getCurrentUser();
    dispatch({
      type: "LoadUserSuccess",
      payload: user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// logout user
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LogoutRequest" });
    const result = await authService.logout();
    dispatch({
      type: "LogoutSuccess",
      payload: result.message,
    });
    return result;
  } catch (error) {
    dispatch({
      type: "LogoutFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};









// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const address = await addressService.add({
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
      });

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          updateAddressSuccessMessage: "User address updated successfully!",
          address: address
        }
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response?.data?.message || error.message,
      });
    }
  };









// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    await addressService.delete(id);

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted successfully!",
        addressId: id,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};




// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const seller = await authService.getCurrentUser();
    console.log('[loadSeller] Success:', seller);
    dispatch({
      type: "LoadSellerSuccess",
      payload: seller,
    });
  } catch (error) {
    // Don't spam console with 404 errors - it's expected for non-sellers
    if (error.response?.status !== 404) {
      console.log('[loadSeller] Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Silently fail if seller shop not found (404) - user may not be a seller yet
    // Only dispatch error for actual connection problems
    if (error.response?.status === 404) {
      dispatch({
        type: "LoadSellerFail",
        payload: "No seller shop found. User may not be an approved seller yet.",
      });
    } else if (error.response?.status === 401) {
      // Not authenticated - this is expected for non-sellers
      dispatch({
        type: "LoadSellerFail",
        payload: "User not authenticated",
      });
    } else {
      dispatch({
        type: "LoadSellerFail",
        payload: error.response?.data?.message || error.message,
      });
    }
  }
};



// logout seller
export const logoutSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "SellerLogoutRequest",
    });

    const result = await authService.logout();

    dispatch({
      type: "SellerLogoutSuccess",
      payload: result.message,
    });

    return result;
  } catch (error) {
    dispatch({
      type: "SellerLogoutFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};





// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const user = await authService.updateProfile({
        email,
        password,
        phoneNumber,
        name,
      });

      dispatch({
        type: "updateUserInfoSuccess",
        payload: user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response?.data?.message || error.message,
      });
    }
  };









/**
 * Update shop avatar
 * @param {FormData} formData - FormData with 'image' field
 */
export const updateShopAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const shop = await shopService.updateShopAvatar(formData);
    dispatch({
      type: "LoadUserSuccess",
      payload: shop,
    });
    return shop;
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
