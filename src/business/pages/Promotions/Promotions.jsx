import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import promotionService from '@/business/services/promotionService';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { formatDate } from '@/shared/utils/format';
import { FiPercent, FiCalendar, FiPlus, FiFilter } from 'react-icons/fi';
import { MdLocalOffer } from 'react-icons/md';

/**
 * Business - Promotions (/business/promotions).
 *
 * Promotions are their own feature (commercial offers/campaigns), separate from
 * the catalog and from events. A business creates and manages the promotions for
 * the shop it is currently managing (multi-shop aware via useBusinessShops).
 *
 * All calls go through features/business/services/promotionService -> shared API
 * client. The gateway does not serve promotion endpoints yet, so the list area
 * says so honestly instead of showing fabricated campaigns.
 */
const BusinessPromotionsPage = () => {
  const { activeShop, activeShopId, loading: shopsLoading } = useBusinessShops();
  const [promotions, setPromotions] = useState([]);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountPercent: '',
    fixedAmount: '',
    maxDiscountAmount: '',
    minPurchaseAmount: '',
    totalUsageLimit: '',
    perBuyerUsageLimit: '',
    endsAt: '',
  });
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const load = useCallback(async () => {
    if (!activeShopId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await promotionService.getByShop(activeShopId);
      setPromotions(list || []);
      setSupported(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not load promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [activeShopId]);

  useEffect(() => {
    load();
  }, [load]);

  // Filter promotions by status
  const filteredPromotions = React.useMemo(() => {
    const now = new Date();
    return promotions.filter((promo) => {
      if (activeTab === 'all') return true;
      const endDate = promo.endsAt ? new Date(promo.endsAt) : null;
      if (activeTab === 'active') return !endDate || endDate > now;
      if (activeTab === 'scheduled') return endDate && endDate > now;
      if (activeTab === 'expired') return endDate && endDate <= now;
      return true;
    });
  }, [promotions, activeTab]);

  const tabs = [
    { id: 'all', label: 'All', count: promotions.length },
    { id: 'active', label: 'Active', count: promotions.filter(p => !p.endsAt || new Date(p.endsAt) > new Date()).length },
    { id: 'scheduled', label: 'Scheduled', count: promotions.filter(p => p.endsAt && new Date(p.endsAt) > new Date()).length },
    { id: 'expired', label: 'Expired', count: promotions.filter(p => p.endsAt && new Date(p.endsAt) <= new Date()).length },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!activeShopId) {
      toast.error('Select a shop first');
      return;
    }
    if (!form.title.trim()) {
      toast.error('A promotion needs a title');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        shopId: activeShopId,
        title: form.title.trim(),
        description: form.description.trim(),
        code: form.code.trim() || undefined,
        discountType: form.discountType,
        discountPercent: form.discountType === 'PERCENTAGE' ? Number(form.discountPercent) || undefined : undefined,
        fixedAmount: form.discountType === 'FIXED_AMOUNT' ? Number(form.fixedAmount) || undefined : undefined,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        minPurchaseAmount: form.minPurchaseAmount ? Number(form.minPurchaseAmount) : undefined,
        totalUsageLimit: form.totalUsageLimit ? Number(form.totalUsageLimit) : undefined,
        perBuyerUsageLimit: form.perBuyerUsageLimit ? Number(form.perBuyerUsageLimit) : undefined,
        endsAt: form.endsAt || undefined,
      };

      await promotionService.create(payload);
      toast.success('Promotion created');
      setForm({
        title: '',
        description: '',
        code: '',
        discountType: 'PERCENTAGE',
        discountPercent: '',
        fixedAmount: '',
        maxDiscountAmount: '',
        minPurchaseAmount: '',
        totalUsageLimit: '',
        perBuyerUsageLimit: '',
        endsAt: '',
      });
      await load();
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setSupported(false);
        toast.error('Promotions are not enabled on the backend yet');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Could not create the promotion');
      }
    } finally {
      setSaving(false);
    }
  };

  if (shopsLoading && !activeShopId) {
    return <Loading variant="inline" label="Loading your shops…" />;
  }

  if (!activeShopId) {
    return (
      <EmptyState
        title="No shop to manage yet"
        description="Create or link a shop before running promotions."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Promotions</h1>
            <p className="text-sm text-gray-600">
              Commercial offers for <span className="font-semibold">{activeShop?.name || 'your shop'}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition"
          >
            <FiPlus size={18} />
            Create Promotion
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && supported ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create a promotion</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Weekend coffee sale"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="What is the offer?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code (optional)</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="e.g. SUMMER2024"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for a shop-only promotion without a code</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="PERCENTAGE">Percentage Discount</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
                <option value="FREE_DELIVERY">Free Delivery</option>
              </select>
            </div>
            {form.discountType === 'PERCENTAGE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiPercent size={16} />
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Optional cap"
                  />
                </div>
              </div>
            )}
            {form.discountType === 'FIXED_AMOUNT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Amount (ETB)</label>
                <input
                  type="number"
                  min="0"
                  value={form.fixedAmount}
                  onChange={(e) => setForm({ ...form, fixedAmount: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="0"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase Amount (ETB)</label>
              <input
                type="number"
                min="0"
                value={form.minPurchaseAmount}
                onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="0 for no minimum"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  min="0"
                  value={form.totalUsageLimit}
                  onChange={(e) => setForm({ ...form, totalUsageLimit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per-Buyer Limit</label>
                <input
                  type="number"
                  min="0"
                  value={form.perBuyerUsageLimit}
                  onChange={(e) => setForm({ ...form, perBuyerUsageLimit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiCalendar size={16} />
                Ends on
              </label>
              <input
                type="date"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="bg-brand-primary text-white disabled:opacity-50">
                {saving ? 'Creating…' : 'Create promotion'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary-dark'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Promotions List */}
        <div className="p-6">
          {loading ? (
            <Loading variant="inline" label="Loading promotions…" />
          ) : error ? (
            <EmptyState
              title="Could not load promotions"
              description={error}
              action={<Button onClick={load}>Try again</Button>}
            />
          ) : filteredPromotions.length === 0 ? (
            <EmptyState
              title="No promotions found"
              description={
                supported
                  ? 'Promotions you create for this shop will appear here.'
                  : 'Promotion endpoints are not available on the backend yet.'
              }
              icon={<MdLocalOffer className="text-5xl text-gray-300 mx-auto mb-4" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPromotions.map((promotion) => {
                const isExpired = promotion.endsAt && new Date(promotion.endsAt) <= new Date();
                return (
                  <div key={promotion._id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-brand-primary transition">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
                      {promotion.discountPercent ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-600 flex items-center gap-1">
                          <FiPercent size={12} />
                          -{promotion.discountPercent}%
                        </span>
                      ) : null}
                    </div>
                    {promotion.description ? (
                      <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                    ) : null}
                    <div className="flex items-center justify-between text-xs">
                      {promotion.endsAt ? (
                        <span className={`flex items-center gap-1 ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                          <FiCalendar size={14} />
                          {isExpired ? 'Expired' : 'Ends'} {formatDate(promotion.endsAt)}
                        </span>
                      ) : (
                        <span className="text-gray-500">No end date</span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPromotionsPage;
