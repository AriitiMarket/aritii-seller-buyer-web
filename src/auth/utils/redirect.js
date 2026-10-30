/**
 * Validate and sanitize redirect destinations to prevent open-redirect vulnerabilities.
 * Only internal paths starting with a single '/' are permitted.
 * Protocol-relative URLs (e.g. '//attacker.com'), external URLs ('https://...'),
 * and dangerous protocols ('javascript:') fall back to the safe destination.
 *
 * @param {string|null|undefined} target - The intended redirect path
 * @param {string|null} [fallback='/'] - The fallback path if target is invalid
 * @returns {string|null} The sanitized safe relative path, or fallback
 */
export function getSafeRedirect(target, fallback = '/') {
  if (!target || typeof target !== 'string') return fallback;
  const trimmed = target.trim();

  // Reject dangerous pseudo-protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return fallback;

  // Must begin with a single '/' and not '//' (protocol-relative) or '/\'
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    // Avoid redirect loops back to auth pages
    if (/^\/(login|seller-login|delivery-login)(\?|$)/.test(trimmed)) {
      return fallback;
    }
    return trimmed;
  }

  return fallback;
}

/**
 * Determine the destination URL after a successful login or 2FA verification.
 * Prevents public marketing pages (e.g., '/', '/delivery-center', '/seller-center')
 * from hijacking the post-login destination when a user signs in as a specific role
 * (like PROVIDER or SELLER).
 *
 * @param {string|null|undefined} target - The intended returnTo or from path
 * @param {string} fallbackDestination - The role-based workspace or destination computed by authService.loginDestination
 * @param {string} [role] - The role the user signed in as or holds (e.g., 'PROVIDER', 'SELLER')
 * @returns {string} The final safe destination URL
 */
export function resolvePostLoginRedirect(target, fallbackDestination, role) {
  const safeFallback = getSafeRedirect(fallbackDestination, '/');
  const safeTarget = getSafeRedirect(target, null);
  const normalizedRole = String(role || '').trim().toUpperCase();

  // If the user signed in as a PROVIDER or fallback points to provider space:
  if (normalizedRole === 'PROVIDER' || safeFallback.startsWith('/provider')) {
    // Only accept target if it's already an explicit internal provider route
    if (safeTarget && safeTarget.startsWith('/provider')) {
      return safeTarget;
    }
    return safeFallback;
  }

  // If the user signed in as a SELLER or fallback points to seller space:
  if (normalizedRole === 'SELLER' || safeFallback.startsWith('/business')) {
    // Only accept target if it's already an explicit internal seller route
    if (safeTarget && safeTarget.startsWith('/business')) {
      return safeTarget;
    }
    return safeFallback;
  }

  // Public marketing/landing pages should not override the user's workspace destination
  const publicLandingRoutes = [
    '/',
    '/delivery-center',
    '/seller-center',
    '/products',
    '/categories',
    '/delivery-sign-up',
    '/seller-registration',
  ];
  if (!safeTarget || publicLandingRoutes.includes(safeTarget)) {
    return safeFallback;
  }

  return safeTarget;
}

export default getSafeRedirect;
