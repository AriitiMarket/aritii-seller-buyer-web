const initialState = {
    isSeller: false,
    isLoading: true,
};

export const sellerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LoadSellerRequest":
        case "SellerLogoutRequest":
            return {
                ...state,
                isLoading: true,
            };

        case "LoadSellerSuccess":
            return {
                ...state,
                isSeller: true,
                isLoading: false,
                seller: action.payload,
            };

        case "LoadSellerFail":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                isSeller: false,
            };

        case "SellerLogoutSuccess":
        case "RESET_STORE":
        case "RESET_SELLER_STATE":
            return {
                ...state,
                isLoading: false,
                isSeller: false,
                seller: null,
            };

        case "SellerLogoutFail":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        case "clearErrors":
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};