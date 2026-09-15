import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/marketplace/ProductCard";
import { ShopImage } from "../../components/common/ImageWithFallback";
import Ratings from "../../components/common/Ratings";
import { PlaceholderAvatar } from "../../assets";
import productService from "../../services/product.service";
import shopService from "../../services/shop.service";
import { resolveImageUrl } from "../../utils/image";

/**
 * Public Shop Details page.
 *
 * Displays a seller's public business profile plus the products of that
 * shop. NO login required. Only business-facing fields are rendered;
 * private/internal seller account data is never shown.
 */
const ShopDetailsPage = () => {
  const { id } = useParams();
  const { shops } = useSelector((state) => state.shop);

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let s = null;
        try {
          s = await shopService.getById(id);
        } catch {
          s = null;
        }
        // Fallback to the already-loaded marketplace shop list.
        if (!s && shops) s = shops.find((x) => x._id === id);
        setShop(s || null);
        setProducts(await productService.getByShop(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load this shop.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <Header activeHeading={4} />
        <div className="w-11/12 mx-auto py-24 text-center text-brand-muted">
          Loading shop…
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <Header activeHeading={4} />
        <div className="w-11/12 mx-auto py-24 text-center">
          <h2 className="text-2xl font-semibold text-brand-charcoal">Shop not found</h2>
          <p className="text-brand-muted mt-2">{error || "This shop is not available on Aritii Market."}</p>
          <Link to="/shops" className="mt-6 inline-block px-6 py-3 bg-brand-primary text-white rounded-lg font-medium">
            Back to Shops
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Public business fields only.
  const name = shop.name || "Aritii Shop";
  const avatarUrl = resolveImageUrl(shop.avatar) || (Array.isArray(shop.images) ? resolveImageUrl(shop.images[0]) : null) || null;
  const description = shop.description || "";
  const address = shop.address || "";
  const zipCode = shop.zipCode || "";
  const location = address && zipCode ? `${address}, ${zipCode}` : address;
  const phone = shop.phoneNumber || "";
  const rating = shop.ratings || shop.rating || 0;
  const ratingCount = shop.ratingCount || 0;

  return (
    <div className="bg-brand-cream min-h-screen">
      <Header activeHeading={4} />

      {/* Hero banner */}
      <div className="w-11/12 mx-auto mt-4">
        <div className="w-full h-[180px] rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent overflow-hidden" />

        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 flex flex-wrap md:flex-nowrap items-center gap-5 mt-[-70px] ml-0">
          <ShopImage
            data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url, image_Url: shop.avatar?.url }}
            fallback={PlaceholderAvatar}
            className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white shadow"
            alt={name}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-charcoal">{name}</h1>
            <div className="flex items-center mt-1">
              <Ratings rating={rating} />
              <span className="text-sm text-brand-muted ml-1">
                {ratingCount ? `(${ratingCount})` : "No reviews yet"}
              </span>
            </div>
            <p className="text-brand-muted mt-1">
              {description || `Official ${name} shop on Aritii Market.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-brand-charcoal">
              {location && (
                <span className="inline-flex items-center gap-1">
                  📍 {location}
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1">
                  ☎ {phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                🛍 {shop.productCount || products.length || 0} products
              </span>
            </div>
          </div>
        </div>

        {/* Shop products — grouped by category */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-4">
            Products from {name}
          </h2>
          {products.length > 0 ? (
            <GroupedProducts products={products} />
          ) : (
            <div className="text-center py-12 text-brand-muted">
              No products available from this shop yet.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

/**
 * Groups a shop's products by their category and renders each group under a
 * sub-heading so buyers can browse a shop's catalogue by category.
 */
const GroupedProducts = ({ products }) => {
  const groups = {};
  products.forEach((p) => {
    const cat = (p.category && p.category.trim()) || "Other";
    (groups[cat] = groups[cat] || []).push(p);
  });
  const ordered = Object.keys(groups);

  if (ordered.length <= 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((p, i) => <ProductCard data={p} key={p._id || i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {ordered.map((cat) => (
        <div key={cat}>
          <h3 className="text-lg font-semibold text-brand-charcoal flex items-center gap-2 border-b border-brand-border pb-2">
            {cat}
            <span className="text-xs text-brand-muted ml-1">({groups[cat].length})</span>
          </h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {groups[cat].map((p, i) => <ProductCard data={p} key={p._id || i} />)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopDetailsPage;