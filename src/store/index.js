import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@/store/slices/userSlice';
import { sellerReducer } from '@/store/slices/sellerSlice';
import { productReducer } from '@/store/slices/productSlice';
import { eventReducer } from '@/store/slices/eventSlice';
import { shopReducer } from '@/store/slices/shopSlice';
import { cartReducer } from '@/store/slices/cartSlice';
import { wishlistReducer } from '@/store/slices/wishlistSlice';
import { orderReducer } from '@/store/slices/orderSlice';

/**
 * Store — single Redux store for the whole application.
 *
 * Canonical state keys (never alias these with singular/plural variants):
 *   user      → authenticated account + buyer profile (auth state)
 *   seller    → approved business/seller capability for the same account
 *   products  → catalog products (platform wide, never `product`)
 *   events    → events (independent feature, never `event`)
 *   shop      → shops + categories (never `shops`/`categories` at root)
 *   cart      → cart lines
 *   wishlist  → wishlist lines
 *   order     → buyer + business orders
 *
 * Domain slices live in `src/store/slices/*Slice.js`, their async actions in
 * `src/store/slices/*Thunks.js`. `src/features/auth/authSlice.js` re-exports the
 * auth slice so the auth feature owns its public slice surface.
 */
const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    shop: shopReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});

export { Store };
export default Store;