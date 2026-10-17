import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import shopService from '@/services/shop.service';
import requestService from '@/services/request.service';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { ShopImage } from '@/components/common';
import { PlaceholderAvatar } from '@/assets';
import { shopLocation, shopVerification, SPEC_LABELS, UNIT_OPTIONS } from '@/features/product-requests';
import { FiArrowLeft, FiX, FiImage } from 'react-icons/fi';

/** Client-side cap so an inline attachment can never blow past Mongo limits. */
const MAX_ATTACHMENT_BYTES = 1024 * 1024;

const EMPTY_FORM = {
  title: '',
  description: '',
  quantity: 1,
  unit: 'Piece',
  targetPrice: '',
  requirements: '',
  quality: '',
  brand: '',
  size: '',
  color: '',
  packaging: '',
};

/**
 * Buyer — Request Product form (`/my-dashboard/requests/new/:shopId`).
 *
 * Step 2 of the flow. The selected seller/brand is pinned at the top, the
 * form stays single-column on mobile, and the submit action sticks to the
 * bottom of small screens. On success the buyer lands in the request
 * workspace (discussion, offer and activity all live there).
 */
export default function NewRequestPage() {
  const { shopId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [shopError, setShopError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const productId = searchParams.get('productId') || '';

  const loadShop = useCallback(async () => {
    setShopLoading(true);
    try {
      let data = null;
      try {
        data = await shopService.getPublicById(shopId);
      } catch {
        data = await shopService.getById(shopId);
      }
      if (!data) throw new Error('Seller not found');
      setShop(data);
      setShopError(null);
    } catch (err) {
      setShopError(err.response?.data?.message || 'Could not load the selected seller');
    } finally {
      setShopLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAttachmentError('Only image attachments are supported.');
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachmentError('Image must be smaller than 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({ name: file.name, url: String(reader.result) });
      setAttachmentError('');
    };
    reader.onerror = () => setAttachmentError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (title.length < 3) {
      toast.error('Please describe what you need (at least 3 characters)');
      return;
    }
    // Structured requirements — only non-empty keys are sent, so the seller
    // never has to dig through prose to find quality/size/colour/packaging.
    const specs = {};
    SPEC_LABELS.forEach(({ key }) => {
      const value = String(form[key] ?? '').trim();
      if (value) specs[key] = value;
    });
    if (form.requirements.trim()) specs.notes = form.requirements.trim();

    setSubmitting(true);
    try {
      const created = await requestService.create({
        title,
        details: form.description.trim(),
        quantity: Number(form.quantity) || 1,
        unit: form.unit.trim() || 'Piece',
        specs,
        targetPrice: form.targetPrice === '' ? null : Number(form.targetPrice),
        shopId,
        ...(productId ? { productId } : {}),
        ...(attachment ? { attachments: [{ url: attachment.url }] } : {}),
      });
      toast.success('Product request sent');
      const id = created?._id || created?.request?._id;
      navigate(id ? `/my-dashboard/requests/${id}` : '/my-dashboard/requests', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the request');
    } finally {
      setSubmitting(false);
    }
  };

  if (shopLoading) return <Loading variant="inline" label="Loading seller…" />;

  if (shopError || !shop) {
    return (
      <EmptyState
        title="Seller not available"
        description={shopError || 'The selected seller could not be loaded.'}
        action={
          <Link to="/my-dashboard/requests/new">
            <Button className="bg-market-primary text-market-on-primary">Choose another seller</Button>
          </Link>
        }
      />
    );
  }

  const verification = shopVerification(shop);
  const location = shopLocation(shop);

  const fieldClass =
    'w-full border border-market-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-market-secondary';

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-28 sm:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to="/my-dashboard/requests/new"
          className="inline-flex items-center gap-1.5 text-sm text-market-on-surface-variant hover:text-market-secondary-hover"
        >
          <FiArrowLeft size={14} />
          Select a seller
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-market-secondary-hover bg-market-surface-container px-2 py-0.5 rounded-full">
            Requesting from {shop.name}
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-market-on-surface">Request Product</h1>
        <p className="text-market-on-surface-variant mt-1">
          Tell the seller exactly what you need. They will respond with availability and an offer
          inside this request.
        </p>
      </div>

      {/* Selected seller */}
      <div className="bg-white rounded-lg border border-[#2162a1]/40 bg-market-surface-container/40 p-4 flex items-center gap-3">
        <ShopImage
          data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url }}
          fallback={PlaceholderAvatar}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white"
          alt={`${shop.name} logo`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-market-on-surface-variant font-semibold">
            Requesting from
          </p>
          <p className="font-semibold text-market-on-surface truncate flex items-center gap-2">
            {shop.name}
            {verification && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${verification.tone}`}>
                {verification.label}
              </span>
            )}
          </p>
          {location && <p className="text-xs text-market-on-surface-variant truncate">{location}</p>}
        </div>
        <Link
          to="/my-dashboard/requests/new"
          className="text-xs font-semibold text-market-secondary-hover hover:underline whitespace-nowrap"
        >
          Change
        </Link>
      </div>

      <form
        id="request-product-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-market-border p-4 sm:p-6 space-y-4"
      >
        <div>
          <label htmlFor="request-title" className="block text-sm font-medium text-market-on-surface mb-1">
            Product or requested item <span className="text-red-500">*</span>
          </label>
          <input
            id="request-title"
            required
            minLength={3}
            maxLength={300}
            placeholder="e.g. 50 kg Arabica coffee beans, medium roast"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="request-description" className="block text-sm font-medium text-market-on-surface mb-1">
            Description
          </label>
          <textarea
            id="request-description"
            rows={4}
            maxLength={5000}
            placeholder="Specs, quality, packaging, delivery window — everything the seller should know…"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className={fieldClass}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="request-quantity" className="block text-sm font-medium text-market-on-surface mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="request-quantity"
              required
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="request-unit" className="block text-sm font-medium text-market-on-surface mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              id="request-unit"
              required
              list="request-unit-options"
              maxLength={32}
              placeholder="e.g. Piece, Kg, Box"
              value={form.unit}
              onChange={(event) => setForm({ ...form, unit: event.target.value })}
              className={fieldClass}
            />
            <datalist id="request-unit-options">
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="request-price" className="block text-sm font-medium text-market-on-surface mb-1">
              Expected / target price (ETB)
            </label>
            <input
              id="request-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              value={form.targetPrice}
              onChange={(event) => setForm({ ...form, targetPrice: event.target.value })}
              className={fieldClass}
            />
          </div>
        </div>

        {/* Structured requirements — the seller quotes against these exact rows. */}
        <fieldset className="border-t border-market-border pt-4">
          <legend className="sr-only">Structured requirements</legend>
          <p className="text-sm font-medium text-market-on-surface mb-1">
            Requirements <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <p className="text-xs text-market-on-surface-variant mb-3">
            Fill what matters — quality, brand, size, colour and packaging travel with the request
            as structured data, not buried in prose.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {SPEC_LABELS.filter(({ key }) => key !== 'notes').map(({ key, label }) => (
              <div key={key}>
                <label
                  htmlFor={`request-spec-${key}`}
                  className="block text-sm font-medium text-market-on-surface mb-1"
                >
                  {label}
                </label>
                <input
                  id={`request-spec-${key}`}
                  type="text"
                  maxLength={300}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className={fieldClass}
                />
              </div>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="request-requirements" className="block text-sm font-medium text-market-on-surface mb-1">
            Other requirements / notes
          </label>
          <textarea
            id="request-requirements"
            rows={3}
            maxLength={2000}
            placeholder="Branding, certifications, sample first, preferred suppliers…"
            value={form.requirements}
            onChange={(event) => setForm({ ...form, requirements: event.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-market-on-surface mb-1">
            Image / attachment <span className="text-gray-400 font-normal">(optional)</span>
          </span>
          {attachment ? (
            <div className="flex items-center gap-3 border border-market-border rounded-lg p-2.5">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="w-14 h-14 rounded-lg object-cover border border-market-border"
              />
              <p className="text-sm text-market-on-surface-variant flex-1 truncate">{attachment.name}</p>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-market-on-surface-variant"
                aria-label="Remove attachment"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 border border-dashed border-market-border rounded-lg px-3 py-3 text-sm text-market-on-surface-variant cursor-pointer hover:border-[#2162a1] transition">
              <FiImage size={16} className="text-market-secondary" />
              Add an image (max 1 MB)
              <input type="file" accept="image/*" className="hidden" onChange={handleAttachment} />
            </label>
          )}
          {attachmentError && <p className="text-xs text-red-600 mt-1">{attachmentError}</p>}
        </div>

        {/* Desktop submit */}
        <div className="hidden sm:flex items-center gap-3 pt-2">
          <Button type="submit" disabled={submitting} className="bg-market-primary text-market-on-primary">
            {submitting ? 'Sending…' : 'Send Product Request'}
          </Button>
          <Link
            to="/my-dashboard/requests"
            className="h-[45px] px-5 inline-flex items-center justify-center rounded-full border border-market-border text-market-on-surface font-semibold text-sm hover:border-[#2162a1] transition"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Mobile sticky action */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-market-border p-3">
        <Button
          type="submit"
          form="request-product-form"
          disabled={submitting}
          className="w-full bg-market-primary text-market-on-primary"
        >
          {submitting ? 'Sending…' : 'Send Product Request'}
        </Button>
      </div>
    </div>
  );
}
