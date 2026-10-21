import React from 'react';
import PortalHeader from '@/public/components/PortalHeader';

/**
 * DeliveryPortalHeader — the Delivery Center portal header.
 *
 * Thin configuration wrapper around the shared `PortalHeader`: the Delivery
 * Center uses the sky-blue accent, the "Aritii / Delivery Network" wordmark
 * and the "Apply to Deliver" call to action.
 *
 * The section navigation is supplied by the page, because the anchors must
 * match the sections that page actually renders.
 */
const DeliveryPortalHeader = ({ navItems = [], ...rest }) => (
  <PortalHeader
    accent="#00A8E1"
    accentHover="#0087B8"
    brandTop="Aritii"
    brandBottom="Delivery Network"
    homeTo="/delivery-center"
    homeLabel="Aritii Delivery Center home"
    navItems={navItems}
    backLink={{ label: '← Shopping', to: '/products' }}
    signInRole="PROVIDER"
    signInLabel="Sign In"
    cta={{ label: 'Apply to Deliver', to: '/delivery-sign-up' }}
    breakpoint="md"
    {...rest}
  />
);

export default DeliveryPortalHeader;
