/**
 * Redux Product Actions
 * Uses centralized API services from /services
 */
import { productService } from "../../../services";

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
export const getAllProductsShop = (id) => async (dispatch) => {
    try{
        dispatch({
            type:"getAllProductsShopRequest"
        })

        const products = await productService.getByShop(id)
        console.log('getAllProductsShop response:', products)
        
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
export const getAllProducts = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsRequest",
        });

        const products = await productService.getAll();
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