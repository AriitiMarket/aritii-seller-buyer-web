import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from '../../styles/styles';
import ProductCard from '../../components/marketplace/ProductCard';

import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';


const BestSellingPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    const productsSource = allProducts || [];
    const sortedData = [...productsSource].sort((a, b) => {
      const aSold = a.sold_out ?? a.total_sell ?? 0;
      const bSold = b.sold_out ?? b.total_sell ?? 0;
      return bSold - aSold;
    });
    setData(sortedData);
  }, [allProducts]);


  return (
    <div>
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        {isLoading && data.length === 0 ? (
          <div className="text-center py-10 text-brand-muted">Loading best sellers&hellip;</div>
        ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">

          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}

        </div>
        )}
        {data && data.length === 0 && !isLoading ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">No best sellers found!</h1>
        ) : null}
      </div>
      <Footer />
    </div>
  )
}

export default BestSellingPage