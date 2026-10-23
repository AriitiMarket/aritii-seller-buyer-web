import React, { useEffect, useState } from 'react';
import { MdClose, MdUpload } from 'react-icons/md';
import shopService from '@/services/shop.service';
import { catalogService } from '@/services/catalog.service';

const EMPTY = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  category: '',
  description: '',
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#75d04b] focus:border-transparent';

/**
 * AddShopModal — register an ADDITIONAL store under a BUSINESS account.
 *
 * The first shop comes from the seller-application approval; everything after
 * that is opened here. Backend rules this form mirrors:
 *   - INDIVIDUAL sellers are rejected (one shop only) — the parent page hides
 *     this modal for them;
 *   - every additional shop MUST carry a shop category (type 'business'),
 *     so each store is browsable on its own;
 *   - the avatar is required by `POST /shop/create-shop`.
 * The new shop lands as PENDING_APPROVAL — only an admin makes it public.
 */
const AddShopModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setForm(EMPTY);
    setAvatar(null);
    setPreview('');
    setError('');
    setSaving(false);
    catalogService
      .getCategoriesByType('business')
      .then((rows) => setCategories(rows || []))
      .catch(() => setCategories([]));
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!avatar) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(avatar);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!avatar) {
      setError('A shop logo is required.');
      return;
    }
    if (!form.category) {
      setError('Pick the shop category — every additional store needs one.');
      return;
    }

    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('email', form.email.trim());
    data.append('phoneNumber', form.phoneNumber.trim());
    data.append('address', form.address.trim());
    data.append('category', form.category);
    if (form.description.trim()) data.append('description', form.description.trim());
    data.append('file', avatar);

    setSaving(true);
    try {
      const shop = await shopService.createShop(data);
      onCreated?.(shop);
      onClose();
    } catch (err) {
      const body = err.response?.data;
      const message =
        body?.message ||
        (Array.isArray(body?.errors) && body.errors.join(' ')) ||
        err.message ||
        'Could not create the shop';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a shop"
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Open another shop</h2>
            <p className="mt-1 text-sm text-gray-500">
              Each store needs its own category so buyers can browse it separately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <MdClose size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-name">
              Shop name *
            </label>
            <input id="shop-name" className={inputClass} value={form.name} onChange={set('name')} required minLength={2} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-email">
                Email *
              </label>
              <input id="shop-email" type="email" className={inputClass} value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-phone">
                Phone *
              </label>
              <input
                id="shop-phone"
                className={inputClass}
                value={form.phoneNumber}
                onChange={set('phoneNumber')}
                placeholder="+251 911 000 000"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-address">
              Store & Pickup Address *
            </label>
            <input
              id="shop-address"
              className={inputClass}
              value={form.address}
              onChange={set('address')}
              placeholder="e.g., Bole Medhanialem, Edna Mall 2nd Floor, Shop #204"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Orders will be collected from this location by delivery drivers.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-category">
              Shop category *
            </label>
            <select
              id="shop-category"
              className={inputClass}
              value={form.category}
              onChange={set('category')}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.title} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                No shop categories are published yet — an admin must add them first.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700" htmlFor="shop-description">
              Description
            </label>
            <textarea
              id="shop-description"
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={set('description')}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Shop logo *</span>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-600 hover:border-[#75d04b] hover:text-[#75d04b]">
              {preview ? (
                <img src={preview} alt="Logo preview" className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <MdUpload size={18} />
                </span>
              )}
              <span>{avatar ? avatar.name : 'Upload a logo (required)'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#75d04b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5ac12f] disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShopModal;
