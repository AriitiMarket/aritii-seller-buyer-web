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

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(() => setMobileNavOpen((open) => !open), []);

  const value = useMemo(
    () => ({ mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav }),
    [mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayout must be used inside <LayoutProvider>');
  }
  return ctx;
}

export default LayoutContext;