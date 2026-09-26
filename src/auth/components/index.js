/**
 * Auth feature components (forms).
 *
 * NOTE: there is ONE account and ONE login for buyers and sellers. The separate
 * seller-register/shop-login forms were removed by design - /create-shop and
 * /shop-login redirect into the unified flow.
 */
export { default as Login } from '@/auth/components/Login';
export { default as SignUp } from '@/auth/components/SignUp';
