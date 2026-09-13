import React from 'react'
import { Link } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { FiShoppingBag, FiPackage, FiClock } from 'react-icons/fi'
import { AiOutlineFolderAdd, AiOutlineGift } from 'react-icons/ai'
import { MdOutlineStorefront, MdOutlineLocalOffer } from 'react-icons/md'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { HiOutlineReceiptRefund, HiOutlineChartBar } from 'react-icons/hi'
import { CiSettings } from 'react-icons/ci'
import { BsChevronDown } from 'react-icons/bs'

/**
 * Modular seller sidebar grouped by domain. Active item is highlighted.
 * Uses the same Aritii brand colors as the rest of the portal.
 */
const Item = ({ to, icon: Icon, label, active, match, onNavigate = () => {} }) => (
  <div className="w-full flex items-center p-3">
    <Link to={to} className="w-full flex items-center" onClick={onNavigate}>
      <Icon size={26} color={match ? '#0B6E4F' : '#555'} />
      <h5
        className={`hidden 800px:block pl-2 text-[15px] font-[400] ${match ? 'text-[#0B6E4F]' : 'text-[#555]'}`}
      >
        {label}
      </h5>
    </Link>
  </div>
)

const Section = ({ title, children }) => (
  <div className="border-t border-gray-100 pt-1">
    <p className="hidden 800px:block px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-brand-muted">
      {title}
    </p>
    {children}
  </div>
)

const SellerSidebar = ({ active, onNavigate = () => {} }) => {
  const m = (n) => active === n
  return (
    <div className="w-full max-h-[90vh] bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10">
      <div className="p-4 border-b border-brand mb-1">
        <h1 className="text-lg font-semibold text-brand-primary">Seller Portal</h1>
        <p className="text-xs text-brand-muted">Aritii Market</p>
      </div>

      <Item to="/dashboard" icon={RxDashboard} label="Dashboard" match={m(1)} onNavigate={onNavigate} />
      <Item to="/dashboard-orders" icon={FiShoppingBag} label="All Orders" match={m(2)} onNavigate={onNavigate} />
      <Item to="/dashboard-products" icon={FiPackage} label="All Products" match={m(3)} onNavigate={onNavigate} />

      <Section title="Store">
        <Item to="/settings" icon={MdOutlineStorefront} label="Store Profile" match={m(11)} onNavigate={onNavigate} />
        <Item to="/dashboard-store-metrics" icon={HiOutlineChartBar} label="Store Analytics" match={m(12)} onNavigate={onNavigate} />
      </Section>

      <Section title="Products">
        <Item to="/dashboard-create-product" icon={AiOutlineFolderAdd} label="Add Product" match={m(4)} onNavigate={onNavigate} />
        <Item to="/dashboard-inventory" icon={FiClock} label="Inventory / Stock" match={m(13)} onNavigate={onNavigate} />
      </Section>

      <Section title="Orders">
        <Item to="/dashboard-order-history" icon={FiShoppingBag} label="Order History" match={m(14)} onNavigate={onNavigate} />
        <Item to="/dashboard-refunds" icon={HiOutlineReceiptRefund} label="Refunds" match={m(10)} onNavigate={onNavigate} />
      </Section>

      <Section title="Customer">
        <Item to="/dashboard-messages" icon={BiMessageSquareDetail} label="Shop Inbox" match={m(8)} onNavigate={onNavigate} />
      </Section>

      <Section title="Promotions">
        <Item to="/dashboard-create-event" icon={MdOutlineLocalOffer} label="Create Event" match={m(6)} onNavigate={onNavigate} />
        <Item to="/dashboard-events" icon={AiOutlineGift} label="All Events" match={m(5)} onNavigate={onNavigate} />
        <Item to="/dashboard-coupons" icon={AiOutlineGift} label="Discount Codes" match={m(9)} onNavigate={onNavigate} />
      </Section>

      <Section title="Account">
        <Item to="/settings" icon={CiSettings} label="Settings" match={m(11)} onNavigate={onNavigate} />
      </Section>

{/* ── Buyer Features: Access buyer dashboard while in seller portal ── */}
      <Section title="Buyer Features">
        <Item to="/my-dashboard/profile" icon={FiShoppingBag} label="My Buyer Profile" onNavigate={onNavigate} />
        <Item to="/my-dashboard/orders" icon={FiPackage} label="My Purchases" onNavigate={onNavigate} />
        <Item to="/my-dashboard/wishlist" icon={AiOutlineGift} label="My Wishlist" onNavigate={onNavigate} />
        <Item to="/my-dashboard/addresses" icon={CiSettings} label="My Addresses" onNavigate={onNavigate} />
      </Section>

{/* ── Sidebar footer: return to marketplace / public shop / logout ── */}
      <div className="w-full flex items-center p-3 mt-2 border-t border-brand">
        <Link to="/marketplace" onClick={onNavigate} className="w-full flex items-center">
          <FiShoppingBag size={26} color="#555" />
          <h5 className="hidden 800px:block pl-2 text-[15px] font-[400] text-[#555]">
            Marketplace
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-3">
        <Link to="/shops" onClick={onNavigate} className="w-full flex items-center">
          <MdOutlineStorefront size={26} color="#555" />
          <h5 className="hidden 800px:block pl-2 text-[15px] font-[400] text-[#555]">
            View All Shops
          </h5>
        </Link>
      </div>
    </div>
  )
}

export default SellerSidebar