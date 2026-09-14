import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from '../../styles/styles';
import ProductCard from '../../components/marketplace/ProductCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import productService from '../../services/product.service';

/**
 * Public Products Page
 * 
 * Displays all marketplace products with optional filtering by:
 * - category: Filter products by category
 * - shop: Filter products by seller shop
 * 
 * Data sourced from Redux store (allProducts) which is hydrated from
 * the backend via GET /product/get-all-products.
 * No login required. Shows only public product data.
 */
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const shopData = searchParams.get("shop");
  
  const { allProducts = [], isLoading = false } = useSelector((state) => state.products || {});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        let productsSource = allProducts || [];

        // If no products in store yet, try to fetch from backend
        if (!productsSource || productsSource.length === 0) {
          try {
            productsSource = await productService.getAll();
          } catch {
            productsSource = [];
          }
        }

        // Apply filters based on query params
        let filtered = productsSource;

        if (categoryData) {
          filtered = productsSource.filter(
            (p) => (p.category || "").toLowerCase() === categoryData.toLowerCase()
          );
        } else if (shopData) {
          filtered = productsSource.filter((p) => {
            const shopName = p?.shop?.name || p?.shopName || p?.shop || "";
            return shopName.toLowerCase() === shopData.toLowerCase();
          });
        } else {
          // Default: sort by popularity (sold count, descending)
          filtered = [...productsSource].sort((a, b) => {
            const aSold = a.sold_out ?? a.total_sell ?? 0;
            const bSold = b.sold_out ?? b.total_sell ?? 0;
            return bSold - aSold; // Descending order
          });
        }

        setData(filtered);
      } catch (err) {
        setError(err.message || "Could not load products");
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [allProducts, categoryData, shopData]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        {(loading || (isLoading && data.length === 0)) ? (
          <div className="text-center py-10 text-brand-muted">
            Loading products…
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data.map((product, index) => (
              <ProductCard data={product} key={product._id || index} />
            ))}
          </div>
        ) : (
          <h1 className="text-center w-full pb-[100px] text-[20px] text-brand-muted">
            No products found{categoryData ? ` in "${categoryData}"` : ""}!
            {error && <p className="text-sm mt-2">{error}</p>}
          </h1>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
