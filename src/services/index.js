/**
 * API Services Index
 * Central export point for all API services
 * Import from this file to use any service in components/pages
 */


export { authService } from "@/services/auth.service";
export { productService } from "@/services/product.service";
export { orderService } from "@/services/order.service";
export { reportService } from "@/services/order.service";
export { addressService } from "@/services/address.service";
export { shopService } from "@/services/shop.service";
export { sellerService } from "@/services/seller.service";
export { catalogService } from "@/services/catalog.service";
export { userService } from "@/services/user.service";
export { reviewService } from "@/services/review.service";
export { locationService } from "@/services/location.service";
export { deliveryService } from "@/services/delivery.service";
export { twoFactorService } from "@/services/twoFactor.service";
export { returnsService } from "@/services/returns.service";
export {
  walletService,
  getWallet,
  getWalletDashboard,
  getTransactionHistory,
  getTransaction,
  getAllWallets,
  getPlatformFinancialSummary,
  suspendWallet,
  createAdjustment
} from "@/services/wallet.service";

/**
 * Payment service — one canonical client (see `services/payment.service.js`).
 * It used to be redefined inline here, which meant two different response
 * shapes for the same endpoint depending on the import path.
 */
import { paymentService } from "@/services/payment.service";
export { paymentService };

/**
 * Bound helper kept for the two business pages that import it by name.
 * It delegates to the single payment client.
 */
export const getSellerAllocations = (...args) =>
  paymentService.getSellerAllocations(...args);

export { default as api } from "@/services/api";

/**
 * Usage in components:
 * 
 * import { productService, orderService, authService } from '@/services'
 * 
 * // Get all products
 * const products = await productService.getAll()
 * 
 * // Get buyer's orders
 * const orders = await orderService.getBuyerOrders(userId)
 * 
 * // Login user
 * const result = await authService.login(email, password)
 */
