import React from 'react'
import Header from '../../components/layout/Header.jsx'
import Footer from '../../components/layout/Footer.jsx'
import Payment from '../../components/payment/Payment.jsx'
import CheckOutSteps from '../../components/checkout/CheckOutSteps.jsx'

const PaymentPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#f6f9fc]'>
       <Header />
       <br />
       <br />
       <CheckOutSteps active={2} />
       <Payment />
       <br />
       <br />
       <Footer />
    </div>
  )
}

export default PaymentPage