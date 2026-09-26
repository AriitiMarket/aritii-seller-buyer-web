import { useEffect } from 'react';
import Store from '@/store';
import { loadUser, loadSeller } from '@/store/slices/userThunks';
import { fetchWishlist } from '@/store/slices/wishlistThunks';

let bootstrapped = false;

/**
 * useAppBootstrap — one-time session bootstrap.
 *
 * Restores the authenticated account and the approved business capability as soon
 * as the app mounts, so route guards can decide immediately.
 *
 * CRITICAL: loadUser MUST complete before loadSeller fires. loadSeller depends on
 * the access token (in-memory, lost on page refresh) which is only set after
 * loadUser calls getCurrentUser() → tokenStore.setTokens(). If both fire
 * simultaneously, loadSeller sees no token and fails immediately.
 *
 * The wishlist is re-fetched here (after the identity is restored) so header
 * badges and hearts are account-accurate on every reload, not only after the
 * Wishlist page is visited.
 */
export function useAppBootstrap() {
  useEffect(() => {
    if (bootstrapped) return;
    bootstrapped = true;

    // Chain: loadUser first, then loadSeller only after user is loaded
    Store.dispatch(loadUser()).then(() => {
      Store.dispatch(loadSeller());
      if (Store.getState().user?.isAuthenticated) {
        Store.dispatch(fetchWishlist());
      }
    }).catch(() => {
      // loadUser failed — loadSeller will also fail, but dispatch it anyway
      // so the seller slice resolves (isLoading: false) instead of hanging.
      Store.dispatch(loadSeller());
    });
  }, []);
}

export default useAppBootstrap;
