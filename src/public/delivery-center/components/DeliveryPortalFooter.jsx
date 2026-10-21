import React from 'react';
import PortalFooter from '@/public/components/PortalFooter';

/**
 * DeliveryPortalFooter — the Delivery Center portal footer.
 *
 * Thin configuration wrapper around the shared `PortalFooter`.
 *
 * The "Getting Started" column links to sections of the page that renders the
 * footer, so the anchor map is supplied by the page. Everything else points at
 * routes that exist.
 */
export const deliveryFooterColumns = ({
  waysToDeliver = '/delivery#how-it-works',
  vehicleRequirements = '/delivery#services',
  earnings = '/delivery#why',
  safety = '/faq',
} = {}) => [
  {
    title: 'Getting Started',
    links: [
      { label: 'Apply to Deliver', to: '/delivery-sign-up' },
      { label: 'Ways to Deliver', to: waysToDeliver },
      { label: 'Vehicle Requirements', to: vehicleRequirements },
      { label: 'Earnings & Pay', to: earnings },
    ],
  },
  {
    title: 'Policies & Safety',
    links: [
      { label: 'Delivery Partner Terms', to: '/terms' },
      { label: 'Safety Guidelines', to: safety },
      { label: 'Background Checks', to: '/faq' },
      { label: 'Insurance Information', to: '/faq' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Partner Support', to: '/faq' },
      { label: 'FAQs', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Driver Community', to: '/events' },
    ],
  },
  {
    title: 'About Aritii',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Mission', to: '/about' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Events', to: '/events' },
    ],
  },
];

const DeliveryPortalFooter = ({ columns = deliveryFooterColumns() }) => (
  <PortalFooter
    accent="#00A8E1"
    accentHover="#5FD4F0"
    columns={columns}
    accountLabel="Sign in to Delivery Center"
    signInRole="PROVIDER"
  />
);

export default DeliveryPortalFooter;
