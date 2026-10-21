import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '@/services';

export default function PaymentReturn() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your payment with Chapa…');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const orderId = params.get('orderId');
    const txRef = params.get('txRef');
    if (!orderId || !txRef) {
      setFailed(true);
      setMessage('The payment return link is incomplete. Your order has not been marked paid.');
      return undefined;
    }
    paymentService.verifyChapaPayment(orderId, txRef)
      .then(() => {
        if (active) navigate(`/order/success?${new URLSearchParams({ orderId, sellerOrders: '1' })}`, { replace: true });
      })
      .catch((error) => {
        if (!active) return;
        setFailed(true);
        setMessage(error?.message || 'Chapa has not confirmed this payment. Your order remains unpaid.');
      });
    return () => { active = false; };
  }, [navigate, params]);

  return <main className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-5 text-center">
    <h1 className="text-xl font-semibold">{failed ? 'Payment not confirmed' : 'Checking payment'}</h1>
    <p role="status" className="max-w-lg">{message}</p>
    {failed && <Link className="text-market-primary underline" to="/my-dashboard/orders">View your orders</Link>}
  </main>;
}
