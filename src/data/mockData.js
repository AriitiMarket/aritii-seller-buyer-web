// ============================================================
// TEMPORARY MOCK / DEMO DATA — DO NOT USE IN PRODUCTION.
//
// These arrays were previously used to preview the UI before real
// backend endpoints existed. The frontend is now wired to real data:
//   - products   -> GET /product/get-all-products (commerce service)
//   - categories -> GET /category (commerce service)
//   - shops      -> GET /shop/get-all-shops (commerce service)
//
// NOTHING in src imports this file for production rendering.
// Delete this file once the backend is fully populated.
// ============================================================
// categories data
import { CATEGORY_IMAGES, PRODUCT_IMAGES, SHOP_IMAGES } from "../assets";

  export const categoriesData = [
  {
    id: 1,
    title: "Electronics",
    image_Url: CATEGORY_IMAGES["Electronics"],
  },
  {
    id: 2,
    title: "Fashion",
    image_Url: CATEGORY_IMAGES["Fashion"],
  },
  {
    id: 3,
    title: "Home & Living",
    image_Url: CATEGORY_IMAGES["Home & Living"],
  },
  {
    id: 4,
    title: "Beauty & Personal Care",
    image_Url: CATEGORY_IMAGES["Beauty & Personal Care"],
  },
  {
    id: 5,
    title: "Groceries & Food",
    image_Url: CATEGORY_IMAGES["Groceries & Food"],
  },
  {
    id: 6,
    title: "Handcrafts & Local Products",
    image_Url: CATEGORY_IMAGES["Handcrafts & Local Products"],
  },
];

  
  // product Data
  export const productData = [
    {
      id: 1,
      category:"Electronics",
      name: "Aritii Smart Laptop — 256GB SSD, 8GB RAM, Late Model",
      description:
        "A dependable laptop for work, study, and entertainment. Ships with a 1-year local warranty and free delivery across the region. Trusted quality from verified Aritii Market sellers.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["laptop"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["laptop"][1]},
      ],
      shop: {
        name: "Aritii Electronics",
        description: "Certified electronics and gadgets from trusted regional sellers.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[0].avatar},
        ratings: 4.4,
      },
      price: 1099,
      discount_price: 1049,
      rating: 4,
      total_sell: 35,
      stock: 10,
    },
    {
      id: 2,
      category:"Electronics",
      name: "Aritii Smart Phone Pro — 256GB Storage, 8GB RAM",
      description:
        "A powerful smartphone with an excellent camera and all-day battery. Great value from a trusted local seller on Aritii Market.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["laptop"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["laptop"][1]},
      ],
      shop: {
        name: "Aritii Electronics",
        description: "Certified electronics and gadgets from trusted regional sellers.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[0].avatar},
        ratings: 4.6,
      },
      price: 899,
      discount_price: 849,
      rating: 5,
      total_sell: 80,
      stock: 12,
    },
    {
      id: 3,
      category:"Fashion",
      name: "Habesha Traditional Dress — Handwoven, Multiple Sizes",
      description:
        "Beautifully handcrafted traditional attire, perfect for celebrations and special occasions. Made with care by local artisans.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["phone"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["phone"][1]},
      ],
      shop: {
        name: "Habesha Fashion",
        description: "Traditional and modern fashion for every occasion.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[1].avatar},
        ratings: 4.8,
      },
      price: 160,
      discount_price: 140,
      rating: 5,
      total_sell: 75,
      stock: 8,
    },
    {
      id: 4,
      category:"Handcrafts & Local Products",
      name: "Handwoven Local Coffee Basket — Natural Fiber",
      description:
        "A beautiful handwoven basket, perfect for serving traditional coffee. A unique gift that supports local craftspeople.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["dress"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["dress"][1]},
      ],
      shop: {
        name: "Local Crafts Ethiopia",
        description: "Beautiful handcrafted goods made by local artisans.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[5].avatar},
        ratings: 4.7,
      },
      price: 100,
      discount_price: 79,
      rating: 4,
      total_sell: 62,
      stock: 10,
    },
    {
      id: 5,
      category:"Fashion",
      name: "Modern Comfort Sneakers — All Sizes Available",
      description:
        "Stylish and comfortable sneakers for everyday wear. Available in all sizes with fast delivery across the region.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["coffee-basket"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["coffee-basket"][1]},
      ],
      shop: {
        name: "East Market Store",
        description: "Everyday essentials at honest prices from local suppliers.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[2].avatar},
        ratings: 4.3,
      },
      price: 120,
      discount_price: 89,
      rating: 5,
      total_sell: 49,
      stock: 15,
    },
    {
      id: 6,
      category:"Electronics",
      name: "Wireless Gaming Headset — Multi-Color, Free Delivery",
      description:
        "Immersive sound for gaming, music, and calls. Comfortable ear cups and a reliable wireless connection.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["sneakers"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["sneakers"][1]},
      ],
      shop: {
        name: "Aritii Electronics",
        description: "Certified electronics and gadgets from trusted regional sellers.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[0].avatar},
        ratings: 4.5,
      },
      price: 300,
      discount_price: 239,
      rating: 4.5,
      reviews: [
        {
          user: {},
          comment: "Really comfortable and great sound!",
          rating: 5,
        },
      ],
      total_sell: 20,
      stock: 10,
    },
    {
      id: 7,
      category:"Home & Living",
      name: "Elegant Ceramic Dining Set — 12 Pieces",
      description:
        "Give your dining room a warm, modern look with this elegant ceramic set. Durable and dishwasher safe.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["headset"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["headset"][1]},
      ],
      shop: {
        name: "Addis Home & Living",
        description: "Everything you need to make your home comfortable and beautiful.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[3].avatar},
        ratings: 4.6,
      },
      price: 180,
      discount_price: 150,
      rating: 5,
      total_sell: 55,
      stock: 10,
    },
    {
      id: 8,
      category:"Groceries & Food",
      name: "Premium Roasted Coffee — 1kg, Whole Beans",
      description:
        "Rich, aromatic coffee roasted daily by local roasters. Fresh, flavourful, and delivered right to your door.",
      image_Url: [
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["ceramic-set"][0]},
        {
          public_id: "placeholder",
          url: PRODUCT_IMAGES["ceramic-set"][1]},
      ],
      shop: {
        name: "Oromia Fresh Market",
        description: "Fresh groceries and food products delivered daily.",
        shop_avatar: {
          public_id: "placeholder",
          url: SHOP_IMAGES[4].avatar},
        ratings: 4.9,
      },
      price: 45,
      discount_price: 38,
      rating: 5,
      total_sell: 120,
      stock: 20,
    },
  ];
