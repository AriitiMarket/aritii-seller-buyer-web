import React, { useState } from 'react';
import { FiFlag, FiZap, FiArrowUp, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderService from '@/features/seller/services/orders.service';

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', icon: FiMinus, colorClass: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'normal', label: 'Normal', icon: FiFlag, colorClass: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
  { value: 'high', label: 'High', icon: FiArrowUp, colorClass: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30' },
  { value: 'urgent', label: 'Urgent', icon: FiZap, colorClass: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30' },
];

/**
 * OrderPriorityBadge - Display and set order priority
 * 
 * @param {string} orderId - Order ID
 * @param {string} currentPriority - Current priority (low/normal/high/urgent)
 * @param {function} onPriorityChange - Callback when priority changes
 * @param {boolean} compact - Compact mode for table cells
 */
const OrderPriorityBadge = ({ 
  orderId, 
  currentPriority = 'normal', 
  onPriorityChange,
  compact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priority = PRIORITY_LEVELS.find(p => p.value === currentPriority) || PRIORITY_LEVELS[1];
  const Icon = priority.icon;

  const handlePriorityChange = async (newPriority) => {
    setIsLoading(true);
    setShowDropdown(false);
    try {
      await orderService.setOrderPriority(orderId, newPriority);
      toast.success(`Priority set to ${newPriority}`);
      onPriorityChange?.(newPriority);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update priority');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <span 
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${priority.bg}`}
        title={`Priority: ${priority.label}`}
      >
        <Icon size={12} />
        <span>{priority.label}</span>
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${priority.bg} hover:opacity-90 disabled:opacity-50`}
      >
        <Icon size={14} />
        <span>{priority.label}</span>
        {!compact && <FiArrowUp size={12} className="ml-1" />}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handlePriorityChange(level.value)}
              disabled={isLoading || level.value === currentPriority}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200 transition ${
                level.value === currentPriority ? 'bg-gray-100 dark:bg-gray-700 font-bold' : ''
              }`}
            >
              <level.icon size={14} className={level.colorClass} />
              <span className="capitalize">{level.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPriorityBadge;
