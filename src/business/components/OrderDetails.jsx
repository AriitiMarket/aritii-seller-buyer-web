import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import api from '@/services/api';
import { toast } from "react-toastify";
import { BsFillBagFill } from "react-icons/bs";
import styles from '@/styles/styles';
import { Link } from "react-router-dom";
import {
  ALLOWED_TRANSITIONS,
  normalizeStatus,
  nextStatusesFor,
  isRefundStatus,
} from '@/shared/utils/orderStatus';
import OrderDeliveryCard from '@/shared/components/OrderDeliveryCard';

const OrderDetails = () => {
  const { ShopOrders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  // `seller` is null until the store hydrates — a bare seller._id here used to
  // throw and blank the whole page.
  const sellerId = seller?._id;

  useEffect(() => {
    if (sellerId) dispatch(getAllOrdersOfShop(sellerId));
  }, [dispatch, sellerId]);

  const data = ShopOrders && ShopOrders.find((item) => item._id === id);
  // Legacy rows ('PENDING'/'CONFIRMED') are normalized so the seller sees the
  // right current state and gets the correct next-step options.
  const currentStatus = normalizeStatus(data?.status) || 'Processing';
  const isRefund = isRefundStatus(currentStatus);
  const nextStatuses = nextStatusesFor(currentStatus);

  const applyStatus = async (next) => {
    if (!next) {
      toast.error('Pick a status first');
      return;
    }
    setSubmitting(true);
    try {
      // Refund states are managed by the refund endpoint; every other status
      // goes through the transition-guarded status endpoint.
      if (isRefund) {
        await api.put(`/order/order-refund-success/${id}`, { status: next });
      } else {
        await api.put(`/order/update-order-status/${id}`, { status: next });
      }
      toast.success(next === 'Confirmed' ? 'Order accepted!' : 'Order updated!');
      if (sellerId) dispatch(getAllOrdersOfShop(sellerId));
      setStatus('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  const orderUpdateHandler = (e) => {
    if (e?.preventDefault) e.preventDefault();
    applyStatus(status || nextStatuses[0]);
  };

  if (!data) {
    return (
      <div className={`py-4 min-h-screen ${styles.section}`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-2 text-[25px]">Order Details</h1>
          </div>
          <Link to="/business/orders">
            <div
              className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
            >
              Order List
            </div>
          </Link>
        </div>
        <div className="w-full text-center py-20">
          <p className="text-[20px] text-[#00000084]">
            {isLoading ? 'Loading order…' : 'Order not found in your shop.'}
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        {/* The seller workspace lives under /business — the old
            /dashboard-orders path was never registered (404). */}
        <Link to="/business/orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Delivery (ORDER ↔ DELIVERY bridge). A seller is authorized to read the
          shipment of their OWN order, so this shows the courier state — and an
          honest explanation while the order is not handed over yet. */}
      <OrderDeliveryCard
        orderId={id}
        orderStatus={currentStatus}
        title="Delivery for this order"
        className="mt-6"
      />

      {/* order items */}
      <br />
      <br />
      {data &&
        (data.cart || []).map((item, index) => {
          // Order lines carry images as either ["url"] or [{ url }] — the old
          // `item.images[0].url` threw on a missing array.
          const image = Array.isArray(item.images)
            ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url)
            : (item.images?.url || item.image || '');
          return (
          <div className="w-full flex items-start mb-5" key={index}>
            <img
              src={image || ''}
              alt={item.name || ''}
              className="w-[80px] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                ETB {item.discountPrice ?? item.price} x {item.quantity ?? item.qty ?? 1}
              </h5>
            </div>
          </div>
          );
        })}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>ETB {data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full lg:flex items-center">
        <div className="w-full lg:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {[data?.shippingAddress?.address1, data?.shippingAddress?.address2]
              .filter(Boolean)
              .join(' ') || '—'}
          </h4>
          <h4 className=" text-[20px]">{data?.shippingAddress?.country}</h4>
          <h4 className=" text-[20px]">{data?.shippingAddress?.city}</h4>
          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full lg:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentStatus
              || (data?.paymentInfo?.status
                ? String(data.paymentInfo.status)
                : "Not Paid")}
          </h4>
          {data?.paymentInfo?.type && (
            <h4>Method: {data.paymentInfo.type}</h4>
          )}
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      <p className="pt-1 text-[16px] text-[#00000091]">
        Current: <span className="font-[600] text-[#000000c4]">{currentStatus}</span>
      </p>

      {/* Only transitions the backend actually accepts are offered — the old
          hard-coded list (Shipping / On the way / Received / ...) is not in the
          order state machine, so every update came back a 400. */}
      {nextStatuses.length > 0 ? (
        <select
          value={status || nextStatuses[0]}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {nextStatuses.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p className="pt-2 text-[16px] text-[#00000091]">
          This order has reached a final state — no further status changes allowed.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-5">
        {currentStatus === 'Processing' && (
          <div
            className={`${styles.button} !bg-[#75d04b] !rounded-[4px] text-white font-[600] !h-[45px] text-[18px] ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={() => applyStatus('Confirmed')}
          >
            {submitting ? 'Accepting…' : 'Accept Order'}
          </div>
        )}
        {nextStatuses.length > 0 && (
          <div
            className={`${styles.button} !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px] ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={orderUpdateHandler}
          >
            Update Status
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
