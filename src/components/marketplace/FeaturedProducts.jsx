import React from 'react'
import styles from '../../styles/styles'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const FeaturedProducts = () => {

  const { allProducts, isLoading } = useSelector((state) => state.products);

  return (
    
    <div className='mt-7'>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1 className='text-center'>Featured Products</h1>
        </div>

        {isLoading && allProducts.length === 0 ? (
          <div className="text-center py-10 text-brand-muted">Loading products&hellip;</div>
        ) : allProducts && allProducts.length !== 0 ? (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
               {allProducts.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
          
        ) : (
            <div className="text-center py-10 text-brand-muted">
              No products available yet.
            </div>
        )}
     </div>
    </div>
  )
}

export default FeaturedProducts