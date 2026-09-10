import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar } from '../common/ImageWithFallback';
import { BiMessageSquareDetail, BiMenuAltLeft } from "react-icons/bi";

const DashboardHeader = ({ onMenuClick }) => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-40 flex items-center justify-between px-4 border-b border-brand">
      <div className="flex items-center gap-3">
        {/* Mobile: open the seller sidebar drawer */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open seller menu"
          className="800px:hidden flex items-center justify-center w-[40px] h-[40px] rounded-md bg-brand-primary/10 text-brand-primary"
        >
          <BiMenuAltLeft size={26} />
        </button>

        <Link to="/dashboard">
          <img
            src="/aritii-logo.svg"
            alt="Aritii Market"
            className="h-[44px] w-auto object-contain"
          />
        </Link>

        <span className="hidden 800px:inline-flex items-center gap-1 ml-1">
          <span className="text-sm font-[600] text-brand-primary">Seller Portal</span>
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex items-center mr-4">

          <Link to="/dashboard-coupons" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
            />
          </Link>

          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
            />
          </Link>

          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
            />
          </Link>

          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer hover:text-brand-primary" />
          </Link>

          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer hover:text-brand-primary"
            />
          </Link>

          {seller ? (
            <Link to={`/shop/${seller._id}`}>
              <Avatar
                data={seller}
                fallback="/logo192.png"
                alt={seller.name || "Seller"}
                className="w-[44px] h-[44px] rounded-full object-cover border-2 border-brand-primary"
              />
            </Link>
          ) : (
            <Link to="/login" className="800px:block hidden">
              <div className="w-[44px] h-[44px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1119.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;