/**
 * Redux Product Actions
 * Uses centralized API services from /services
 */
import { productService } from "@/services";

// ── Public thunks (guest browsing, limited data) ──────────────────────────

export const getPublicProducts = (options = {}) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });
    // Public endpoint defaults to a 20-item page with no pagination UI — ask
    // for the backend maximum so guest catalogs aren't silently truncated.
    const products = await productService.getPublicAll({ limit: 100, ...options });
    dispatch({ type: "getAllProductsSuccess", payload: products });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getPublicProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "productDetailRequest" });
    const product = await productService.getPublicById(id);
    dispatch({ type: "productDetailSuccess", payload: product });
    return product;
  } catch (error) {
    dispatch({
      type: "productDetailFailed",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// ── Authenticated thunks (full data) ──────────────────────────────────────

//create product action
export const createProduct = (formData) => async (dispatch) => {
    try{
        dispatch({
            type:"productCreateRequest"
        })

        const product = await productService.create(formData)
        
        dispatch({
            type:"productCreateSuccess",
            payload: product
        })

    }
    catch(error){
        dispatch({
            type:"productCreateFailed",
            payload:error.response?.data?.message || error.message
        })
    }

}










// get all products of a single shop
// `options.includeInactive` is for the seller's own inventory screens — the
// backend only honours it for a SELLER/ADMIN token, so it is safe to pass here.
export const getAllProductsShop = (id, options = {}) => async (dispatch) => {
    try{
        dispatch({
            type:"getAllProductsShopRequest"
        })

        const products = await productService.getByShop(id, options)

        dispatch({
            type:"getAllProductsShopSuccess",
            payload: products
        })
    }
    catch(error){
        console.log('getAllProductsShop error:', error.response?.data || error.message || error)
        dispatch({
            type:"getAllProductsShopFailed",
            payload:error.response?.data?.message || error.message,
        })
    }

}






//delete a product of a shop
export const deleteProduct=(id)=> async(dispatch)=>{
    try{
        dispatch({
            type:"deleteProductRequest"
        })

        await productService.delete(id)
        dispatch({
            type:"deleteProductSuccess",
            payload:{
                message:"Product deleted successfully",
                id,
            }
        })
    }
    catch(error){
        dispatch({
            type:"deleteProductFailed",
            payload:error.response?.data?.message || error.message,
        })
        throw error
    }
}


// get all products
// Default to a bounded page: the backend returns the ENTIRE catalogue when
// `limit` is omitted for non-admin callers, which made every 2-minute cache
// refresh materialise the full table.
export const getAllProducts = (options = {}) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsRequest",
        });

        const products = await productService.getAll({ limit: 100, page: 1, ...options });
        dispatch({
            type: "getAllProductsSuccess",
            payload: products,
        });
    } catch (error) {
        dispatch({
            type: "getAllProductsFailed",
            payload: error.response?.data?.message || error.message,
        });
    }
};










// get a single product (public or seller detail)
export const getProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'productDetailRequest' });
    const product = await productService.getById(id);
    dispatch({ type: 'productDetailSuccess', payload: product });
    return product;
  } catch (error) {
    dispatch({ type: 'productDetailFailed', payload: error.response?.data?.message || error.message });
    throw error;
  }
};

// update a product of the seller's own shop
export const updateProduct = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: 'productUpdateRequest' });
    const product = await productService.update(id, formData);
    dispatch({ type: 'productUpdateSuccess', payload: product });
    return product;
  } catch (error) {
    dispatch({ type: 'productUpdateFailed', payload: error.response?.data?.message || error.message });
    throw error;
  }
};

/**
 * Lifecycle transition — the seller's own publish / draft / archive / unarchive.
 * Uses its own action types so it never flips `success` (which the create page
 * watches and would bounce the seller back to the list).
 *
 * Archive is the reversible alternative to Delete: the product leaves the
 * storefront but keeps its row, stock ledger and reviews, and `unarchive`
 * always brings it back as a DRAFT so re-publishing stays deliberate.
 */
export const transitionProduct = (id, action) => async (dispatch) => {
  try {
    dispatch({ type: 'productTransitionRequest' });
    const product = await productService.setLifecycle(id, action);
    dispatch({
      type: 'productTransitionSuccess',
      payload: { product, action },
    });
    return product;
  } catch (error) {
    dispatch({
      type: 'productTransitionFailed',
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};