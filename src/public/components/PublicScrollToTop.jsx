import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll on public route/query changes, while allowing hash links to target sections. */
export default function PublicScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
}
