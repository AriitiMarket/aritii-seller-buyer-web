import React from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import UserOrderDetailComponent from '../../components/profile/UserOrderDetailComponent'



//THIS IS THE PAGE THAT WILL APPEAR WHEN WE CLICK ORDERS IN /PROFILE PAGE
//THEN WHEN ORDERS ARE APPEARING AND THERE -> AHEAD OF EACH ORDER
//SO AFTER CLICKING THAT ARROW THIS PAGE WILL APPEAR AND PROVIDE DETAILS ABOUT THAT PAGE

const UserOrderDetailPage = () => {
  return (
    <div>
    <Header/>
    <UserOrderDetailComponent/>
    <Footer/>
    
  
  </div>
  )
}

export default UserOrderDetailPage