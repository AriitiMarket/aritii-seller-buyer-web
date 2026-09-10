import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from '../../styles/styles';
import ProductCard from '../../components/marketplace/ProductCard';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';


const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const shopData = searchParams.get("shop");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const productsSource = allProducts || [];
    if (categoryData !== null) {
      setData(productsSource.filter(i => (i.category || "").toLowerCase() === categoryData.toLowerCase()));
    } else if (shopData !== null) {
      setData(productsSource.filter(i => {
        const shopName = i?.shop?.name || i?.shopName || "";
        return shopName.toLowerCase() === shopData.toLowerCase();
      }));
    } else {
      const d = [...productsSource].sort((a, b) => {
        const aSold = a.sold_out ?? a.total_sell ?? 0;
        const bSold = b.sold_out ?? b.total_sell ?? 0;
        return aSold - bSold;
      });
      setData(d);
    }
    setLoaded(true);
  }, [allProducts, categoryData, shopData]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        {isLoading && !loaded && data.length === 0 ? (
          <div className="text-center py-10 text-brand-muted">Loading products&hellip;</div>
        ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        )}
        {data && data.length === 0 && !isLoading ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">
            No products found{categoryData ? ` in "${categoryData}"` : ""}!
          </h1>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
