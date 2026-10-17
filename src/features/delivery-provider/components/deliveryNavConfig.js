/**
 * Shared delivery navigation config.
 *
 * Single source of truth for the delivery provider workspace navigation, used by
 * both the desktop sidebar (ProviderSidebar) and the mobile drawer
 * (ProviderMobileDrawer). Items are ordered by operational frequency:
 * overview first, then the core delivery work loop (assignments → deliveries →
 * batches), then operating area, earnings (documented as a backend gap), and
 * finally account/support actions.
 *
 * Every `to` route exists in ProviderRoutes.jsx. Permission-sensitive items are
 * still guarded by ProtectedRoute at the route level; this config only decides
 * what is offered to a provisioned PROVIDER.
 */
export const DELIVERY_NAV_ITEMS = Object.freeze([
  {
    section: 'OVERVIEW',
  },
  {
    label: 'Overview',
    to: '/provider',
    icon: 'MdDashboard',
    end: true,
  },

  {
    section: 'WORK',
  },
  {
    label: 'Delivery Assignments',
    to: '/provider/available-work',
    icon: 'MdWorkOutline',
  },
  {
    label: 'My Deliveries',
    to: '/provider/deliveries',
    icon: 'MdLocalShipping',
  },
  {
    label: 'Batches',
    to: '/provider/batches',
    icon: 'MdInventory',
  },

  {
    section: 'AREA',
  },
  {
    label: 'Operating Area',
    to: '/provider/operating-area',
    icon: 'MdLocationOn',
  },

  {
    section: 'ACCOUNT',
  },
  {
    label: 'Profile & Settings',
    to: '/provider/profile',
    icon: 'MdPerson',
  },
  {
    label: 'Warnings & Support',
    to: '/provider/warnings',
    icon: 'MdHelpOutline',
  },

  { type: 'logout' },
]);

export default DELIVERY_NAV_ITEMS;
