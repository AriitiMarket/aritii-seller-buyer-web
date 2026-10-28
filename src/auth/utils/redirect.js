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

export default getSafeRedirect;
