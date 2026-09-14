import React from "react";
import { AiFillFacebook, AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#1F2937] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-[#E5A93C] mb-3">Aritii Market</h3>
            <p className="text-gray-400 text-sm leading-6">
              Ethiopia's local marketplace connecting sellers, riders, and buyers.
            </p>
            <div className="flex gap-3 mt-4">
              <AiFillFacebook size={20} className="cursor-pointer text-gray-400 hover:text-[#E5A93C]" />
              <AiFillInstagram size={20} className="cursor-pointer text-gray-400 hover:text-[#E5A93C]" />
              <AiOutlineTwitter size={20} className="cursor-pointer text-gray-400 hover:text-[#E5A93C]" />
            </div>
          </div>

          {/* Quick Links */}
          <ul>
            <h4 className="font-semibold mb-3">Shop</h4>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/explore/products">Products</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/explore/shops">Shops</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/explore/categories">Categories</Link></li>
          </ul>

          {/* Company */}
          <ul>
            <h4 className="font-semibold mb-3">Company</h4>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/about">About Us</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/sell">Become a Seller</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/contact">Contact</Link></li>
          </ul>

          {/* Account */}
          <ul>
            <h4 className="font-semibold mb-3">Account</h4>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/login">Login</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/sign-up">Sign Up</Link></li>
            <li><Link className="text-gray-400 hover:text-[#E5A93C] text-sm" to="/my-dashboard/orders">My Orders</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 px-4 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Aritii Market. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
