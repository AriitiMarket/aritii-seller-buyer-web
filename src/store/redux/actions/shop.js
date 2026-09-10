import api from "../../../services/api";

// Fetch every shop for the marketplace "Featured Sellers" feed.
// Source: Commerce Service -> GET /shop/get-all-shops (routed via API Gateway)
export const getAllShops = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllShopsRequest" });
    const { data } = await api.get("/shop/get-all-shops");
    dispatch({ type: "getAllShopsSuccess", payload: data.shops || [] });
  } catch (error) {
    dispatch({
      type: "getAllShopsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Fetch all marketplace categories.
// Source: Commerce Service -> GET /category (routed via API Gateway)
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllCategoriesRequest" });
    const { data } = await api.get("/category");
    dispatch({ type: "getAllCategoriesSuccess", payload: data.categories || [] });
  } catch (error) {
    dispatch({
      type: "getAllCategoriesFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};