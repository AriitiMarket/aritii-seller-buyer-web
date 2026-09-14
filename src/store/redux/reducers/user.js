const initialState = {
    isAuthenticated: false,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LoadUserRequest":
            return {
                ...state,
                loading: true,
            };

        case "LoadUserSuccess":
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
            };

        case "LoadUserFail":
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuthenticated: false,
            };

        case "LogoutRequest":
            return {
                ...state,
                loading: true,
            };

        case "LogoutSuccess":
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
            };

        case "LogoutFail":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };







        // update user information
        case "updateUserInfoRequest":
            return {
                ...state,
                updateUserInfoLoading: true,
            };

        case "updateUserInfoSuccess":
            return {
                ...state,
                updateUserInfoLoading: false,
                user: action.payload,
                success: true,
            };

        case "updateUserInfoFailed":
            return {
                ...state,
                updateUserInfoLoading: false,
                error: action.payload,
            };







        //update user address
        case "updateUserAddressRequest":
            return {
                ...state,
                updateUserAddressLoading: true,
                addressError: null,
            };

        case "updateUserAddressSuccess":
            return {
                ...state,
                updateUserAddressLoading: false,
                user: {
                    ...state.user,
                    addresses: [
                        ...(state.user?.addresses || []),
                        action.payload.address
                    ]
                },
                addressSuccessMessage: action.payload.updateAddressSuccessMessage,
                success: true,
            };

        case "updateUserAddressFailed":
            return {
                ...state,
                updateUserAddressLoading: false,
                addressError: action.payload,
            };









        //delete user address
        case "deleteUserAddressRequest":
            return {
                ...state,
                deleteUserAddressLoading: true,
                addressError: null,
            };

        case "deleteUserAddressSuccess":
            return {
                ...state,
                deleteUserAddressLoading: false,
                user: {
                    ...state.user,
                    addresses: (state.user?.addresses || []).filter(
                        addr => addr._id !== action.payload.addressId
                    )
                },
                addressSuccessMessage: action.payload.successMessage,
                success: true,
            };

        case "deleteUserAddressFailed":
            return{
                ...state,
                deleteUserAddressLoading: false,
                addressError: action.payload,
            }
        

        case "clearErrors":
            return {
                ...state,
                error: null,
                success: false,
            };

        default:
            return state;
    }
};