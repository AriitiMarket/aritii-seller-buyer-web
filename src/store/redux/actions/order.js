import api from "../../../services/api";






//get all orders of a user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
try{

    dispatch({
        type: "getAllOrdersUserRequest"
    })

    const { data } = await api.get(`/order/get-all-orders/user/${userId}`);
    
    dispatch({
        type:"getAllOrdersUserSuccess",
        payload:data.orders
    })
}
catch(err){
    dispatch({
        type:"getAllOrdersUserFailed",
        payload:err.response.data.message
    })
}

}








//get all orders of a shop
export const getAllOrdersOfShop = (sellerId) => async (dispatch) => {
try{

    dispatch({
        type: "getAllOrdersShopRequest"
    })

    const { data } = await api.get(`/order/get-all-orders/seller/${sellerId}`);
    
    dispatch({
        type:"getAllOrdersShopSuccess",
        payload:data.orders
    })
}
catch(err){
    dispatch({
        type:"getAllOrdersShopFailed",
        payload:err.response.data.message
    })
}

}