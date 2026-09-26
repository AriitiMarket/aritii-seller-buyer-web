/**
 * PKCE helpers (RFC 7636, S256 only).
 *
 * Requires a secure context: crypto.subtle is only available over HTTPS or on
 * localhost — which is one more reason the platform mandates TLS everywhere.
 */

const BASE64URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

function randomVerifier(length = 64) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += BASE64URL_ALPHABET[bytes[i] % BASE64URL_ALPHABET.length];
  }
  return out;
}

function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function s256Challenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64UrlEncode(digest);
}

/**
 * Generates a PKCE pair plus the anti-CSRF state value.
 * @returns {Promise<{codeVerifier: string, codeChallenge: string, codeChallengeMethod: 'S256', state: string}>}
 */
export async function createPkcePair() {
  const codeVerifier = randomVerifier(64);
  const codeChallenge = await s256Challenge(codeVerifier);
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
    state: randomVerifier(32),
  };
}

/** Clears PKCE material from memory once the code has been exchanged. */
export function discardPkce(pkce) {
  if (pkce) {
    pkce.codeVerifier = '';
    pkce.codeChallenge = '';
  }
}

export default { createPkcePair, discardPkce };
