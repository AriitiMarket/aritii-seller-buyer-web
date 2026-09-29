import React, { useState } from "react";
import { AiFillFacebook, AiFillInstagram, AiOutlineTwitter, AiFillYoutube, AiOutlineLinkedin } from "react-icons/ai";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/common/BrandLogo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setMessage("Please enter a valid email address.");
      return;
    }
    
    setIsSubmitting(true);
    // TODO: Connect this to the actual newsletter subscription API
    setTimeout(() => {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#141414] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="mb-4">
              <BrandLogo size="sm" showText={true} showTagline={false} linked={false} />
            </div>
            <p className="text-gray-400 text-sm leading-6 mb-4">
              Ethiopia's trusted marketplace connecting local sellers with buyers nationwide. Shop securely, support local businesses, and discover amazing products.
            </p>
            <div className="flex gap-3 mb-4">
              <a href="https://facebook.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Facebook" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#75d04b] transition-colors">
                <AiFillFacebook size={18} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://instagram.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#75d04b] transition-colors">
                <AiFillInstagram size={18} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://twitter.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Twitter" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#75d04b] transition-colors">
                <AiOutlineTwitter size={18} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://youtube.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on YouTube" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#75d04b] transition-colors">
                <AiFillYoutube size={18} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://linkedin.com/company/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on LinkedIn" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#75d04b] transition-colors">
                <AiOutlineLinkedin size={18} className="text-gray-400 hover:text-white" />
              </a>
            </div>
            
            {/* Payment Methods */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">We Accept</p>
              <div className="flex gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-800 rounded">CBE Birr</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Telebirr</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Amole</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Cash</span>
              </div>
            </div>
          </div>

          {/* Column SHOP */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#75d04b]">Shop</h4>
            <ul className="space-y-2">
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/products">All Products</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/shops">All Shops</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/categories">Categories</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/deals">Today's Deals</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/best-selling">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Column EXPERIENCES */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#75d04b]">Experiences</h4>
            <ul className="space-y-2">
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/marketplace">Marketplace</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/sell-on-aritii">Sell on Aritii</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery">Delivery Services</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/how-it-works">How It Works</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Column SELLERS */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#75d04b]">For Sellers</h4>
            <ul className="space-y-2">
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/seller-sign-up">Become a Seller</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/seller-sign-up">Register as Seller</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/business">Seller Dashboard</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/sell-on-aritii">Sell on Aritii</Link></li>
            </ul>
          </div>

          {/* Column DELIVERY */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#75d04b]">Delivery</h4>
            <ul className="space-y-2">
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery">Delivery Services</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery#how-it-works">How It Works</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery#providers">For Providers</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery-sign-up">Join as a Delivery Provider</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/delivery#tracking">Delivery Tracking</Link></li>
            </ul>
          </div>

          {/* Column SUPPORT */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#75d04b]">Support</h4>
            <ul className="space-y-2">
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/login">Shared Login</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/how-it-works">How It Works</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/about">About Us</Link></li>
              <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Aritii Market. All rights reserved.
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <Link className="hover:text-[#75d04b] transition-colors" to="/privacy">Privacy Policy</Link>
              <Link className="hover:text-[#75d04b] transition-colors" to="/terms">Terms of Service</Link>
              <Link className="hover:text-[#75d04b] transition-colors" to="/cookie">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
