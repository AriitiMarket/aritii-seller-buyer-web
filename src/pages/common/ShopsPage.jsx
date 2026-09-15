import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ShopCard from "../../components/marketplace/ShopCard";
import shopService from "../../services/shop.service";

/**
 * Public "Shops" Marketplace Page
 *
 * Displays all seller shops for buyer discovery. Data sourced from:
 * 1. Redux store (shops) - bulk marketplace shops loaded on app init
 * 2. Backend API (shopService.getAll) - if store is empty
 * 
 * Public, no login required. Shows only business-facing shop information.
 * Private seller account data (email, balance, etc.) is never displayed.
 */
const ShopsPage = () => {
  const { shops: storeShops = [], isLoading: storeLoading, error: storeError } = useSelector((state) => state.shop || {});
  
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let shopsList = storeShops;

        // If no shops in store yet, fetch from backend
        if (!shopsList || shopsList.length === 0) {
          try {
            shopsList = await shopService.getAll();
          } catch (err) {
            shopsList = [];
            throw err;
          }
        }

        setShops(shopsList);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load shops");
        setShops([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeShops]);

  const isLoadingData = loading || (storeLoading && shops.length === 0);

  return (
    <div className="bg-brand-cream min-h-screen">
      <Header activeHeading={4} />
      <br />
      <div className="w-11/12 mx-auto py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
            Browse Shops on Aritii Market
          </h1>
          <p className="text-brand-muted mt-2 max-w-2xl mx-auto">
            Discover trusted sellers and the businesses behind the products
            you love — all in one marketplace.
          </p>
        </div>

        {isLoadingData ? (
          <div className="text-center py-16 text-brand-muted">
            Loading shops…
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop, index) => (
              <ShopCard data={shop} key={shop._id || index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-brand-muted">
            {error ? `Could not load shops: ${error}` : "No shops available yet. Be the first to sell on Aritii Market!"}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopsPage;