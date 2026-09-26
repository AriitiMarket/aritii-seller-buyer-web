/**
 * Business account service.
 *
 * The seller/business capability endpoints live in the shared seller client; this
 * module is the business feature's documented entry point for them (approved
 * business profile + onboarding/application).
 */
export { default, sellerService } from '@/services/seller.service';
