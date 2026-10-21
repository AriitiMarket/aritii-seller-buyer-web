import React from 'react';
import PortalHeader from '@/public/components/PortalHeader';

/**
 * SellerCentralHeader — the Seller Center portal header.
 *
 * Thin configuration wrapper around the shared `PortalHeader`: the Seller
 * Center uses the orange accent, the "Aritii / Seller Central" wordmark and
 * the "Start Selling" call to action.
 */
const SellerCentralHeader = ({ navItems = [], ...rest }) => (
  <PortalHeader
    accent="#FF9900"
    accentHover="#E68A00"
    brandTop="Aritii"
    brandBottom="Seller Central"
    homeTo="/seller-center"
    homeLabel="Aritii Seller Central"
    navItems={navItems}
    backLink={{ label: '← Shop', to: '/products' }}
    signInRole="SELLER"
    signInLabel="Sign In"
    cta={{ label: 'Start Selling', to: '/seller-sign-up' }}
    breakpoint="lg"
    {...rest}
  />
);

export default SellerCentralHeader;
