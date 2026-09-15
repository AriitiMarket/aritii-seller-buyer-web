import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
// Auth Pages
import {LoginPage, SignUpPage, CreateShopPage, ShopLoginPage} from './routes/Routes.js'

// Public Marketplace
import {HomePage, NotFound} from './pages/public/index.js'

// Common Marketplace Pages
import {
  BestSellingPage,
  EventsPage,
  FAQpage,
  ProductsDetailPage,
  ProductsPage,
  ShopsPage,
  ProductDetailPage,
  ShopDetailsPage,
  ShopDetailPage,
  AboutPlatform,
  HowItWorks,
  ProductsMarketplace,
  ShopsMarketplace,
  CategoriesMarketplace,
  EventsMarketplace,
} from './pages/common/index.js'

// Buyer Pages
import {
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  UserOrderDetailPage,
  TrackOrderPage,
  UserInbox,
  CustomerAccountLayout,
  CustomerOverviewPage,
  CustomerProfilePage,
  CustomerOrdersPage,
  CustomerAddressesPage,
  CustomerWishlistPage,
  CustomerReviewsPage,
  CustomerSettingsPage,
  DashboardProductsBrowse,
  DashboardShopsBrowse,
} from './pages/buyer/index.js'

// Seller Pages
import {
  SellerDashboardPage,
  SellerStoreProfilePage,
  SellerStoreMetricsPage,
  SellerProductsPage,
  SellerCreateProductPage,
  SellerProductDetailPage,
  SellerEditProductPage,
  SellerOrdersPage,
  SellerOrderDetailPage,
  SellerOrderHistoryPage,
  SellerRefundsPage,
  SellerInventoryPage,
  SellerAnalyticsPage,
  SellerInboxPage,
  SellerCreateEventPage,
  SellerEventsPage,
  SellerCouponsPage,
  SellerSettingsPage,
  ShopHomePage,
  SellerApplicationPage,
} from './pages/seller/index.js'

// Business Account Pages (within unified dashboard)
import {
  BusinessProductsPage,
  BusinessOrdersPage,
  BusinessCreateProductPage,
  BusinessInventoryPage,
  BusinessAnalyticsPage,
} from './pages/customer/account/index.js'

import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Store from './store/redux/store.js'
import { loadUser } from './store/redux/actions/user.js'
import { useSelector } from 'react-redux'
import { loadSeller } from './store/redux/actions/user.js'
import { getAllProducts } from './store/redux/actions/product.js'
import { getAllEvents } from './store/redux/actions/event.js'
import { getAllShops, getAllCategories } from './store/redux/actions/shop.js'
import SellerAuthRoute from './routes/SellerAuthRoute.jsx'
import SellerStatusRoute from './routes/SellerStatusRoute.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import HomeRoute from './routes/HomeRoute.jsx'

// Boot-once guard so catalog + auth/account fetches happen exactly once per page
// load, not on every mount. In dev, React StrictMode (double-effects) and Vite
// fast-refresh remount the App and re-run effects, which would otherwise fire ~6
// requests per remount and rapidly exhaust the API gateway's rate limit (429s).
// Being module-level, this flag survives component remounts during fast-refresh.
let apiBooted = false;

const App = () => {

    const { loading } = useSelector((state) => state.user);
    const {isLoading, isSeller, seller} = useSelector((state) => state.seller);

  useEffect(() => {
    if (apiBooted) return;
    apiBooted = true;

    Store.dispatch(loadUser());   // Load current user (includes seller status)
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    Store.dispatch(getAllShops());
    Store.dispatch(getAllCategories());
    
    // Don't call loadSeller() here - it's called by SellerAuthRoute only when needed
  },[])


  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
    <Routes>
      {/* Home route: 
          - Unauthenticated users see the marketplace
          - Authenticated users are redirected based on seller status */}
      <Route path='/' element={<HomeRoute />} />
      
      <Route path='/login' element={<LoginPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='*' element={<NotFound />} />
      
      {/* Marketplace - public access */}
      <Route path="/marketplace" element={<ProductsPage/>} />
      <Route path="/products" element={<ProductsPage/>} />
      <Route path="/best-selling" element={<BestSellingPage/>} />
      <Route path="/events" element={<EventsPage/>} />
      <Route path="/faq" element={<FAQpage/>} />
      
      {/* NEW MARKETPLACE EXPLORE PAGES */}
      <Route path="/explore/products" element={<ProductsMarketplace/>} />
      <Route path="/explore/shops" element={<ShopsMarketplace/>} />
      <Route path="/explore/categories" element={<CategoriesMarketplace/>} />
      <Route path="/explore/events" element={<EventsMarketplace/>} />
      
      {/* NEW DETAIL PAGES */}
      <Route path="/product/:id" element={<ProductDetailPage/>} />
      <Route path="/shop/:id" element={<ShopDetailPage/>} />
      
      {/* NEW INFO PAGES */}
      <Route path="/about-platform" element={<AboutPlatform/>} />
      <Route path="/how-it-works" element={<HowItWorks/>} />
      <Route path="/shops" element={<ShopsPage/>} />
      <Route path="/shops/:id" element={<ShopDetailsPage/>} />
      <Route path='/product/:name' element={<ProductsDetailPage/>} />

      {/* /profile is folded into the dedicated Buyer Dashboard (/my-dashboard/profile)
          so buyers never see the marketplace header inside their account area. */}
      <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigate to="/my-dashboard/profile" replace />
            </ProtectedRoute>
          }
        />

      <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

      <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order/:id"
          element={
            <ProtectedRoute>
              <UserOrderDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />




{/* ===== UNIFIED DASHBOARD — one account, one dashboard ===== */}
        <Route
          path="/my-dashboard"
          element={
            <ProtectedRoute>
              <CustomerAccountLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<CustomerOverviewPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="addresses" element={<CustomerAddressesPage />} />
          <Route path="wishlist" element={<CustomerWishlistPage />} />
          <Route path="reviews" element={<CustomerReviewsPage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />

          {/* Browse marketplace within dashboard layout (with sidebar) */}
          <Route path="marketplace" element={<DashboardProductsBrowse />} />
          <Route path="shops" element={<DashboardShopsBrowse />} />

          {/* MY BUSINESS — seller-only features, shown in sidebar after approval */}
          <Route path="business/products" element={<BusinessProductsPage />} />
          <Route path="business/products/create" element={<BusinessCreateProductPage />} />
          <Route path="business/orders" element={<BusinessOrdersPage />} />
          <Route path="business/inventory" element={<BusinessInventoryPage />} />
          <Route path="business/analytics" element={<BusinessAnalyticsPage />} />
        </Route>

{/* ===== BUSINESS DASHBOARD (seller-only, after approval) ===== */}
        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerDashboardPage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/profile"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerStoreProfilePage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/products"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerProductsPage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/products/create"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerCreateProductPage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/orders"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerOrdersPage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/analytics"
          element={
            <ProtectedRoute>
              <SellerAuthRoute>
                <SellerAnalyticsPage />
              </SellerAuthRoute>
            </ProtectedRoute>
          }
        />

{/* ===== START SELLING / SELLER APPLICATION (unified account) ===== */}
        <Route
          path="/sell"
          element={<SellerApplicationPage />}
        />
        <Route
          path="/seller-application"
          element={<SellerApplicationPage />}
        />

      {/*   SHOP ROUTES — these are legacy aliases that now forward to the unified
            Aritii auth pages (one account). /create-shop -> seller onboarding
            (/sell) or register (/sign-up); /shop-login -> unified /login. */}
      <Route path='/create-shop' element={<CreateShopPage />} />

      <Route path='/shop-login' element={<ShopLoginPage />} />

      <Route path='/shop/:id' element={ 
          <SellerAuthRoute>
            <ShopHomePage/>
          </SellerAuthRoute>
        } />

      <Route
        path='/dashboard'
        element={
          <SellerAuthRoute>
            <SellerDashboardPage />
          </SellerAuthRoute>
        }
      />


      <Route
        path='/dashboard-create-product'
        element={
          <SellerAuthRoute>
            <SellerCreateProductPage />
          </SellerAuthRoute>
        }
      />

      <Route
        path='/dashboard-products'
        element={
          <SellerAuthRoute>
            <SellerProductsPage />
          </SellerAuthRoute>
        }
      />

      <Route
        path='/dashboard-product/:id'
        element={
          <SellerAuthRoute>
            <SellerProductDetailPage />
          </SellerAuthRoute>
        }
      />

      <Route
        path='/dashboard-edit-product/:id'
        element={
          <SellerAuthRoute>
            <SellerEditProductPage />
          </SellerAuthRoute>
        }
      />


      <Route
        path='/dashboard-create-event'
        element={
          <SellerAuthRoute>
            <SellerCreateEventPage />
          </SellerAuthRoute>
        }
      />



      <Route
        path='/dashboard-events'
        element={
          <SellerAuthRoute>
            <SellerEventsPage />
          </SellerAuthRoute>
        }
      />

      <Route
        path='/dashboard-promotions'
        element={
          <SellerAuthRoute>
            <SellerEventsPage />
          </SellerAuthRoute>
        }
      />


          <Route
            path='/dashboard-coupons'
            element={
              <SellerAuthRoute>
                <SellerCouponsPage />
              </SellerAuthRoute>
            }
          />


      <Route
            path='/dashboard-orders'
            element={
              <SellerAuthRoute>
                <SellerOrdersPage />
              </SellerAuthRoute>
            }
          />

        <Route
            path='/dashboard-refunds'
            element={
              <SellerAuthRoute>
                <SellerRefundsPage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/order/:id'
            element={
              <SellerAuthRoute>
                <SellerOrderDetailPage />
              </SellerAuthRoute>
            }
          />

        <Route
            path='/settings'
            element={
              <SellerAuthRoute>
                <SellerSettingsPage />
              </SellerAuthRoute>
            }
          />

        
        <Route
            path='/dashboard-messages'
            element={
              <SellerAuthRoute>
                <SellerInboxPage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/dashboard-store-profile'
            element={
              <SellerAuthRoute>
                <SellerStoreProfilePage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/dashboard-store-metrics'
            element={
              <SellerAuthRoute>
                <SellerStoreMetricsPage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/dashboard-order-history'
            element={
              <SellerAuthRoute>
                <SellerOrderHistoryPage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/dashboard-inventory'
            element={
              <SellerAuthRoute>
                <SellerInventoryPage />
              </SellerAuthRoute>
            }
          />

      <Route
            path='/dashboard-analytics'
            element={
              <SellerAuthRoute>
                <SellerAnalyticsPage />
              </SellerAuthRoute>
            }
          />
    


    
          


      </Routes>
    </BrowserRouter>
  )
}

export default App