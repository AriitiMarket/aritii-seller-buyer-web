/**
 * Auth slice surface (target structure: `features/auth/authSlice.js`).
 *
 * The reducer itself is composed into the store from `@/store/slices/userSlice`
 * so that `src/store/index.js` stays the single store composition root. This
 * module is the auth feature's public state API — import auth state/actions from
 * here inside the auth feature and from `@/store/slices/*` in the store.
 */
export { userReducer } from '@/store/slices/userSlice';
export {
  registerUser,
  loginUser,
  loginSeller,
  loadUser,
  logoutUser,
  loadSeller,
  logoutSeller,
  submitSellerApplication,
  updateUserInformation,
  updatUserAddress,
  deleteUserAddress,
  updateUserAvatar,
  updateShopAvatar,
} from '@/store/slices/userThunks';

/* Selectors — the canonical way components read auth state. */
export const selectAuth = (state) => state.user;

export const selectIsAuthenticated = (state) => Boolean(state.user?.isAuthenticated);
export const selectAuthLoading = (state) => state.user?.loading !== false;
export const selectCurrentUser = (state) => state.user?.user;
export const selectAuthError = (state) => state.user?.error;
export const selectUserAddresses = (state) => state.user?.user?.addresses || [];
export const selectIsSeller = (state) => Boolean(state.seller?.isSeller);
export const selectSeller = (state) => state.seller?.seller;
export const selectSellerLoading = (state) => Boolean(state.seller?.isLoading);