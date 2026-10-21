import React, { useState } from 'react';
import { FiFlag, FiZap, FiArrowUp, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderService from '@/business/services/orders.service';

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', icon: FiMinus, color: 'gray', bg: 'bg-gray-100 text-gray-700' },
  { value: 'normal', label: 'Normal', icon: FiFlag, color: 'blue', bg: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', icon: FiArrowUp, color: 'orange', bg: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', icon: FiZap, color: 'red', bg: 'bg-red-100 text-red-700' },
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
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${priority.bg}`}
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
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${priority.bg} hover:opacity-90 disabled:opacity-50`}
      >
        <Icon size={14} />
        <span>{priority.label}</span>
        {!compact && <FiArrowUp size={12} className="ml-1" />}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handlePriorityChange(level.value)}
              disabled={isLoading || level.value === currentPriority}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition ${
                level.value === currentPriority ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              <level.icon size={14} className={`text-${level.color}-600`} />
              <span className="capitalize">{level.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPriorityBadge;
