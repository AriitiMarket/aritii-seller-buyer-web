import React from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CheckoutSteps from '../../components/checkout/CheckOutSteps'
import Checkout from '../../components/checkout/Checkout'


const CheckoutPage = () => {
  return (
    <div>
        <Header />
        <br />
        <br />
        <CheckoutSteps active={1} />
        <Checkout />
        <br />
        <br />
        <Footer />
    </div>
  )
}

export default CheckoutPage