import React from 'react'
import { Link } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { FiShoppingBag } from 'react-icons/fi'
import { FiPackage } from 'react-icons/fi'
import { AiOutlineFolderAdd } from 'react-icons/ai'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { VscNewFile } from 'react-icons/vsc'
import { CiMoneyBill } from 'react-icons/ci'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { HiOutlineReceiptRefund } from 'react-icons/hi'
import { CiSettings } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {AiOutlineGift} from 'react-icons/ai'


const DashboardSideBar = ({ active, onNavigate = () => {} }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      <div className="p-4 border-b border-brand mb-2">
        <h1 className="text-lg font-semibold text-brand-primary">Seller Portal</h1>
        <p className="text-xs text-brand-muted">Aritii Market</p>
      </div>



    {/*writing each item as a single item fo better readability */}

      <div className="w-full flex items-center p-4">
        <Link to="/dashboard" className="w-full flex items-center" onClick={onNavigate}>
          <RxDashboard
            size={30}
            color={`${active === 1 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 1 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>



        




        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-orders" className="w-full flex items-center" onClick={onNavigate}>
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 2 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>



        




        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-products" className="w-full flex items-center" onClick={onNavigate}>
          <FiPackage size={30} color={`${active === 3 ? "#0B6E4F" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 3 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            All Products
          </h5>
        </Link>
      </div>









        <div className="w-full flex items-center p-4">
        <Link
          to="/dashboard-create-product"
          className="w-full flex items-center" onClick={onNavigate}
        >
          <AiOutlineFolderAdd
            size={30}
            color={`${active === 4 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 4 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Create Product
          </h5>
        </Link>
      </div>









        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-events" className="w-full flex items-center" onClick={onNavigate}>
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 5 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            All Events
          </h5>
        </Link>
      </div>










        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-create-event" className="w-full flex items-center" onClick={onNavigate}>
          <VscNewFile
            size={30}
            color={`${active === 6 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 6 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Create Event
          </h5>
        </Link>
      </div>






        {/* <div className="w-full flex items-center p-4">
        <Link
          to="/dashboard-withdraw-money"
          className="w-full flex items-center" onClick={onNavigate}
        >
          <CiMoneyBill
            size={30}
            color={`${active === 7 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 7 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Withdraw Money
          </h5>
        </Link>
      </div> */}






        
        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-messages" className="w-full flex items-center" onClick={onNavigate}>
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 8 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Shop Inbox
          </h5>
        </Link>
      </div>





        
        <div className="w-full flex items-center p-4">
        <Link to="/dashboard-coupons" className="w-full flex items-center" onClick={onNavigate}>
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 9 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>







      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-refunds" className="w-full flex items-center" onClick={onNavigate}>
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 10 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Refunds
          </h5>
        </Link>
      </div>







        
        <div className="w-full flex items-center p-4">
        <Link to="/settings" className="w-full flex items-center" onClick={onNavigate}>
          <CiSettings
            size={30}
            color={`${active === 11 ? "#0B6E4F" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 11 ? "text-[#0B6E4F]" : "text-[#555]"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>












{/* ── Sidebar footer: return to marketplace / public shop / logout ── */}
      <div className="w-full flex items-center p-4 mt-4 border-t border-brand">
        <Link to="/" onClick={onNavigate} className="w-full flex items-center">
          <FiPackage size={30} color="#555" />
          <h5 className="hidden 800px:block pl-2 text-[16px] font-[400] text-[#555]">
            View Marketplace
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/shops"
          onClick={onNavigate}
          className="w-full flex items-center"
        >
          <FiShoppingBag size={30} color="#555" />
          <h5 className="hidden 800px:block pl-2 text-[16px] font-[400] text-[#555]">
            View Public Shops
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/settings?tab=logout"
          onClick={onNavigate}
          className="w-full flex items-center"
        >
          <BiMessageSquareDetail size={30} color="#C0392B" />
          <h5 className="hidden 800px:block pl-2 text-[16px] font-[400] text-[#C0392B]">
            Logout
          </h5>
        </Link>
      </div>
    </div>
  )
}

export default DashboardSideBar