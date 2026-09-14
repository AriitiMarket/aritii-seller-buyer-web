# Frontend Services Reference

**Location:** `/frontend/src/services/`  
**Purpose:** Centralized API client layer for all backend communication

---

## 📋 Services Overview

All HTTP requests go through the services layer for consistency, error handling, and maintainability.

### Service Files

| File | Purpose |
|------|---------|
| `api.js` | Axios instance with interceptors |
| `auth.service.js` | User authentication |
| `product.service.js` | Product operations |
| `order.service.js` | Order management |
| `shop.service.js` | Shop operations |
| `cart.service.js` | Shopping cart |
| `wishlist.service.js` | Saved products |
| `address.service.js` | Delivery addresses |
| `index.js` | Exports all services |

---

## 🔐 API Service (api.js)

**Setup and configuration for all HTTP requests**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000/api'
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Features:**
- ✅ Auto-adds JWT token to all requests
- ✅ Handles 401 errors (expired sessions)
- ✅ Centralized error handling

---

## 👤 Auth Service (auth.service.js)

**User authentication and account management**

### Methods

```javascript
// Login
export const loginUser = async (email, password) => {
  const response = await api.post('/user/login-user', { email, password });
  return response.data;
};
// Returns: { user: {id, email, name, ...}, token: "jwt..." }

// Register
export const registerUser = async (userData) => {
  const response = await api.post('/user/create-user', userData);
  return response.data;
};
// Returns: { user: {...}, token: "jwt..." }

// Logout
export const logoutUser = async () => {
  const response = await api.post('/user/logout');
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/user/getuser');
  return response.data;
};

// Update profile
export const updateUserProfile = async (userData) => {
  const response = await api.put('/user/update-user-info', userData);
  return response.data;
};

// Upload avatar
export const updateUserAvatar = async (formData) => {
  const response = await api.put('/user/update-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

### Usage in Components

```javascript
import { loginUser } from '../services/auth.service';

const LoginPage = () => {
  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
};
```

---

## 📦 Product Service (product.service.js)

**Product browsing and management**

### Methods

```javascript
// Get all products
export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/product/get-all-products?${params}`);
  return response.data;
};
// Filters: { category, priceMin, priceMax, rating, search }

// Get product details
export const getProductDetail = async (productId) => {
  const response = await api.get(`/product/get-product/${productId}`);
  return response.data;
};

// Search products
export const searchProducts = async (query) => {
  const response = await api.get('/product/search', { params: { q: query } });
  return response.data;
};

// Create product (seller)
export const createProduct = async (formData) => {
  const response = await api.post('/product/create-product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Update product (seller)
export const updateProduct = async (productId, data) => {
  const response = await api.put(`/product/update-product/${productId}`, data);
  return response.data;
};

// Delete product (seller)
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/product/delete-product/${productId}`);
  return response.data;
};
```

### Usage with Redux

```javascript
// actions/product.js
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCTS_LOADING' });
    const data = await productService.getAllProducts();
    dispatch({ type: 'SET_ALL_PRODUCTS', payload: data });
  } catch (error) {
    dispatch({ type: 'PRODUCTS_ERROR', payload: error.message });
  }
};

// In component
import { useDispatch, useSelector } from 'react-redux';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { allProducts, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  return (
    <div>
      {loading ? <Loader /> : allProducts.map(p => <ProductCard product={p} />)}
    </div>
  );
};
```

---

## 📋 Order Service (order.service.js)

**Order creation and management**

### Methods

```javascript
// Create order
export const createOrder = async (orderData) => {
  const response = await api.post('/order/create-order', {
    items: orderData.items,        // [{ productId, quantity, price }]
    total: orderData.total,
    deliveryAddressId: orderData.addressId,
    paymentMethod: orderData.paymentMethod
  });
  return response.data;
};

// Get buyer's orders
export const getBuyerOrders = async (userId) => {
  const response = await api.get(`/order/get-all-orders/user/${userId}`);
  return response.data;
};

// Get seller's orders
export const getSellerOrders = async (sellerId) => {
  const response = await api.get(`/order/get-all-orders/shop/${sellerId}`);
  return response.data;
};

// Get order details
export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/order/${orderId}`);
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId, reason) => {
  const response = await api.post(`/order/cancel/${orderId}`, { reason });
  return response.data;
};

// Update order status (seller/admin)
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/order/${orderId}`, { status });
  return response.data;
};
```

### Usage Example

```javascript
// Create order flow
const CheckoutPage = () => {
  const handleCheckout = async () => {
    try {
      const order = await orderService.createOrder({
        items: cart.items,
        total: cartTotal,
        addressId: selectedAddress._id,
        paymentMethod: 'payment'
      });
      
      // Clear cart and redirect to success page
      dispatch(clearCart());
      navigate(`/order/success/${order.orderId}`);
    } catch (error) {
      toast.error('Order creation failed');
    }
  };
};
```

---

## 🏪 Shop Service (shop.service.js)

**Shop and seller information**

### Methods

```javascript
// Get all shops
export const getAllShops = async () => {
  const response = await api.get('/shop/get-all-shops');
  return response.data;
};

// Get shop details
export const getShopDetail = async (shopId) => {
  const response = await api.get(`/shop/get-shop-info/${shopId}`);
  return response.data;
};

// Create shop (after seller approval)
export const createShop = async (shopData) => {
  const response = await api.post('/shop/create-shop', shopData);
  return response.data;
};

// Update shop info (seller)
export const updateShop = async (shopId, data) => {
  const response = await api.put(`/shop/update-shop/${shopId}`, data);
  return response.data;
};

// Get shop products
export const getShopProducts = async (shopId) => {
  const response = await api.get(`/shop/${shopId}/products`);
  return response.data;
};
```

---

## 🛒 Cart Service (cart.service.js)

**Shopping cart management**

### Methods

```javascript
// Get cart
export const getCart = async (userId) => {
  const response = await api.get(`/cart/get-cart/${userId}`);
  return response.data;
};

// Add to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart/add-item', { productId, quantity });
  return response.data;
};

// Update cart item
export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.put('/cart/update-item', { cartItemId, quantity });
  return response.data;
};

// Remove from cart
export const removeFromCart = async (cartItemId) => {
  const response = await api.delete('/cart/remove-item', { 
    data: { cartItemId } 
  });
  return response.data;
};

// Clear cart
export const clearCart = async (userId) => {
  const response = await api.post('/cart/clear', { userId });
  return response.data;
};
```

### Redux Integration

```javascript
// Redux action
export const addToCart = (productId, quantity) => async (dispatch) => {
  try {
    const data = await cartService.addToCart(productId, quantity);
    dispatch({ type: 'ADD_TO_CART', payload: data });
    toast.success('Added to cart');
  } catch (error) {
    toast.error('Failed to add to cart');
  }
};
```

---

## ❤️ Wishlist Service (wishlist.service.js)

**Saved products**

### Methods

```javascript
// Get wishlist
export const getWishlist = async (userId) => {
  const response = await api.get(`/wishlist/get-wishlist/${userId}`);
  return response.data;
};

// Add to wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist/add-product', { productId });
  return response.data;
};

// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete('/wishlist/remove-product', {
    data: { productId }
  });
  return response.data;
};
```

---

## 📍 Address Service (address.service.js)

**Delivery address management**

### Methods

```javascript
// Get all addresses
export const getAddresses = async (userId) => {
  const response = await api.get('/address/list');
  return response.data;
};

// Add address
export const addAddress = async (addressData) => {
  const response = await api.post('/address/add', {
    addressType: addressData.type,      // 'Home', 'Office', 'Other'
    country: addressData.country,
    city: addressData.city,
    address1: addressData.address1,
    address2: addressData.address2,
    zipCode: addressData.zipCode
  });
  return response.data;
};

// Update address
export const updateAddress = async (addressId, data) => {
  const response = await api.put(`/address/${addressId}`, data);
  return response.data;
};

// Delete address
export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/address/${addressId}`);
  return response.data;
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  const response = await api.put(`/address/${addressId}/set-default`);
  return response.data;
};
```

### Usage in Address Manager

```javascript
import { addAddress, deleteAddress } from '../services/address.service';

const AddressesPage = () => {
  const handleAddAddress = async (formData) => {
    try {
      const result = await addAddress(formData);
      dispatch(updatUserAddress(result));
      toast.success('Address added');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (confirm('Delete this address?')) {
      try {
        await deleteAddress(addressId);
        dispatch(deleteUserAddress(addressId));
        toast.success('Address deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };
};
```

---

## 🔄 Common Patterns

### Error Handling

```javascript
try {
  const data = await productService.getAllProducts();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired
    redirectToLogin();
  } else if (error.response?.status === 403) {
    // Permission denied
    toast.error('You do not have permission');
  } else {
    toast.error(error.response?.data?.message || 'Something went wrong');
  }
}
```

### Loading States

```javascript
const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    productService.getAllProducts()
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  return <ProductGrid products={products} />;
};
```

### Pagination

```javascript
export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await api.get('/product/get-all-products', {
    params: { page, limit }
  });
  return response.data;
};

// Usage
const { data, total, pages } = await productService.getAllProducts(2, 20);
```

---

## 📊 Service Status Check

```javascript
// Check if API is reachable
export const checkAPI = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

// In App.jsx
useEffect(() => {
  checkAPI().then(isHealthy => {
    if (!isHealthy) {
      toast.error('API is not reachable');
    }
  });
}, []);
```

---

## 🚀 Best Practices

1. **Always use services** - Don't make direct axios calls in components
2. **Consistent error handling** - Use try/catch with proper error messages
3. **Redux for state** - Use Redux for global state, services for API
4. **Token management** - Interceptor handles JWT automatically
5. **Loading states** - Always show loader while fetching
6. **Type checking** - Use PropTypes or TypeScript for safety
7. **Caching** - Implement caching for frequently used data
8. **Retry logic** - Implement retry for failed requests

---

## 🐛 Debugging

```javascript
// Enable debugging in development
if (process.env.NODE_ENV === 'development') {
  api.interceptors.response.use(
    response => {
      console.log('[API Response]', response.config.url, response.data);
      return response;
    },
    error => {
      console.error('[API Error]', error.config.url, error.response?.data);
      return Promise.reject(error);
    }
  );
}
```

---

## 📝 Version

**Last Updated:** 2026-09-14  
**Status:** Active and maintained
