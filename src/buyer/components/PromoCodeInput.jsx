import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiPercent, FiX, FiCheck } from 'react-icons/fi';
import promotionService from '@/services/promotion.service';

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const PromoCodeInput = ({ cartItems, subtotal, onApply, onRemove, appliedPromotion }) => {
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setValidating(true);
    try {
      const result = await promotionService.validateCode(
        code.trim(),
        cartItems,
        subtotal
      );

      if (result.valid) {
        toast.success(`Promo code applied! You saved ${money(result.discountAmount)}`);
        onApply(result);
        setCode('');
        setExpanded(false);
      } else {
        toast.error(result.message || 'Invalid promo code');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid promo code';
      toast.error(message);
    } finally {
      setValidating(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    toast.info('Promo code removed');
  };

  if (appliedPromotion) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="text-green-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                {appliedPromotion.promotion?.title || 'Promo Applied'}
              </p>
              <p className="text-xs text-green-700">
                Code: {appliedPromotion.promotion?.code} • Save {money(appliedPromotion.discountAmount)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 p-1"
            title="Remove promo code"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <FiPercent className="text-gray-600" size={18} />
          <span className="text-sm font-medium text-gray-700">Have a promo code?</span>
        </div>
        <span className="text-xs text-gray-500">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2162a1] focus:border-transparent"
              disabled={validating}
            />
            <button
              type="submit"
              disabled={validating || !code.trim()}
              className="px-4 py-2 bg-[#2162a1] text-white rounded-lg text-sm font-semibold hover:bg-[#1a4d80] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validating ? 'Applying...' : 'Apply'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Enter a promo code to apply a discount to your order.
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
