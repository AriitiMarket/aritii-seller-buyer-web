import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import shopService from '@/services/shop.service';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { SellerCard } from '@/features/product-requests';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

/**
 * Buyer — Select Seller / Brand (`/my-dashboard/requests/new`).
 *
 * Step 1 of the request flow: a full-page, card-based seller selection
 * (logo, shop name, blurb, category, location, verification, rating) instead
 * of a small dropdown. Each card offers View Shop · View Profile ·
 * Request Product; the profile page continues straight into the request form.
 */
export default function SelectSellerPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await shopService.getPublicAll();
        if (!cancelled) {
          setShops(Array.isArray(list) ? list : []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load sellers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const values = shops
      .map((shop) => shop.category)
      .filter(Boolean)
      .filter((value, index, all) => all.indexOf(value) === index)
      .sort();
    return values;
  }, [shops]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return shops.filter((shop) => {
      if (category && shop.category !== category) return false;
      if (!term) return true;
      const haystack = [shop.name, shop.description, shop.category, shop.address]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [shops, query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3">
        <Link
          to="/my-dashboard/requests"
          className="inline-flex items-center gap-1.5 text-sm text-[#667085] hover:text-[#2C3F6E] w-fit"
        >
          <FiArrowLeft size={14} />
          Product Requests
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171A21]">Select a Seller / Brand</h1>
          <p className="text-[#667085] mt-1">
            Choose the business you want to request a product from. You can review their profile
            before sending the request.
          </p>
        </div>
      </div>

      {/* Search + category */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sellers, brands or categories…"
            aria-label="Search sellers"
            className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#20305C]"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="sm:w-56 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#20305C]"
        >
          <option value="">All categories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading variant="inline" label="Loading sellers…" />
      ) : error ? (
        <EmptyState title="Sellers unavailable" description={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No sellers found"
          description={
            shops.length === 0
              ? 'No sellers are listed on the marketplace yet.'
              : 'Try a different search term or category.'
          }
          action={
            <Link
              to="/my-dashboard/requests"
              className="text-sm font-semibold text-[#2C3F6E] hover:underline"
            >
              Back to Product Requests
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((shop) => (
            <SellerCard key={shop._id || shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
