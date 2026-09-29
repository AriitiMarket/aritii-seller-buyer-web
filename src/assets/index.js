// Central asset registry for Aritii Market.
// Import every local image here and reuse these exports across the app so we
// never hard-code image paths or repeat `import ... from '../assets/...svg'`.

import Logo from "@/assets/images/brand/aritii-logo.svg";

import CatElectronics from "@/assets/images/categories/electronics.svg";
import CatFashion from "@/assets/images/categories/fashion.svg";
import CatHomeLiving from "@/assets/images/categories/home-living.svg";
import CatBeauty from "@/assets/images/categories/beauty.svg";
import CatGroceries from "@/assets/images/categories/groceries.svg";
import CatHandcrafts from "@/assets/images/categories/handcrafts.svg";

import PlaceholderProduct from "@/assets/images/placeholders/product-placeholder.svg";
import PlaceholderShop from "@/assets/images/placeholders/shop-placeholder.svg";
import PlaceholderAvatar from "@/assets/images/placeholders/avatar-placeholder.svg";

export const LOGO = Logo;

export const CATEGORY_IMAGES = {
  Electronics: CatElectronics,
  Fashion: CatFashion,
  "Home & Living": CatHomeLiving,
  "Beauty & Personal Care": CatBeauty,
  "Groceries & Food": CatGroceries,
  "Handcrafts & Local Products": CatHandcrafts,
  "Beauty & Care": CatBeauty,
};

export {
  PlaceholderProduct,
  PlaceholderShop,
  PlaceholderAvatar,
};
