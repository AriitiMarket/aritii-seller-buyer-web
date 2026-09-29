/**
 * Actor workspaces — the ONE place that maps an actor role to the workspace it
 * lives in.
 *
 * One account can hold several actor roles (buyer + seller + delivery provider),
 * so both the role chooser (shared/components/RoleSwitcher) and the post-login
 * landing decision (auth/components/Login) must agree on this mapping. Keeping it
 * in a single module is what stops those two from drifting apart.
 *
 * `role` values are the canonical capability names Identity emits:
 * BUYER | SELLER | PROVIDER | AGENT (ADMIN accounts get no chooser). The buyer
 * spelling is BUYER — every non-admin account holds it — and the legacy
 * `CUSTOMER` spelling is folded onto BUYER by `normalizeActorRole` so a stored
 * session or an old payload can never split this mapping.
 */
export const ACTOR_WORKSPACES = Object.freeze([
  {
    role: 'BUYER',
    label: 'Buyer',
    description: 'Shop, track orders and manage your account',
    to: '/my-dashboard',
  },
  {
    role: 'SELLER',
    label: 'Seller',
    description: 'Manage your shop, products and sales',
    to: '/business',
  },
  {
    role: 'PROVIDER',
    label: 'Delivery provider',
    description: 'Available work, deliveries and availability',
    to: '/provider',
  },
  {
    role: 'AGENT',
    label: 'Delivery agent',
    description: 'Assigned delivery operations',
    to: '/delivery',
  },
]);

/**
 * Canonical actor role for any role-ish string.
 *
 * One place folds the legacy `CUSTOMER` spelling onto `BUYER` (Identity stores
 * `CUSTOMER` on old rows but reads it back as `BUYER`), so callers never need
 * their own alias list.
 *
 * @param {string} role
 * @returns {string} upper-cased canonical role ('' for a missing value)
 */
export function normalizeActorRole(role) {
  const value = String(role || '').trim().toUpperCase();
  return value === 'CUSTOMER' ? 'BUYER' : value;
}

/**
 * Workspaces this account may enter.
 *
 * An ADMIN account always acts as ADMIN and cannot switch (the API refuses both
 * directions), so it gets no chooser — the admin console is a separate app.
 */
export function workspacesFor(user) {
  if (!user) return [];
  const capabilities = (Array.isArray(user.capabilities) ? user.capabilities : [])
    .map(normalizeActorRole);
  if (capabilities.includes('ADMIN')) return [];
  return ACTOR_WORKSPACES.filter(
    (workspace) => workspace.role === 'BUYER' || capabilities.includes(workspace.role)
  );
}

/** The workspace matching the role the session is currently acting as. */
export function activeWorkspaceFor(user) {
  const workspaces = workspacesFor(user);
  if (workspaces.length === 0) return null;
  const active = normalizeActorRole(user?.activeRole || user?.role);
  return workspaces.find((workspace) => workspace.role === active) || workspaces[0];
}

/**
 * Where a session that signed in AS `role` belongs.
 *
 * Sign-in is role-scoped (see the Identity Service's `resolveLoginRole`): the
 * visitor chooses Buyer / Seller / Provider, and only the role their account
 * registered for is accepted. The landing page then follows that role — but only
 * once the role actually has a workspace. A seller or provider whose membership
 * is still awaiting approval has no portal yet, so they land on their
 * application screen instead of a workspace the backend would refuse.
 *
 * @param {'BUYER'|'SELLER'|'PROVIDER'} role  the role the visitor signed in as
 * @param {string} [status]  Identity role-status: ACTIVE | PENDING | REJECTED |
 *                           SUSPENDED | NOT_APPLIED
 * @returns {string} the path to land on
 */
export function workspaceForLogin(role, status) {
  const requested = normalizeActorRole(role) || 'BUYER';
  const state = String(status || '').trim().toUpperCase();

  if (requested === 'SELLER') {
    return state === 'ACTIVE' ? '/business' : '/seller-registration/status';
  }
  if (requested === 'PROVIDER') {
    return state === 'ACTIVE' ? '/provider' : '/provider-application/status';
  }
  return '/my-dashboard';
}

/**
 * Where to send an account after signing in.
 *
 * The account's primary role wins unless the session was explicitly switched to
 * another actor, which preserves the long-standing "a seller lands on /business"
 * behaviour while letting a seller-who-is-also-a-provider land where they chose.
 */
export function defaultWorkspaceFor(user) {
  const workspaces = workspacesFor(user);
  if (workspaces.length === 0) return '/my-dashboard';

  const primary = normalizeActorRole(user?.role);
  const active = normalizeActorRole(user?.activeRole) || primary;
  const explicitlySwitched = active !== primary;

  if (!explicitlySwitched) {
    const primaryWorkspace = workspaces.find((workspace) => workspace.role === primary);
    if (primaryWorkspace) return primaryWorkspace.to;
  }
  return (activeWorkspaceFor(user) || workspaces[0]).to;
}

export default ACTOR_WORKSPACES;
