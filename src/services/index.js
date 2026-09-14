/**
 * API Services Index
 * Central export point for all API services
 * Import from this file to use any service in components/pages
 */

export { authService } from "./auth.service";
export { productService } from "./product.service";
export { orderService } from "./order.service";
export { addressService } from "./address.service";
export { shopService } from "./shop.service";
export { sellerService } from "./seller.service";
export { catalogService } from "./catalog.service";

export { default as api } from "./api";

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
