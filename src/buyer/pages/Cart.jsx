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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20305C] mx-auto mb-4"></div>
          <p className="text-[#667085] text-sm">Loading your cart...</p>
        </div>
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
            className="inline-block px-5 py-2.5 bg-[#20305C] text-white rounded-lg font-semibold hover:bg-[#2C3F6E] transition"
          >
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">Shopping Cart</h1>
          <p className="text-sm text-[#667085] mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-[#667085] hover:text-red-600 transition font-medium"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm divide-y divide-gray-100">
          {cart.map((item) => {
            const qty = Number(item.quantity) || 1;
            const unit = Number(item.price || item.discountPrice || 0);
            const stock = Number(item.stock) || Infinity;
            const shopName = typeof item.shop === 'string' ? item.shop : item.shop?.name || item.shopName || 'Shop';

            return (
              <div key={item.productId || item._id} className="p-4 flex items-center gap-4 hover:bg-[#F7F8FA] transition">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <ProductImage data={item} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#171A21] line-clamp-1">{item.name}</p>
                  <p className="text-xs text-[#667085] mt-0.5">{shopName}</p>
                  <p className="text-sm font-semibold text-[#171A21] mt-1">{money(unit)}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setQty(item, qty - 1)}
                    disabled={qty <= 1}
                    className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#667085] hover:bg-gray-100 disabled:opacity-40 transition"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(item, qty + 1)}
                    disabled={qty >= stock}
                    className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#667085] hover:bg-gray-100 disabled:opacity-40 transition"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <div className="w-24 text-right shrink-0">
                  <p className="font-semibold text-[#171A21]">{money(unit * qty)}</p>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart({ productId: item.productId || item._id }))}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition"
                  aria-label={`Remove ${item.name}`}
                  title="Remove item"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 h-fit sticky top-20">
          <h2 className="text-base font-bold text-[#171A21] mb-4">Order summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#667085]">Subtotal</span>
              <span className="font-semibold text-[#171A21]">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Shipping (3%)</span>
              <span className="font-semibold text-[#171A21]">{money(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E5E7EB]">
            <span className="font-bold text-[#171A21]">Total</span>
            <span className="text-xl font-bold text-[#20305C]">{money(total)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full px-5 py-3 bg-[#20305C] text-white rounded-xl font-semibold hover:bg-[#2C3F6E] transition shadow-sm"
          >
            Proceed to checkout
          </button>
          <Link
            to="/my-dashboard/marketplace"
            className="mt-3 block w-full text-center px-5 py-3 border border-[#E5E7EB] text-[#171A21] rounded-xl text-sm font-semibold hover:bg-[#F7F8FA] transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerCartPage;
