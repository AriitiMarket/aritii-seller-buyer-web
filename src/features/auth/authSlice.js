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
  verify2FALogin,
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
export const selectIsSeller = (state) => {
  if (state.seller?.isSeller) return true;
  const user = state.user?.user;
  if (!user) return false;
  const caps = (Array.isArray(user.capabilities) ? user.capabilities : []).map((c) => String(c).toUpperCase());
  const roles = (Array.isArray(user.roles) ? user.roles : []).map((r) => String(r).toUpperCase());
  return (
    user.role === 'SELLER' ||
    user.activeRole === 'SELLER' ||
    caps.includes('SELLER') ||
    roles.includes('SELLER')
  );
};

export const selectIsProvider = (state) => {
  const user = state.user?.user;
  if (!user) return false;
  const caps = (Array.isArray(user.capabilities) ? user.capabilities : []).map((c) => String(c).toUpperCase());
  const roles = (Array.isArray(user.roles) ? user.roles : []).map((r) => String(r).toUpperCase());
  return (
    user.role === 'PROVIDER' ||
    user.activeRole === 'PROVIDER' ||
    caps.includes('PROVIDER') ||
    roles.includes('PROVIDER')
  );
};

export const selectSeller = (state) => state.seller?.seller;
export const selectSellerLoading = (state) => Boolean(state.seller?.isLoading);
