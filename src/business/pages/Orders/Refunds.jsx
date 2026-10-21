import React from 'react';
import { Link } from 'react-router-dom';
import AllRefundOrders from '@/business/components/AllRefundOrders';

const BusinessRefundsPage = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refunds &amp; Returns</h1>
        <p className="text-sm text-gray-600 mt-1">
          Review orders with refund status and manage buyer return claims.
        </p>
      </div>
      <div>
        <Link
          to="/business/finance?tab=refund-management"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition"
        >
          Manage Refund Decisions →
        </Link>
      </div>
    </div>

    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <AllRefundOrders />
    </div>
  </div>
);

export default BusinessRefundsPage;