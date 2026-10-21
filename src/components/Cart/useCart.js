import React, { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cart.service';

/**
 * Reusable Cart Hook with error handling and loading states
 * Manages cart state, operations, and UI feedback
 */
export function useCart() {
  const [cart, setCart] = useState({ items: [], total: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemLoading, setItemLoading] = useState({});

  const clearError = useCallback(() => setError(null), []);

  // Fetch cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch (err) {
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const addItem = useCallback(
    async (productId, quantity = 1, options = {}) => {
      if (!productId) {
        setError('Product ID is required');
        return false;
      }

      setItemLoading((prev) => ({ ...prev, [productId]: true }));
      setError(null);

      try {
        const result = await cartService.addItem(productId, quantity, options);
        setCart((prev) => ({
          ...prev,
          items: result.items || [...prev.items, result.item].filter(Boolean),
          total: result.total || prev.total,
          subtotal: result.subtotal || prev.subtotal,
        }));
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setItemLoading((prev) => ({ ...prev, [productId]: false }));
      }
    },
    []
  );

  const removeItem = useCallback(async (itemId) => {
    if (!itemId) {
      setError('Item ID is required');
      return false;
    }

    setItemLoading((prev) => ({ ...prev, [itemId]: true }));
    setError(null);

    try {
      const result = await cartService.removeItem(itemId);
      setCart(result);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setItemLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    if (!itemId) {
      setError('Item ID is required');
      return false;
    }

    setItemLoading((prev) => ({ ...prev, [itemId]: true }));
    setError(null);

    try {
      if (quantity === 0) {
        return removeItem(itemId);
      }

      const result = await cartService.updateItem(itemId, quantity);
      setCart((prev) => ({
        ...prev,
        items: result.items || prev.items,
        total: result.total || prev.total,
        subtotal: result.subtotal || prev.subtotal,
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setItemLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }, [removeItem]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await cartService.clearCart();
      setCart({ items: [], total: 0, subtotal: 0 });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(async (checkoutData) => {
    if (!checkoutData) {
      setError('Checkout data is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await cartService.checkout(checkoutData);
      setCart({ items: [], total: 0, subtotal: 0 }); // Clear cart after success
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyCoupon = useCallback(async (code) => {
    if (!code) {
      setError('Promo code is required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cartService.applyCoupon(code);
      setCart((prev) => ({
        ...prev,
        total: result.total || prev.total,
        discount: result.discount || 0,
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await cartService.removeCoupon();
      setCart(result);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateCart = useCallback(async () => {
    try {
      const result = await cartService.validateCart();
      if (!result.valid) {
        setError(result.errors[0] || 'Cart validation failed');
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { valid: false, errors: [err.message] };
    }
  }, []);

  return {
    // State
    cart,
    loading,
    error,
    itemLoading,
    isEmpty: cart.items?.length === 0,
    itemCount: cart.items?.length || 0,

    // Actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    checkout,
    applyCoupon,
    removeCoupon,
    validateCart,
    clearError,
  };
}

/**
 * Cart Display Component - shows items and totals
 */
export function CartDisplay({ cart, itemLoading, onUpdateQuantity, onRemoveItem, error, onClearError }) {
  if (!cart?.items?.length) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-display">
      {error && (
        <div className="alert alert-error" onClick={onClearError} style={{ cursor: 'pointer' }}>
          {error} ✕
        </div>
      )}

      <div className="cart-items">
        {cart.items.map((item) => (
          <CartItem
            key={item._id || item.id}
            item={item}
            isLoading={itemLoading?.[item._id || item.id]}
            onUpdateQuantity={(qty) => onUpdateQuantity(item._id || item.id, qty)}
            onRemove={() => onRemoveItem(item._id || item.id)}
          />
        ))}
      </div>

      <CartSummary cart={cart} />
    </div>
  );
}

/**
 * Individual Cart Item Component
 */
function CartItem({ item, isLoading, onUpdateQuantity, _onRemove }) {
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) onUpdateQuantity(qty);
  };

  const price = item.discountPrice || item.originalPrice || 0;

  return (
    <div className="cart-item">
      <img src={item.images?.[0]?.url || item.images?.[0]} alt={item.name} className="cart-item-image" />

      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p className="shop-name">{item.shopName}</p>
        <p className="price">
          ${price.toFixed(2)} x {item.quantity}
        </p>
      </div>

      <div className="cart-item-actions">
        <select
          value={item.quantity || 1}
          onChange={handleQuantityChange}
          disabled={isLoading}
          className="quantity-select"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>

        <button
          onClick={() => onUpdateQuantity(0)}
          disabled={isLoading}
          className="btn-remove"
          title="Remove from cart"
        >
          {isLoading ? '...' : '✕'}
        </button>
      </div>

      <div className="cart-item-total">
        ${(price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

/**
 * Cart Summary Component - shows totals
 */
function CartSummary({ cart }) {
  const subtotal = cart.subtotal || 0;
  const discount = cart.discount || 0;
  const tax = cart.tax || 0;
  const total = cart.total || subtotal - discount + tax;

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="summary-row discount">
          <span>Discount:</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="summary-row">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
