import React from 'react';
import PortalFooter from '@/public/components/PortalFooter';

/**
 * SellerCentralFooter — the Seller Center portal footer.
 *
 * Thin configuration wrapper around the shared `PortalFooter`. The link
 * columns are shared by every Seller Center page; the layout can override
 * them through the `columns` prop.
 */
export const SELLER_FOOTER_COLUMNS = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Start Selling', to: '/seller-sign-up' },
      { label: 'How to Sell', to: '/seller-center/how-it-works' },
      { label: 'Pricing & Plans', to: '/seller-center#pricing' },
      { label: 'Seller Center Home', to: '/seller-center' },
    ],
  },
  {
    title: 'Policies & Terms',
    links: [
      { label: 'Seller Terms of Service', to: '/terms' },
      { label: 'Privacy Notice', to: '/privacy' },
      { label: 'Fee Schedule', to: '/seller-center#pricing' },
      { label: 'Cookie Policy', to: '/cookie' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help & Support', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Community', to: '/events' },
      { label: 'Report an Issue', to: '/contact' },
    ],
  },
  {
    title: 'Aritii Market',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Events', to: '/events' },
      { label: 'Delivery Partners', to: '/delivery-center' },
    ],
  },
];

const SellerCentralFooter = ({ columns = SELLER_FOOTER_COLUMNS }) => (
  <PortalFooter
    accent="#FF9900"
    accentHover="#FFB84D"
    columns={columns}
    accountLabel="Sign in to your Seller Central account"
    signInRole="SELLER"
  />
);

export default SellerCentralFooter;
