import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ProductImage } from '@/components/common/ImageWithFallback';
import EmptyState from '@/components/common/EmptyState';
import { removeFromCart, updateCartQuantity, clearCart, fetchCart } from '@/store/slices/cartThunks';

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const BuyerCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart = [], isLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1) * Number(item.price || item.discountPrice || 0),
    0
  );
  const shipping = Math.round(subtotal * 0.03 * 100) / 100;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const setQty = (item, next) => {
    const productId = item.productId || item._id;
    if (next < 1) {
      dispatch(removeFromCart({ productId }));
    } else {
      dispatch(updateCartQuantity(productId, next));
    }
  };

  if (isLoading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#75d04b]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the marketplace and add items to your cart."
        action={
          <Link
            to="/my-dashboard/marketplace"
            className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-Poppins font-semibold">Cart</h1>
          <p className="text-sm text-brand-muted">{cart.length} item(s) in your cart</p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {cart.map((item) => {
            const qty = Number(item.quantity) || 1;
            const unit = Number(item.price || item.discountPrice || 0);
            const stock = Number(item.stock) || Infinity;
            return (
              <div key={item.productId || item._id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <ProductImage data={item} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category || 'Product'}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{money(unit)}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setQty(item, qty - 1)}
                    disabled={qty <= 1}
                    className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(item, qty + 1)}
                    disabled={qty >= stock}
                    className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>

                <div className="w-24 text-right shrink-0">
                  <p className="font-semibold text-gray-900">{money(unit * qty)}</p>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart({ productId: item.productId || item._id }))}
                  className="p-1.5 text-gray-400 hover:text-red-600 shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-fit">
          <h2 className="text-base font-bold text-gray-900 mb-4">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping (3%)</span>
              <span className="font-semibold text-gray-900">{money(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-brand-primary">{money(total)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Proceed to checkout
          </button>
          <Link
            to="/my-dashboard/marketplace"
            className="mt-2 block w-full text-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerCartPage;
