import React, { useState } from 'react'
import { AiOutlineShop, AiOutlineDown } from 'react-icons/ai'

/**
 * SellerUtilityBar - Top utility bar for Seller Center
 * 
 * Amazon-style design featuring:
 * - Shop selector dropdown (mock for now)
 * - Quick actions
 * - Clean, minimal styling
 */
const SellerUtilityBar = () => {
  const [shopOpen, setShopOpen] = useState(false)
  
  // Mock shops data - would come from API in production
  const shops = [
    { id: 1, name: 'My Main Store', status: 'active' },
    { id: 2, name: 'Secondary Shop', status: 'active' },
    { id: 3, name: 'Test Store', status: 'inactive' },
  ]

  const [selectedShop, setSelectedShop] = useState(shops[0])

  return (
    <div className="h-10 bg-[#131921] border-b border-[#232f3e] text-[#CCCCCB] text-sm">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Shop Selector - Left */}
        <div className="relative">
          <button
            onClick={() => setShopOpen(!shopOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#232f3e] transition-colors"
            title="Select shop"
          >
            <AiOutlineShop size={16} />
            <span className="hidden sm:inline font-medium">{selectedShop.name}</span>
            <span className="sm:hidden text-xs">Shop</span>
            <AiOutlineDown size={12} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {shopOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
              <div className="py-1">
                {shops.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => {
                      setSelectedShop(shop)
                      setShopOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      selectedShop.id === shop.id
                        ? 'bg-[#FF9900]/10 text-[#FF9900] font-semibold'
                        : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{shop.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        shop.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {shop.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                <button className="text-xs font-medium text-[#FF9900] hover:text-[#E68A00] w-full text-left py-1">
                  + Add New Shop
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats - Right (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6 ml-auto text-xs">
          <div className="flex flex-col items-end">
            <span className="text-[#CCCCCB]">Today's Sales</span>
            <span className="font-semibold text-white">$1,250</span>
          </div>
          <div className="w-px h-5 bg-[#232f3e]" />
          <div className="flex flex-col items-end">
            <span className="text-[#CCCCCB]">Orders</span>
            <span className="font-semibold text-white">23</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerUtilityBar
