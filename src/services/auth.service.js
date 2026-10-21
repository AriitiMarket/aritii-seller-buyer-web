import api from '@/services/api';
import { tokenStore } from '@/services/tokenStore';
import { createPkcePair, discardPkce } from '@/services/pkce';
import { normalizeActorRole, workspaceForLogin } from '@/shared/utils/actorWorkspaces';

/**
 * Authentication Service — OAuth 2.1 Authorization Code Flow + PKCE (S256).
 *
 * Flow implemented here:
 *   1. client generates code_verifier / code_challenge (S256)
 *   2. POST /auth/authorize (login) or /auth/register (sign-up) with the
 *      challenge → the server returns a one-time authorization code
 *   3. POST /auth/token with grant_type=authorization_code + the verifier
 *      → short-lived access token, id token, rotating refresh token
 * No tokens are ever returned by a credential endpoint, and no cookies are used.
 */

const CLIENT_ID = 'aritii-eshop';

// The three role-specific registration paths the Identity Service exposes.
const REGISTRATION_ROLES = ['BUYER', 'SELLER', 'PROVIDER'];

/**
 * Is this payload a FormData instance?
 *
 * The registration form always submits FormData (so an optional avatar can ride
 * along), and FormData exposes its entries through `.get()` — never through
 * plain properties. Reading `payload.registrationType` off a FormData silently
 * yields `undefined`, which is how every seller/provider sign-up ended up on the
 * plain buyer endpoint.
 */
function isFormDataPayload(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

/** Read `registrationType` from either a FormData or a plain object. */
function readRegistrationType(userData) {
  const raw = isFormDataPayload(userData) ? userData.get('registrationType') : userData?.registrationType;
  const role = String(raw || 'BUYER').trim().toUpperCase();
  return REGISTRATION_ROLES.includes(role) ? role : 'BUYER';
}

/**
 * POST a registration payload.
 *
 * The shared axios client defaults to `Content-Type: application/json`, and
 * axios v1 turns a FormData body into JSON whenever that header is present —
 * which silently drops a File value (a serialized File is `{}`). Sending
 * FormData explicitly as `multipart/form-data` lets the browser set the real
 * boundary, so the avatar is actually uploaded.
 */
function postRegistration(path, payload) {
  if (isFormDataPayload(payload)) {
    return api.post(path, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return api.post(path, payload);
}

async function exchangeCodeForTokens(code, codeVerifier) {
  const { data } = await api.post('/auth/token', {
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
  });
  const result = data.data || data;
  if (!result.access_token) {
    throw new Error('Token exchange failed');
  }
  tokenStore.setTokens({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    id_token: result.id_token,
  });
  return result;
}

export const authService = {
  /**
   * Register a new customer, then complete the PKCE code exchange.
   * @param {Object|FormData} userData - registration payload (may include avatar)
   */
  async register(userData) {
    const pkce = await createPkcePair();
    let payload;
    if (isFormDataPayload(userData)) {
      payload = userData;
      payload.append('code_challenge', pkce.codeChallenge);
      payload.append('code_challenge_method', pkce.codeChallengeMethod);
      payload.append('client_id', CLIENT_ID);
      payload.append('state', pkce.state);
    } else {
      payload = {
        ...userData,
        code_challenge: pkce.codeChallenge,
        code_challenge_method: pkce.codeChallengeMethod,
        client_id: CLIENT_ID,
        state: pkce.state,
      };
    }

    const { data } = await postRegistration('/auth/register', payload);
    const issued = data.data || data;
    if (!issued.code) throw new Error('Authorization code not issued');

    const tokens = await exchangeCodeForTokens(issued.code, pkce.codeVerifier);
    discardPkce(pkce);
    if (issued.user) tokenStore.setUser(issued.user);
    // The account registered AS the buyer role; remember it so the guards route
    // this session to the buyer workspace.
    tokenStore.setLoginRole('BUYER');
    return { ...tokens, user: issued.user, registrationType: 'BUYER' };
  },

  /**
   * Register with a specific role (BUYER, SELLER, PROVIDER), then complete PKCE exchange.
   * For SELLER and PROVIDER, creates a PENDING membership requiring admin approval.
   * @param {Object|FormData} userData - registration payload including registrationType
   */
  async registerWithRole(userData) {
    const pkce = await createPkcePair();
    // Works for both a plain object and the FormData the sign-up form submits.
    const registrationType = readRegistrationType(userData);

    let payload;
    if (isFormDataPayload(userData)) {
      payload = userData;
      payload.append('code_challenge', pkce.codeChallenge);
      payload.append('code_challenge_method', pkce.codeChallengeMethod);
      payload.append('client_id', CLIENT_ID);
      payload.append('state', pkce.state);
    } else {
      payload = {
        ...userData,
        code_challenge: pkce.codeChallenge,
        code_challenge_method: pkce.codeChallengeMethod,
        client_id: CLIENT_ID,
        state: pkce.state,
      };
    }

    const { data } = await postRegistration(`/auth/register/${registrationType}`, payload);
    const issued = data.data || data;
    if (!issued.code) throw new Error('Authorization code not issued');

    const tokens = await exchangeCodeForTokens(issued.code, pkce.codeVerifier);
    discardPkce(pkce);
    if (issued.user) tokenStore.setUser(issued.user);
    // The account registered AS this role; remember it so the guards route this
    // session to the matching workspace (or application screen) rather than
    // assuming buyer.
    tokenStore.setLoginRole(registrationType);
    return { ...tokens, user: issued.user, registrationType, message: issued.message };
  },

  /**
   * Log in with email or phone + password through the shared authorization
   * endpoint. Identity resolves the account's role and access.
   *
   * @param {string} emailOrPhone
   * @param {string} password
   */
  async login(email, password) {
    const pkce = await createPkcePair();
    const { data } = await api.post('/auth/authorize', {
      email,
      password,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: pkce.codeChallengeMethod,
      client_id: CLIENT_ID,
      state: pkce.state,
    });
    const issued = data.data || data;

    // Handle 2FA challenge
    if (issued.requires2fa) {
      discardPkce(pkce);
      return {
        requires2fa: true,
        method: issued.method || 'TOTP',
        tempToken: issued.tempToken,
        message: issued.message || 'Two-factor authentication required',
      };
    }

    if (!issued.code) throw new Error('Authorization code not issued');

    const tokens = await exchangeCodeForTokens(issued.code, pkce.codeVerifier);
    discardPkce(pkce);
    // Remember the chosen role for this session (used by the route guards).
    const loginRole = issued.login_role || 'BUYER';
    tokenStore.setLoginRole(loginRole);
    // Populate the user profile from the freshly issued access token.
    try {
      await this.getCurrentUser();
    } catch (err) {
      /* profile fetch is best-effort; tokens are already stored */
    }
    return { ...tokens, loginRole };
  },

  /**
   * Verify 2FA challenge code or backup code during login
   * @param {Object} params
   * @param {string} [params.code]
   * @param {string} [params.backupCode]
   * @param {string} params.tempToken
   */
  async verify2FA({ code, backupCode, tempToken }) {
    const payload = backupCode
      ? { backupCode: String(backupCode).trim() }
      : { code: String(code || '').trim() };

    const { data } = await api.post('/auth/verify-2fa', payload, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
      skipAuth: true,
    });

    const result = data.data || data;
    if (!result.access_token) {
      throw new Error(result.message || 'Verification failed');
    }

    tokenStore.setTokens({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      id_token: result.id_token,
    });

    if (result.user) {
      tokenStore.setUser(result.user);
      const role = result.user.role || tokenStore.getLoginRole() || 'BUYER';
      tokenStore.setLoginRole(role);
    }

    try {
      await this.getCurrentUser();
    } catch (err) {
      /* best effort */
    }

    return result;
  },

  /**
   * Resend 2FA verification code (EMAIL/SMS only)
   * @param {Object} params
   * @param {string} params.tempToken
   * @param {'EMAIL'|'SMS'} params.method
   */
  async resend2FACode({ tempToken, method }) {
    const { data } = await api.post(
      '/auth/resend-2fa-code',
      { method },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
        skipAuth: true,
      }
    );
    return data.data || data;
  },

  /**
   * Where a session that signed in as `role` should land.
   *
   * Read from Identity's role-status so a seller/provider whose membership is
   * still awaiting approval lands on their application screen rather than a
   * portal the backend would refuse.
   */
  async loginDestination(role) {
    // normalizeActorRole folds a stored legacy `login_role` (CUSTOMER) onto BUYER.
    const requested = normalizeActorRole(role || tokenStore.getLoginRole()) || 'BUYER';
    if (requested === 'BUYER') return workspaceForLogin('BUYER');
    let status = null;
    try {
      const { data } = await api.get(`/auth/role-status/${requested}`);
      const result = data.data || data;
      status = result.status || null;
    } catch (err) {
      /* fall through to the role's default (application) destination */
    }
    return workspaceForLogin(requested, status);
  },

   async getCurrentUser() {
     const accessToken = tokenStore.getAccessToken();
     if (!accessToken) return null;
     const { data } = await api.get('/user/getuser');
     const user = (data.data || data).user || data.user;
     if (user) tokenStore.setUser(user);
     return user || null;
   },

  /**
   * Switch which actor role this session acts as.
   *
   * One account can hold several roles (buyer + seller + provider). The server
   * re-mints the access token with the chosen role; the rotating refresh token is
   * deliberately kept, and the choice is persisted server-side so it survives
   * rotation. Only roles the account already holds are accepted.
   */
  async switchRole(role) {
    const { data } = await api.post('/auth/switch-role', { role });
    const result = data.data || data;
    if (!result.access_token) throw new Error('Role switch failed');
    tokenStore.setTokens({ access_token: result.access_token });
    return result;
  },

  async logout() {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      // RFC 7009 revocation — server-side session teardown.
      const { data } = await api.post('/auth/revoke', { token: refreshToken });
      return data;
    } finally {
      tokenStore.clear();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('aritii.business.selectedShopId');
      }
    }
  },

  async updateProfile(userData) {
    const { data } = await api.put('/user/update-user-info', userData);
    return (data.data || data).user || data.user || null;
  },

  async changePassword({ oldPassword, newPassword, confirmPassword }) {
    const { data } = await api.put('/user/update-user-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return data;
  },

  async updateAvatar(formData) {
    const { data } = await api.put('/user/update-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (data.data || data).user || data.user || null;
  },
};

export default authService;
