import { shopService, catalogService } from "@/services";

// ── Public thunks (guest browsing, limited data) ──────────────────────────

export const getPublicShops = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllShopsRequest" });
    const shops = await shopService.getPublicAll();
    dispatch({ type: "getAllShopsSuccess", payload: shops || [] });
  } catch (error) {
    dispatch({
      type: "getAllShopsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getPublicShopById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "shopDetailRequest" });
    const shop = await shopService.getPublicById(id);
    dispatch({ type: "shopDetailSuccess", payload: shop });
    return shop;
  } catch (error) {
    dispatch({
      type: "shopDetailFailed",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ── Authenticated thunks (full data) ──────────────────────────────────────

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
 * Fetch marketplace categories for ONE type.
 * Results are cached per type in `state.shop.categoriesByType` so the product
 * list and the shop list can each keep their own category navigation.
 * @param {string} type - 'product' | 'business' | 'shop' | 'event'
 */
export const getAllCategories = (type = "product") => async (dispatch) => {
  try {
    dispatch({ type: "getAllCategoriesRequest", payload: type });
    const categories = await catalogService.getCategoriesByType(type);
    dispatch({
      type: "getAllCategoriesSuccess",
      payload: { type, categories: categories || [] },
    });
  } catch (error) {
    dispatch({
      type: "getAllCategoriesFailed",
      payload: {
        type,
        error: error.response?.data?.message || error.message,
      },
    });
  }
};