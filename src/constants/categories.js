// UI configuration for marketplace categories.
//
// NOTE: The list of marketplace categories is loaded from the backend
// (commerce service -> GET /category). This file does NOT define business
// data. It only maps a category title to a local brand icon, used purely as a
// visual fallback when a real category has no backend image yet.
import { CATEGORY_IMAGES, SHOP_IMAGES } from "../assets";

// Local icon lookup keyed by category title. Titles come from the backend.
export const CATEGORY_IMAGES_BY_TITLE = CATEGORY_IMAGES;

// Placeholder cover/avatar set used for shops that do not have an uploaded
// image yet (UI decoration only, never business data).
export const SHOP_PLACEHOLDER_IMAGES = SHOP_IMAGES;