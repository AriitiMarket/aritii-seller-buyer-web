/**
 * Canonical data models.
 *
 * This project is JavaScript-first, so the models are documented with JSDoc
 * typedefs instead of TypeScript. Services and slices should reference these
 * names in their JSDoc so every domain agrees on one shape per concept
 * (`quantity` is used for cart line counts — never `qty` in NEW code).
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} [description]
 * @property {number} discountPrice     // Backend primary selling price
 * @property {number} [originalPrice]   // Backend original (pre-discount) price
 * @property {number} stock
 * @property {string[]} [images]
 * @property {string} [category]        // Free-text category name
 * @property {ShopRef} [shop]           // Embedded shop snapshot (NOT shopName)
 * @property {string} [shopId]
 * @property {string} [sellerId]
 * @property {number} [sold_out]
 * @property {number} [ratings]
 * @property {boolean} [isActive]
 * @property {boolean} [showOnPublic]   // Admin visibility flag for the public website
 * @property {boolean} [featured]      // Admin curated highlight
 * @property {number} [displayPriority]
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} title             // Backend uses 'title', NOT 'name'
 * @property {string} [slug]
 * @property {string} [description]
 * @property {'product'|'business'|'shop'|'event'} type
 * @property {'active'|'inactive'} status
 * @property {number} [sortOrder]
 * @property {number} [productCount]    // Added via aggregation
 */

/**
 * @typedef {Object} ShopRef
 * @property {string} _id
 * @property {string} name              // Backend uses 'name', NOT 'shopName'
 */

/**
 * @typedef {Object} Shop
 * @property {string} _id
 * @property {string} name              // Backend uses 'name', NOT 'shopName'
 * @property {string} [email]
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [phoneNumber]
 * @property {string} [zipCode]
 * @property {string} [ownerId]         // Identity Service user id
 * @property {string} [status]          // PENDING_APPROVAL|APPROVED|ACTIVE|SUSPENDED|INACTIVE
 * @property {string} [applicationId]   // Link to SellerApplication
 * @property {Object} [avatar]          // { public_id, url }
 * @property {Object} [locationSnapshot]
 * @property {number} [availableBalance]
 */

/**
 * @typedef {Object} CartItem
 * @property {string} _id        Product id
 * @property {string} name
 * @property {string} [image]
 * @property {number} price
 * @property {number} [discountPrice]
 * @property {number} quantity   Canonical line quantity
 * @property {string} [shopId]
 * @property {number} [stock]
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} Order
 * @property {string} _id
 * @property {string} [user]        Buyer id or populated buyer
 * @property {string} [shop]        Shop id
 * @property {OrderItem[]} cart
 * @property {number} totalPrice
 * @property {string} status
 * @property {string} [paymentStatus]
 * @property {Address} [shippingAddress]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} Address
 * @property {string} [_id]
 * @property {string} [country]
 * @property {string} [state]
 * @property {string} [city]
 * @property {string} [address1]
 * @property {string} [zipCode]
 * @property {string} [addressType]
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} [phoneNumber]
 * @property {string} [role]        BUYER | SELLER | DELIVERY_ACTOR | ADMIN
 * @property {Address[]} [addresses]
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Promotion
 * @property {string} _id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [banner]
 * @property {number} [discountPercent]
 * @property {string} [startsAt]
 * @property {string} [endsAt]
 * @property {boolean} [active]
 */

/**
 * @typedef {Object} MarketEvent
 * @property {string} _id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [banner]
 * @property {string} [startDate]
 * @property {string} [endDate]
 * @property {string} [location]
 * @property {boolean} [showOnPublic]
 */

/**
 * @typedef {Object} DeliveryProvider
 * @property {string} _id
 * @property {string} name
 * @property {'ARITII'|'EXTERNAL'} type
 */

/**
 * @typedef {Object} DeliveryAssignment
 * @property {string} _id
 * @property {string} orderId
 * @property {string} [riderId]
 * @property {DeliveryProvider} [provider]
 * @property {string} status
 * @property {string} [eta]
 */

export {};