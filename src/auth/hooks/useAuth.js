import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logoutUser,
  loadUser,
  registerUser,
} from '@/store/slices/userThunks';
import {
  selectAuthError,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsSeller,
  selectSeller,
} from '@/auth/authSlice';

/**
 * useAuth — the auth feature's hook surface.
 *
 * Components must use this hook (or the selectors in `authSlice.js`) instead of
 * reaching into `state.user` directly, so the auth contract stays in one place.
 * Frontend auth is a UX guard only: the backend remains the security boundary
 * (see docs/AUTHORIZATION.md).
 */
export function useAuth() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectCurrentUser);
  const error = useSelector(selectAuthError);
  const isSeller = useSelector(selectIsSeller);
  const seller = useSelector(selectSeller);

 

  return {
    isAuthenticated,
    loading,
    user,
    error,
    isSeller,
    seller,
    login,
    register,
    logout,
    refresh,
  };
}

/** Minimal current-user selector for components that only need identity. */
export function useCurrentUser() {
  return useSelector(selectCurrentUser);
}

export default useAuth;
