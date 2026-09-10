import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import ProductDetail from '../../components/marketplace/ProductDetail'
import Footer from '../../components/layout/Footer'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SuggestedProducts from '../../components/marketplace/SuggestedProducts'

const ProductsDetailPage = () => {

    const {name} = useParams();
    const { allProducts } = useSelector((state) => state.products);
    const { allEvents } = useSelector((state) => state.events);
    const [data,setData]=useState(null);


    // Finds the product from real backend allProducts/allEvents whose name matches the parameter.
    useEffect(()=>{
        const productsSource = allProducts || [];
        const eventsSource = allEvents || [];
        const combinedSource = [...productsSource, ...eventsSource];

        let foundProduct = combinedSource.find((item) => (item._id || item.id) === name);

        if (!foundProduct) {
            const productName = name.replace(/-/g, " ");
            foundProduct = combinedSource.find((item) => item.name.toLowerCase() === productName.toLowerCase());
        }

        setData(foundProduct);
    },[allProducts, allEvents, name])

  return (
    <div>
      <Header />
      <ProductDetail data={data} />
      {
        data && <SuggestedProducts data={data} />
      }
      <Footer/>
    </div>
  )
}

export default ProductsDetailPage