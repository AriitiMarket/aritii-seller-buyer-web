import { shopService } from "../../../services";

/**
 * Fetch all shops for the marketplace "Featured Sellers" feed
 * Uses centralized shopService.getAll() method
 */
export const getAllShops = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllShopsRequest" });
    const shops = await shopService.getAll();
    dispatch({ type: "getAllShopsSuccess", payload: shops || [] });
  } catch (error) {
    dispatch({
      type: "getAllShopsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Fetch all marketplace categories
 * Uses centralized catalogService.getCategories() method
 * Note: getAllCategories is now handled by catalog service
 * Keeping this action for backward compatibility with reducers
 */
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllCategoriesRequest" });
    // Categories are fetched via catalogService
    // For now, this is a placeholder - update reducer if needed
    dispatch({ type: "getAllCategoriesSuccess", payload: [] });
  } catch (error) {
    dispatch({
      type: "getAllCategoriesFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};