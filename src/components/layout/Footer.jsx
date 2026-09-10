import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from '../../data/data';

const Footer = () => {
  const { isAuthenticated } = useSelector((s) => s.user);
  const { isSeller } = useSelector((s) => s.seller);

  // Role-aware account/dashboard links:
  //  - Buyer logged in          -> their buyer dashboard
  //  - Seller logged in         -> their seller dashboard
  //  - Guest                    -> login / sign up / become a seller
  return (
    <div className="bg-brand-charcoal text-white">
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-brand-primary mb-5 py-7">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
          <span className="text-brand-accent">Subscribe</span> for news,{" "}
          <br />
          events and offers
        </h1>
        <div>
          <input
            type="text"
            required
            placeholder="Enter your email..."
            className="text-brand-charcoal
                sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
          />
          <button className="bg-brand-accent hover:bg-brand-accent/90 duration-300 px-5 py-2.5 rounded-md text-brand-charcoal md:w-auto w-full font-semibold">
            Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:px-12 px-6 mt-5 pb-5">

        <div className="text-center sm:text-start">
          <h3 className="mb-4 text-lg font-semibold text-brand-accent">Aritii Market</h3>
          <p className="text-gray-400 text-sm leading-6">
            A multi-vendor marketplace connecting trusted local sellers with
            customers across the region.
          </p>
          <div className="flex gap-4 mt-4 justify-center sm:justify-start">
            <AiFillFacebook size={22} className="cursor-pointer text-gray-400 hover:text-brand-accent" />
            <AiFillInstagram size={22} className="cursor-pointer text-gray-400 hover:text-brand-accent" />
            <AiOutlineTwitter size={22} className="cursor-pointer text-gray-400 hover:text-brand-accent" />
            <AiFillYoutube size={22} className="cursor-pointer text-gray-400 hover:text-brand-accent" />
          </div>
        </div>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-brand-accent duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-brand-accent duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-brand-accent duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">My Account</h1>
          {isSeller ? (
            <li>
              <Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/dashboard">Seller Dashboard</Link>
            </li>
          ) : isAuthenticated ? (
            <li>
              <Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/my-dashboard">My Dashboard</Link>
            </li>
          ) : (
            <>
              <li><Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/login">Login</Link></li>
              <li><Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/sign-up">Create Account</Link></li>
            </>
          )}
          <li>
            {isSeller
              ? <Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/dashboard-create-product">Add Product</Link>
              : <Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/sell">Become a Seller</Link>}
          </li>
          <li><Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/my-dashboard/orders">My Orders</Link></li>
          <li><Link className="text-gray-400 hover:text-brand-accent duration-300 text-sm cursor-pointer leading-6" to="/shops">Browse Shops</Link></li>
        </ul>
      </div>

      <div className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Aritii Market. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;