/**
 * Business inventory service.
 *
 * Inventory is stock on catalog products, so it is served by the product client.
 * Keeping this thin module means inventory pages have one import to change if the
 * backend ever exposes a dedicated inventory endpoint.
 */
export { default, productService as inventoryService } from '@/services/product.service';
