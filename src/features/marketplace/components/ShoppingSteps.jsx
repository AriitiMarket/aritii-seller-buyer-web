/**
 * ShoppingSteps - Shows how shopping works on the marketplace
 * Displays steps for buyers to follow orders from purchase to delivery
 */
import React from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

const ShoppingSteps = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#75d04b] flex items-center justify-center mx-auto mb-3">
            <AiOutlineClockCircle size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Place Order</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select products and add to cart</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#75d04b] flex items-center justify-center mx-auto mb-3">
            <AiOutlineClockCircle size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Track Delivery</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Follow your order status</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#75d04b] flex items-center justify-center mx-auto mb-3">
            <AiOutlineClockCircle size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Receive Goods</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get your order delivered</p>
        </div>
      </div>
    </div>
  )
}

export default ShoppingSteps