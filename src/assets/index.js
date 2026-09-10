// Central asset registry for Aritii Market.
// Import every local image here and reuse these exports across the app so we
// never hard-code image paths or repeat `import ... from '../assets/...svg'`.

import Logo from "./images/brand/aritii-logo.svg";
import LogoDark from "./images/brand/aritii-logo-dark.svg";
import Icon from "./images/brand/aritii-icon.svg";
import Favicon from "./images/brand/favicon.svg";

import HeroMain from "./images/hero/hero-main.svg";
import HeroMobile from "./images/hero/hero-mobile.svg";
import PromoBanner from "./images/hero/promotional-banner.svg";

import CatElectronics from "./images/categories/electronics.svg";
import CatFashion from "./images/categories/fashion.svg";
import CatHomeLiving from "./images/categories/home-living.svg";
import CatBeauty from "./images/categories/beauty.svg";
import CatGroceries from "./images/categories/groceries.svg";
import CatHandcrafts from "./images/categories/handcrafts.svg";

import ProductLaptop from "./images/products/laptop.svg";
import ProductLaptopAlt from "./images/products/laptop-alt.svg";
import ProductPhone from "./images/products/phone.svg";
import ProductPhoneAlt from "./images/products/phone-alt.svg";
import ProductDress from "./images/products/dress.svg";
import ProductDressAlt from "./images/products/dress-alt.svg";
import ProductCoffeeBasket from "./images/products/coffee-basket.svg";
import ProductCoffeeBasketAlt from "./images/products/coffee-basket-alt.svg";
import ProductSneakers from "./images/products/sneakers.svg";
import ProductSneakersAlt from "./images/products/sneakers-alt.svg";
import ProductHeadset from "./images/products/headset.svg";
import ProductHeadsetAlt from "./images/products/headset-alt.svg";
import ProductCeramicSet from "./images/products/ceramic-set.svg";
import ProductCeramicSetAlt from "./images/products/ceramic-set-alt.svg";
import ProductCoffeeBeans from "./images/products/coffee-beans.svg";
import ProductCoffeeBeansAlt from "./images/products/coffee-beans-alt.svg";

import Shop1 from "./images/shops/shop-1.svg";
import Shop2 from "./images/shops/shop-2.svg";
import Shop3 from "./images/shops/shop-3.svg";
import Shop4 from "./images/shops/shop-4.svg";
import Shop5 from "./images/shops/shop-5.svg";
import Shop6 from "./images/shops/shop-6.svg";
import Shop1Cover from "./images/shops/shop-1-cover.svg";
import Shop2Cover from "./images/shops/shop-2-cover.svg";
import Shop3Cover from "./images/shops/shop-3-cover.svg";
import Shop4Cover from "./images/shops/shop-4-cover.svg";
import Shop5Cover from "./images/shops/shop-5-cover.svg";
import Shop6Cover from "./images/shops/shop-6-cover.svg";

import BannerSale from "./images/banners/sale-banner.svg";
import BannerSeller from "./images/banners/seller-banner.svg";
import BannerPromotion from "./images/banners/promotion-banner.svg";
import BannerBestDeals from "./images/banners/best-deals-banner.svg";

import AuthLogin from "./images/auth/login-illustration.svg";
import AuthRegister from "./images/auth/register-illustration.svg";
import AuthSellerLogin from "./images/auth/seller-login-illustration.svg";
import AuthSellerRegister from "./images/auth/seller-register-illustration.svg";

import EmptyCart from "./images/empty-states/empty-cart.svg";
import EmptyWishlist from "./images/empty-states/empty-wishlist.svg";
import EmptyOrders from "./images/empty-states/empty-orders.svg";
import NoProducts from "./images/empty-states/no-products.svg";
import NoResults from "./images/empty-states/no-results.svg";

import PlaceholderProduct from "./images/placeholders/product-placeholder.svg";
import PlaceholderShop from "./images/placeholders/shop-placeholder.svg";
import PlaceholderAvatar from "./images/placeholders/avatar-placeholder.svg";
import PlaceholderCategory from "./images/placeholders/category-placeholder.svg";

export const IMAGES = {
  brand: { Logo, LogoDark, Icon, Favicon },
  hero: { HeroMain, HeroMobile, PromoBanner },
  banners: { BannerSale, BannerSeller, BannerPromotion, BannerBestDeals },
  auth: { AuthLogin, AuthRegister, AuthSellerLogin, AuthSellerRegister },
  emptyStates: { EmptyCart, EmptyWishlist, EmptyOrders, NoProducts, NoResults },
  placeholders: {
    Product: PlaceholderProduct,
    Shop: PlaceholderShop,
    Avatar: PlaceholderAvatar,
    Category: PlaceholderCategory,
  },
};

export const LOGO = Logo;
export const LOGO_DARK = LogoDark;
export const LOGO_ICON = Icon;

export const CATEGORY_IMAGES = {
  Electronics: CatElectronics,
  Fashion: CatFashion,
  "Home & Living": CatHomeLiving,
  "Beauty & Personal Care": CatBeauty,
  "Groceries & Food": CatGroceries,
  "Handcrafts & Local Products": CatHandcrafts,
  "Beauty & Care": CatBeauty,
};

export const SHOP_IMAGES = [
  { avatar: Shop1, cover: Shop1Cover },
  { avatar: Shop2, cover: Shop2Cover },
  { avatar: Shop3, cover: Shop3Cover },
  { avatar: Shop4, cover: Shop4Cover },
  { avatar: Shop5, cover: Shop5Cover },
  { avatar: Shop6, cover: Shop6Cover },
];

export const PRODUCT_IMAGES = {
  laptop: [ProductLaptop, ProductLaptopAlt],
  phone: [ProductPhone, ProductPhoneAlt],
  dress: [ProductDress, ProductDressAlt],
  "coffee-basket": [ProductCoffeeBasket, ProductCoffeeBasketAlt],
  sneakers: [ProductSneakers, ProductSneakersAlt],
  headset: [ProductHeadset, ProductHeadsetAlt],
  "ceramic-set": [ProductCeramicSet, ProductCeramicSetAlt],
  "coffee-beans": [ProductCoffeeBeans, ProductCoffeeBeansAlt],
};

export {
  ProductLaptop,
  ProductPhone,
  ProductDress,
  ProductCoffeeBasket,
  ProductSneakers,
  ProductHeadset,
  ProductCeramicSet,
  ProductCoffeeBeans,
  PlaceholderProduct,
  PlaceholderShop,
  PlaceholderAvatar,
  PlaceholderCategory,
  EmptyCart,
  EmptyWishlist,
  EmptyOrders,
  NoProducts,
  NoResults,
  HeroMain,
  HeroMobile,
  PromoBanner,
  BannerSale,
  BannerSeller,
  BannerPromotion,
  BannerBestDeals,
  AuthLogin,
  AuthRegister,
  AuthSellerLogin,
  AuthSellerRegister,
};