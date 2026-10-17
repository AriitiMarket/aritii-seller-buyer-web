import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'

const Footer = () => {
  const footerLinks = {
    'Get to Know Us': [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press Releases', to: '/press' },
      { label: 'How It Works', to: '/how-it-works' },
    ],
    'Make Money with Us': [
      { label: 'Sell on Aritii', to: '/sell-on-aritii' },
      { label: 'Become a Seller', to: '/seller-registration' },
      { label: 'Open a Shop', to: '/sell-on-aritii' },
      { label: 'Become an Affiliate', to: '/affiliate' },
      { label: 'Advertise Your Products', to: '/advertise' },
      { label: 'Self-Publish with Us', to: '/publish' },
      { label: 'Delivery Partners', to: '/delivery' },
    ],
    'Payment Options': [
      { label: 'Aritii Gift Cards', to: '/gift-cards' },
      { label: 'Shop with Points', to: '/points' },
      { label: 'Reload Your Balance', to: '/reload' },
      { label: 'Payment Methods', to: '/payment-methods' },
    ],
    'Let Us Help You': [
      { label: 'Your Account', to: '/my-dashboard/profile' },
      { label: 'Your Orders', to: '/my-dashboard/orders' },
      { label: 'Shipping Rates & Policies', to: '/shipping' },
      { label: 'Delivery Rates & Policies', to: '/shipping' },
      { label: 'Returns & Replacements', to: '/returns' },
      { label: 'Manage Your Content', to: '/content' },
      { label: 'Help', to: '/help' },
    ],
  }

  return (
    <footer className="bg-[#141414] text-white" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <BrandLogo size="lg" showText={true} showTagline={true} linked={false} tone="light" className="mb-4" />
            <p className="market-body-sm text-gray-400 mb-6 max-w-xs">
              Ethiopia's trusted marketplace connecting local sellers with buyers nationwide. Shop securely, support local businesses, and discover amazing products.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:bg-market-surface-container transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Twitter" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:bg-market-surface-container transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="https://instagram.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on Instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:bg-market-surface-container transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com/aritii" target="_blank" rel="noopener noreferrer" aria-label="Aritii on YouTube" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center hover:bg-market-surface-container transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.167 3.167 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.167 3.167 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.167 3.167 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.123-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12 9.545 15.568z"/></svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="market-title-sm text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="market-body-sm text-gray-400 hover:text-[#75d04b] transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500">© {new Date().getFullYear()} Aritii Market. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="market-body-sm text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="market-body-sm text-gray-400 hover:text-white">Terms of Service</Link>
              <Link to="/cookie" className="market-body-sm text-gray-400 hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
