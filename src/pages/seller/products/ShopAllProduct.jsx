import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import AllProductsOfASingleShop from '../../components/seller/AllProductsOfASingleShop'

// THIS PAGE WILL SHOW THOSE PRODUCTS THAT BELONG TO A PARTICULAR SHOP. SO WE WILL GET THE SHOP ID
//  FROM THE URL AND THEN FETCH ALL PRODUCTS OF THAT SHOP FROM THE BACKEND AND DISPLAY THEM ON THIS PAGE.

const ShopAllProduct = () => {
  return (
    <SellerLayout active={3}>
      <div className="w-full justify-center flex">
        <AllProductsOfASingleShop />
      </div>
    </SellerLayout>
  )
}

export default ShopAllProduct