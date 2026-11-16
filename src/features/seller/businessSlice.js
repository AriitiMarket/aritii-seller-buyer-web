/**
 * Business / Seller Slice Surface (features/seller/businessSlice.js)
 *
 * Domain-scoped Redux state API for the merchant workspace,
 * seller store metrics, and store orders queue.
 */
export { sellerReducer } from '@/store/slices/sellerSlice';
export { loadSeller, logoutSeller } from '@/store/slices/userThunks';

/* Canonical Selectors for Seller Central State */
export const selectSeller = (state) => state.seller?.seller;
export const selectIsSeller = (state) => Boolean(state.seller?.isSeller);
export const selectSellerLoading = (state) => Boolean(state.seller?.isLoading);
export const selectSellerError = (state) => state.seller?.error;

export const selectSellerOrders = (state) => state.order?.ShopOrders || [];
export const selectSellerOrdersLoading = (state) =>
  Boolean(state.order?.sellerOrdersLoading || state.order?.isLoading);
export const selectSellerOrdersError = (state) => state.order?.error;
