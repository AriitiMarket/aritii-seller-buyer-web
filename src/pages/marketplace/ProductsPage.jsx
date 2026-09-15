import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import styles from '../../styles/styles';
import ProductCard from '../../components/marketplace/ProductCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import productService from '../../services/product.service';
import { MdRefresh, MdOutlineStorefront } from 'react-icons/md';

/**
 * Public Products Page — full marketplace product listing.
 *
 * Fetches ALL products directly from the API (bypasses Redux race conditions).
 * Supports filtering by: category, shop, search query.
 * Shows all products by default with no limits.
 */
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const shopData = searchParams.get("shop");
  const searchQuery = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Always fetch fresh products from API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productService.getAllFresh();
        if (!cancelled) {
          setAllProducts(products || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load products");
          setAllProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter products when data or filters change
  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const shopName = (p?.shop?.name || p?.shopName || "").toLowerCase();
        const description = (p.description || "").toLowerCase();
        return name.includes(q) || category.includes(q) || shopName.includes(q) || description.includes(q);
      });
    }

    // Category filter
    if (categoryData) {
      filtered = filtered.filter(
        (p) => (p.category || "").toLowerCase() === categoryData.toLowerCase()
      );
    }

    // Shop filter
    if (shopData) {
      filtered = filtered.filter((p) => {
        const shopName = p?.shop?.name || p?.shopName || p?.shop || "";
        return shopName.toLowerCase() === shopData.toLowerCase();
      });
    }

    // Default sort by popularity
    if (!searchQuery && !categoryData && !shopData) {
      filtered.sort((a, b) => {
        const aSold = a.sold_out ?? a.total_sell ?? 0;
        const bSold = b.sold_out ?? b.total_sell ?? 0;
        return bSold - aSold;
      });
    }

    setData(filtered);
  }, [allProducts, categoryData, shopData, searchQuery]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getAllFresh();
      setAllProducts(products || []);
    } catch (err) {
      setError(err.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search: "${searchQuery}"` : categoryData ? categoryData : shopData ? shopData : "All Products"}
            </h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-1">{data.length} product{data.length !== 1 ? 's' : ''} found</p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <MdRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={handleRefresh} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">Try Again</button>
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data.map((product, index) => (
              <ProductCard data={product} key={product._id || index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MdOutlineStorefront className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium mb-2">
              {searchQuery ? "No products match your search" : "No products found"}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery ? "Try different keywords or browse all products" : "Check back later for new products"}
            </p>
            {searchQuery && (
              <Link to="/products" className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-block">
                Browse All Products
              </Link>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
