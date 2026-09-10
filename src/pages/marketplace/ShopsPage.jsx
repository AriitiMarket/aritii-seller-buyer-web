import React from "react";
import { useSelector } from "react-redux";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ShopCard from "../../components/marketplace/ShopCard";

/**
 * Public "Shops" marketplace page.
 *
 * Displays all seller shops for buyer discovery. Sourced from the backend
 * via redux -> GET /shop/get-all-shops. Public, no login required.
 */
const ShopsPage = () => {
  const { shops, isLoading, error } = useSelector((state) => state.shop);

  return (
    <div className="bg-brand-cream min-h-screen">
      <Header activeHeading={4} />
      <br />
      <div className="w-11/12 mx-auto py-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
            Browse Shops on Aritii Market
          </h1>
          <p className="text-brand-muted mt-2 max-w-2xl mx-auto">
            Discover trusted sellers and the businesses behind the products
            you love — all in one marketplace.
          </p>
        </div>

        {isLoading && (!shops || shops.length === 0) ? (
          <div className="text-center py-16 text-brand-muted">
            Loading shops…
          </div>
        ) : shops && shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((s, i) => <ShopCard data={s} key={s._id || i} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-brand-muted">
            {error ? "Could not load shops. Please try again." : "No shops available yet. Be the first to sell on Aritii Market!"}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopsPage;