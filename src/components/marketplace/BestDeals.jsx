import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestDeals = () => {

    const [data,setData]=useState([])


    const { allProducts, isLoading } = useSelector((state) => state.products);

    useEffect(()=>{
        const dddata = allProducts || [];
        const sortedData = [...dddata].sort((a,b) => {
            const aSold = a.sold_out ?? a.total_sell ?? 0;
            const bSold = b.sold_out ?? b.total_sell ?? 0;
            return bSold - aSold;
        });
        const firstFive = sortedData.slice(0,5);
        setData(firstFive);
    },[allProducts])


  return (
    <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
            <h1 className='text-center'>Best Deals</h1>
        </div>

        {isLoading && allProducts.length === 0 ? (
            <div className="text-center py-10 text-brand-muted">Loading deals&hellip;</div>
        ) : data && data.length !== 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {
            data && data.map((i,index)=>(
                <ProductCard data={i} key={index} />
            ))
        }
        
        </div>
        ) : (
            <div className="text-center py-10 text-brand-muted">
                No deals available yet.
            </div>
        )}
    </div>
  )
}

export default BestDeals