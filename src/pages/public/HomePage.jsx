import React from 'react'
import Header from '../../components/layout/Header'
import TopNotificationBar from '../../components/layout/TopNotificationBar'
import PromoBanner from '../../components/home/PromoBanner'
import Hero from '../../components/home/Hero'
import Categories from '../../components/home/Categories'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import PopularShops from '../../components/home/PopularShops'
import Promotions from '../../components/home/Promotions'
import HowItWorks from '../../components/home/HowItWorks'
import SellerCTA from '../../components/home/SellerCTA'
import Footer from '../../components/layout/Footer'

/**
 * Public Marketplace Home Page
 * Main landing page with featured content for both authenticated and unauthenticated users
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNotificationBar />
      <Header />
      <PromoBanner />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PopularShops />
      <Promotions />
      <HowItWorks />
      <SellerCTA />
      <Footer />
    </div>
  )
}

export default HomePage
