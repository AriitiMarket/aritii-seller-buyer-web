import React, { useCallback, useEffect, useState } from 'react';
import { deliveryService } from '@/services/delivery.service';

const money = (value) => `${Number(value || 0).toFixed(2)} ETB`;

export default function ProviderWallet() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState({ type: 'bank', bankName: '', accountName: '', accountNumber: '' });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const load = useCallback(async () => {
    const walletData = await deliveryService.getProviderWallet();
    setData(walletData);
    const savedAccount = walletData?.provider?.metadata?.payoutAccount;
    if (savedAccount) {
      setAccount({
        type: savedAccount.type || 'bank',
        bankName: savedAccount.bankName || '',
        accountName: savedAccount.accountName || '',
        accountNumber: savedAccount.accountNumber || '',
      });
    }
    return walletData;
  }, []);

  useEffect(() => {
    load().catch((err) => setError(err?.response?.data?.message || 'Could not load wallet')).finally(() => setLoading(false));
  }, [load]);

  const submitAccount = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      await deliveryService.saveProviderPayoutAccount(account);
      setNotice('Payout account saved. An administrator must verify it before you can request payment.');
      await load();
    } catch (err) { setError(err?.response?.data?.message || 'Could not save payout account'); }
    finally { setBusy(false); }
  };

  const submitPayout = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      await deliveryService.requestProviderPayout(Number(amount));
      setAmount(''); setNotice('Payout request sent for administrator approval.'); await load();
    } catch (err) { setError(err?.response?.data?.message || 'Could not request payout'); }
    finally { setBusy(false); }
  };

  const wallet = data?.wallet || {};
  return (
    <div className="space-y-6">
      <header><h1 className="text-2xl font-bold text-gray-900">Wallet & Earnings</h1><p className="mt-1 text-gray-600">Delivery earnings are held until they become available, then can be requested for payout.</p></header>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
      {loading && <p role="status" className="text-sm text-gray-500">Loading wallet…</p>}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Available', wallet.availableBalance], ['Pending', wallet.pendingBalance],
          ['Total earned', Number(wallet.availableBalance || 0) + Number(wallet.pendingBalance || 0) + Number(wallet.lockedBalance || 0) + Number(wallet.withdrawnBalance || 0)], ['Withdrawn', wallet.withdrawnBalance],
        ].map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-xl font-bold">{data ? money(value) : '—'}</p></div>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submitAccount} className="space-y-3 rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Payout account</h2>
          <p className="text-sm text-gray-500">Status: {data?.provider?.metadata?.payoutAccount?.verified ? 'Verified' : 'Not verified'}</p>
          <input aria-label="Bank or wallet name" className="w-full rounded border p-2" placeholder="Bank or mobile wallet" value={account.bankName} onChange={(e) => setAccount({ ...account, bankName: e.target.value })} />
          <input aria-label="Account name" required className="w-full rounded border p-2" placeholder="Account holder name" value={account.accountName} onChange={(e) => setAccount({ ...account, accountName: e.target.value })} />
          <input aria-label="Account number" required className="w-full rounded border p-2" placeholder="Account number" value={account.accountNumber} onChange={(e) => setAccount({ ...account, accountNumber: e.target.value })} />
          <button disabled={busy} className="rounded bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-50">Save account</button>
        </form>
        <form onSubmit={submitPayout} className="space-y-3 rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Request payout</h2>
          <p className="text-sm text-gray-500">Requests require an administrator’s approval.</p>
          <input aria-label="Payout amount" type="number" min="0.01" step="0.01" required className="w-full rounded border p-2" placeholder="Amount (ETB)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button disabled={busy || !data} className="rounded bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-50">Request payout</button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 font-semibold">Recent earnings</h2>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-gray-500"><th className="py-2">Delivery</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
          {(data?.earnings || []).map((earning) => <tr key={earning._id} className="border-b"><td className="py-2">{String(earning.deliveryId || '').slice(-8) || '—'}</td><td>{new Date(earning.createdAt).toLocaleDateString()}</td><td>{money(earning.amount)}</td><td className="capitalize">{earning.status}</td></tr>)}
          {data && !data.earnings?.length && <tr><td colSpan="4" className="py-4 text-center text-gray-500">No delivery earnings yet.</td></tr>}
          {!data && !loading && <tr><td colSpan="4" className="py-4 text-center text-gray-500">Earnings could not be loaded.</td></tr>}
        </tbody></table></div>
      </section>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 font-semibold">Payout history</h2>
        <div className="space-y-2">{(data?.payouts || []).map((payout) => <div key={payout._id} className="flex justify-between border-b py-2 text-sm"><span>{new Date(payout.createdAt).toLocaleDateString()} · {payout.status}</span><span>{money(payout.amount)}</span></div>)}{data && !data.payouts?.length && <p className="text-sm text-gray-500">No payout requests yet.</p>}{!data && !loading && <p className="text-sm text-gray-500">Payout history could not be loaded.</p>}</div>
      </section>
    </div>
  );
}
