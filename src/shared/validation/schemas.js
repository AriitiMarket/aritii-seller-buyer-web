/**
 * Gap 10: Shared Validation Schemas
 * Centralized form validation for frontend
 * Uses Zod for type-safe schema definition
 */

import { z } from 'zod';

// Common base schemas
const BaseSchemas = {
  // User
  user: {
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(2, 'First name required'),
    lastName: z.string().min(2, 'Last name required'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    profilePicture: z.string().url().optional()
  },

  // Address
  address: {
    street: z.string().min(5, 'Street address required'),
    city: z.string().min(2, 'City required'),
    region: z.string().min(2, 'Region required'),
    country: z.string().min(2, 'Country required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
    isDefault: z.boolean().optional()
  },

  // Product
  product: {
    name: z.string().min(3, 'Product name required'),
    description: z.string().min(20, 'Description too short'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category required'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    images: z.array(z.string().url()).min(1, 'At least one image required'),
    tags: z.array(z.string()).optional()
  },

  // Order
  order: {
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive()
      })
    ).min(1),
    shippingAddress: z.string().min(1),
    paymentMethod: z.string().min(1)
  },

  // Shop
  shop: {
    name: z.string().min(3, 'Shop name required'),
    description: z.string().min(10, 'Description required'),
    category: z.string().min(1, 'Category required'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone'),
    email: z.string().email(),
    location: z.object({
      lat: z.number(),
      lng: z.number()
    })
  },

  // Review
  review: {
    rating: z.number().int().min(1).max(5),
    title: z.string().min(5, 'Title too short'),
    content: z.string().min(20, 'Review too short'),
    productId: z.string()
  }
};

/**
 * Schema factory for creating validation schemas
 */
export function createFormSchema(fields) {
  return z.object(fields);
}

/**
 * Complete domain schemas
 */
export const ValidationSchemas = {
  // Auth
  auth: {
    login: createFormSchema({
      email: BaseSchemas.user.email,
      password: BaseSchemas.user.password
    }),
    register: createFormSchema({
      email: BaseSchemas.user.email,
      password: BaseSchemas.user.password,
      firstName: BaseSchemas.user.firstName,
      lastName: BaseSchemas.user.lastName
    }),
    resetPassword: createFormSchema({
      email: BaseSchemas.user.email
    })
  },

  // User profile
  profile: {
    update: createFormSchema({
      firstName: BaseSchemas.user.firstName,
      lastName: BaseSchemas.user.lastName,
      phone: BaseSchemas.user.phone,
      profilePicture: BaseSchemas.user.profilePicture
    })
  },

  // Addresses
  address: {
    create: createFormSchema(BaseSchemas.address),
    update: createFormSchema(BaseSchemas.address)
  },

  // Products
  product: {
    create: createFormSchema(BaseSchemas.product),
    update: createFormSchema(BaseSchemas.product),
    filter: createFormSchema({
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      category: z.string().optional(),
      search: z.string().optional()
    })
  },

  // Orders
  order: {
    create: createFormSchema(BaseSchemas.order)
  },

  // Shop
  shop: {
    create: createFormSchema(BaseSchemas.shop),
    update: createFormSchema(BaseSchemas.shop)
  },

  // Reviews
  review: {
    create: createFormSchema(BaseSchemas.review),
    update: createFormSchema({
      rating: BaseSchemas.review.rating,
      title: BaseSchemas.review.title,
      content: BaseSchemas.review.content
    })
  }
};

/**
 * Validate data against schema
 */
export function validate(schema, data) {
  return schema.safeParse(data);
}

/**
 * Format Zod errors for display
 */
export function formatErrors(zodErrors) {
  return zodErrors.reduce((acc, error) => {
    const path = error.path.join('.');
    acc[path] = error.message;
    return acc;
  }, {});
}

export default ValidationSchemas;
