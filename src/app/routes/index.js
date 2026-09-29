/**
 * Route layer barrel.
 *
 * Ownership map (see docs/ROUTES.md):
 *   PublicRoutes   -> Public Website domain (includes catalog browsing)
 *   AuthRoutes     -> authentication + the public seller entry point
 *   BuyerRoutes    -> Buyer domain (authenticated)
 *   BusinessRoutes -> Business/Seller domain (approved business only)
 *   ProviderRoutes -> Provider domain (delivery provider only)
 *   DeliveryRoutes -> Delivery domain (delivery actor only)
 *
 * The Admin console is a SEPARATE application (Aritii-admin-web) and is not
 * routed, imported or modified by this app.
 */
export { default as ProtectedRoute } from '@/app/routes/ProtectedRoute';
export { default as PageLoader } from '@/app/routes/PageLoader';
export { default as PublicRoutes } from '@/app/routes/PublicRoutes';
export { default as AuthRoutes } from '@/app/routes/AuthRoutes';
export { default as BuyerRoutes } from '@/app/routes/BuyerRoutes';
export { default as BusinessRoutes } from '@/app/routes/BusinessRoutes';
export { default as ProviderRoutes } from '@/app/routes/ProviderRoutes';
export { default as ProviderGuard } from '@/app/routes/ProviderGuard';
export { default as DeliveryRoutes } from '@/app/routes/DeliveryRoutes';
