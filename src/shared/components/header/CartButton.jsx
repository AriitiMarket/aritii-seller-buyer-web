import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';

/**
 * CartButton — shared cart icon with badge count.
 *
 * Used by BuyerHeader.
 * Shows badge only when count > 0, caps at "99+".
 */
export default function CartButton({
  to = '/my-dashboard/cart',
  cart = [],
  className = '',
}) {
  const count = cart.reduce((total, item) => total + Number(item.quantity ?? 1), 0) || 0;

  return (
    <Link
      to={to}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 ${className}`}
      aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
    >
      <AiOutlineShoppingCart size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 bg-[#75d04b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
