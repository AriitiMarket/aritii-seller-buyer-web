import React, { useEffect, useState } from 'react';
import { Button, Badge } from '@/components/common';
import { buyerService } from '@/services/buyer.service';
import { useToast } from '@/hooks/useToast';

export const ProductAvailabilityWidget = ({ productId, onAddToCart }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAvailability();
  }, [productId]);

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const result = await buyerService.checkProductAvailability(productId);
      setAvailability(result);
    } catch (err) {
      toast({ message: 'Failed to check availability', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-10 bg-gray-200 rounded" />;

  if (availability?.serviceError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">{availability.message}</p>
        <p className="text-red-600 text-sm mt-1">Not available in your area</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Regular Stock */}
      {availability?.available > 0 && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div>
            <p className="font-semibold text-green-900">In Stock</p>
            <p className="text-sm text-green-700">{availability.available} available</p>
          </div>
          <Button onClick={() => onAddToCart('STANDARD')} variant="success">
            Add to Cart
          </Button>
        </div>
      )}

      {/* Backorder Option */}
      {availability?.backorderAvailable && availability?.available === 0 && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div>
            <Badge variant="warning">Backorder Available</Badge>
            <p className="text-sm text-yellow-700 mt-2">
              {availability.backorderRemaining} backorders available
            </p>
          </div>
          <Button onClick={() => onAddToCart('BACKORDER')} variant="outline">
            Backorder Now
          </Button>
        </div>
      )}

      {/* Preorder Option */}
      {availability?.preorderAvailable && availability?.available === 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div>
            <Badge variant="info">Preorder Available</Badge>
            <p className="text-sm text-blue-700 mt-2">
              Available: {new Date(availability.preorderDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-600">
              Price: ${availability.preorderPrice}
            </p>
          </div>
          <Button onClick={() => onAddToCart('PREORDER')} variant="outline">
            Preorder
          </Button>
        </div>
      )}

      {/* Out of Stock */}
      {availability?.available === 0 &&
        !availability?.backorderAvailable &&
        !availability?.preorderAvailable && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Out of Stock</p>
            <p className="text-sm text-gray-500">
              This item is not available right now
            </p>
          </div>
        )}

      {/* Low Stock Warning */}
      {availability?.isLowStock && availability?.available > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm text-orange-700">
          ⚠️ Only {availability.available} left - order soon!
        </div>
      )}
    </div>
  );
};
