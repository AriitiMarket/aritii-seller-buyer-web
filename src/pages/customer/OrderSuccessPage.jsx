import React from "react";
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-[120px] h-[120px] rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
        <svg className="w-[60px] h-[60px] text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h5 className="text-center mb-4 text-[25px] text-brand-primary font-semibold">
        Your order is successful
      </h5>
      <p className="text-center mb-4 text-brand-muted">
        Thank you for shopping on Aritii Market.
      </p>
    </div>
  );
};

export default OrderSuccessPage;