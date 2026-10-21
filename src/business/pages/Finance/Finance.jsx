import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Revenue from '@/business/pages/Revenue/Revenue.jsx';
import Transactions from '@/business/pages/Transactions/Transactions.jsx';
import Payouts from '@/business/pages/Payments/PayoutsPage.jsx';
import PaymentAccounts from '@/business/pages/Payments/PaymentAccountsPage.jsx';
import RefundManagement from '@/business/pages/Payments/RefundManagementPage.jsx';
import Returns from '@/business/pages/Payments/ReturnsDashboardPage.jsx';
import Metrics from '@/business/pages/Payments/MetricsPage.jsx';

const tabs = [
  { id: 'revenue', label: 'Revenue', page: Revenue },
  { id: 'transactions', label: 'Transactions', page: Transactions },
  { id: 'payouts', label: 'Payouts', page: Payouts },
  { id: 'payment-accounts', label: 'Payment accounts', page: PaymentAccounts },
  { id: 'refund-management', label: 'Refund management', page: RefundManagement },
  { id: 'returns', label: 'Returns', page: Returns },
  { id: 'metrics', label: 'Metrics', page: Metrics },
];

export default function FinancePage() {
  const [params, setParams] = useSearchParams();
  const tabId = params.get('tab') || 'revenue';
  const activeTab = tabs.find((tab) => tab.id === tabId) || tabs[0];
  const Page = activeTab.page;

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === tabId)) setParams({ tab: 'revenue' }, { replace: true });
  }, [tabId, setParams]);

  return (
    <main className="min-w-0 w-full space-y-4 sm:space-y-6">
      <header className="px-1">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Finance</h1>
        <p className="mt-1 text-sm text-slate-500">Manage revenue, transactions, payouts, and payment settings.</p>
      </header>

      <nav aria-label="Finance sections" className="overflow-x-auto pb-1 scrollbar-none">
        <div role="tablist" className="inline-flex p-1 space-x-1 bg-gray-100/80 rounded-xl border border-gray-200/60 min-w-full sm:min-w-0">
          {tabs.map((tab) => {
            const selected = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setParams({ tab: tab.id })}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                  selected
                    ? 'bg-white text-blue-700 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <section role="tabpanel" aria-label={activeTab.label} className="min-w-0">
        <Page />
      </section>
    </main>
  );
}
