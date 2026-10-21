import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * LayoutContext — UI-only state shared by the domain layouts.
 *
 * IMPORTANT: this context must never hold server/domain data (that lives in
 * Redux per-domain slices or in feature services). It only coordinates
 * cross-component layout behaviour such as an off-canvas mobile drawer, which
 * several layouts and headers need to share.
 */
const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginModalState, setLoginModalState] = useState({
    open: false,
    role: 'BUYER',
    returnTo: null,
  });

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(() => setMobileNavOpen((open) => !open), []);

  /**
   * Open the ONE login modal.
   *
   * `role` is only a HINT about where the visitor was when they asked to sign
   * in (it picks the badge and the sign-up link). It is NOT the role the
   * session signs in as — the Identity Service resolves that server-side from
   * the account's role memberships and returns it as `login_role`.
   *
   * `returnTo` is the path to return to once the session exists (the page a
   * route guard interrupted, for example).
   */
  const openLoginModal = useCallback((role = 'BUYER', returnTo = null) => {
    setLoginModalState({ open: true, role, returnTo });
  }, []);
  const closeLoginModal = useCallback(() => {
    setLoginModalState((prev) => ({ ...prev, open: false, returnTo: null }));
  }, []);

  const value = useMemo(
    () => ({
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      loginModalOpen: loginModalState.open,
      loginModalRole: loginModalState.role,
      loginModalReturnTo: loginModalState.returnTo,
      openLoginModal,
      closeLoginModal,
    }),
    [mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav, loginModalState, openLoginModal, closeLoginModal]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    return {
      mobileNavOpen: false,
      openMobileNav: () => {},
      closeMobileNav: () => {},
      toggleMobileNav: () => {},
      loginModalState: { open: false, defaultRole: 'BUYER', returnTo: null },
      openLoginModal: () => {},
      closeLoginModal: () => {},
    };
  }
  return ctx;
}

export default LayoutContext;