import api from "../../../services/api";




// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await api.get('/user/getuser');
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
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

    const { data } = await api.get('/logout');

    dispatch({
      type: "LogoutSuccess",
      payload: data.message,
    });
    return data;
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

      const { data } = await api.put(
        '/user/update-user-addresses',
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          updateAddressSuccessMessage: "User address updated successfully!",
          user: data.user
        }
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };









// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await api.delete(
      `/user/delete-user-address/${id}`
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};




// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await api.get('/shop/getseller');
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};



// logout seller
export const logoutSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "SellerLogoutRequest",
    });

    const { data } = await api.get('/shop/logout');

    dispatch({
      type: "SellerLogoutSuccess",
      payload: data.message,
    });

    return data;
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

      const { data } = await api.put(
        '/user/update-user-info',
        {
          email,
          password,
          phoneNumber,
          name,
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };







