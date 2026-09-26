import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllProductsShop } from '@/store/slices/productThunks';

/**
 * useBusinessOrders - business order queue.
 *
 * Scoped to one of the business's shops (multi-shop aware) and kept separate from
 * buyer order state: business pages never read the buyer subset, so a buyer
 * loading flag can never drive a business screen (and vice-versa).
 */
export function useBusinessOrders(shopId, { auto = true } = {}) {
  const dispatch = useDispatch();
  const { ShopOrders = [], isLoading: loading, error } = useSelector(
    (state) => state.order || {}
  );

  useEffect(() => {
    if (!auto || !shopId) return;
    dispatch(getAllOrdersOfShop(shopId));
  }, [auto, shopId, dispatch]);

  const refresh = useCallback(() => {
    if (shopId) dispatch(getAllOrdersOfShop(shopId));
  }, [dispatch, shopId]);

  return { orders: ShopOrders, loading, error, refresh };
}

/**
 * useBusinessProducts - products belonging to the business's shop(s).
 * Backed by `state.products.shopProducts` from the business product thunk.
 */
export function useBusinessProducts(shopId, { auto = true } = {}) {
  const dispatch = useDispatch();
  const { shopProducts = [], isLoading: loading, error } = useSelector(
    (state) => state.products || {}
  );

  useEffect(() => {
    if (!auto || !shopId) return;
    dispatch(getAllProductsShop(shopId));
  }, [auto, shopId, dispatch]);

  const refresh = useCallback(() => {
    if (shopId) dispatch(getAllProductsShop(shopId));
  }, [dispatch, shopId]);

  return { products: shopProducts, loading, error, refresh };
}

export default useBusinessOrders;
