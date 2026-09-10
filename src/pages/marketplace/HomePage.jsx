import React from 'react'
import Header from '../../components/layout/Header'
import Hero from '../../components/marketplace/Hero'
import Categories from '../../components/marketplace/Categories'
import FeaturedProducts from '../../components/marketplace/FeaturedProducts'
import BestDeals from '../../components/marketplace/BestDeals'
import Sponsored from '../../components/marketplace/Sponsored'
import Events from '../../components/marketplace/Events'
import MarketplaceBenefits from '../../components/marketplace/MarketplaceBenefits'
import Footer from '../../components/layout/Footer'

const HomePage = () => {
  return (
    <div className="bg-brand-cream">
        <Header activeHeading={1} />
        <Hero />
        <Categories />
        <FeaturedProducts />
        <BestDeals />
        <Events />
        <Sponsored />
        <MarketplaceBenefits />
        <Footer />
    </div>
  )
}

export default HomePage