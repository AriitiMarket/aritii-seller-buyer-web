import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/common/Loading';
import { FiStar } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { SellerEmptyState } from '@/business/components';
import { reviewService } from '@/services/review.service';

const Reviews = () => {
  const { seller } = useSelector((state) => state.seller || {});
  const { activeShopId } = useBusinessShops();

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const shopId = activeShopId || seller?._id;

  const [reviews, setReviews] = useState([]);
  const [supported, setSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shopId) return;
    setIsLoading(true);
    reviewService
      .getByShop(shopId)
      .then(({ reviews: fetched, supported: isSupported }) => {
        setReviews(fetched || []);
        setSupported(isSupported);
        setIsLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setIsLoading(false);
      });
  }, [shopId]);

  if (isLoading || (supported === false && reviews.length === 0)) return <Loader />;

  // Only APPROVED reviews are served by the backend — never expose pending or
  // rejected customer reviews, and never surface private buyer contact details.
  const allReviews = (reviews || []).map((review) => ({
    id: review._id,
    productId: review.productId,
    productName: review.productName || '',
    rating: Number(review.rating || 0),
    comment: review.comment || '',
    user: {
      name: review.author?.name || 'Aritii customer',
    },
    date: review.createdAt || new Date().toISOString(),
    helpful: Number(review.helpful || 0),
    status: review.status || 'pending',
  }));

  const filteredReviews = allReviews.filter((r) => {
    if (activeTab === 'recent') return true;
    if (activeTab === 'highest') return r.rating >= 4;
    if (activeTab === 'lowest') return r.rating <= 2;
    return true;
  }).filter((r) => {
    if (ratingFilter !== 'all') return r.rating === parseInt(ratingFilter);
    return true;
  }).filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return r.productName.toLowerCase().includes(term) ||
      r.comment.toLowerCase().includes(term) ||
      r.user.name.toLowerCase().includes(term);
  });

  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: allReviews.filter((r) => r.rating === rating).length,
    percentage: allReviews.length > 0
      ? (allReviews.filter((r) => r.rating === rating).length / allReviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-market-on-surface">Reviews</h2>
          <p className="text-sm text-market-on-surface-variant">Customer feedback for your products</p>
        </div>
      </div>

      {/* Rating overview */}
      <div className="seller-form-section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-market-on-surface">{averageRating}</div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={star <= parseFloat(averageRating) ? 'fill-current' : 'text-market-on-surface-variant'}
                  size={16}
                />
              ))}
            </div>
            <p className="text-sm text-market-on-surface-variant">{allReviews.length} reviews</p>
          </div>
          <div className="flex-1 grid grid-cols-5 gap-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex flex-col items-center gap-1">
                <span className="text-xs text-market-on-surface-variant">{dist.rating}</span>
                <div className="w-full bg-market-border rounded-full h-2">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${Math.max(dist.percentage, 0)}%` }}
                  />
                </div>
                <span className="text-xs text-market-on-surface-variant">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-market-on-surface-variant text-sm">🔍</span>
          <input
            type="search"
            placeholder="Search reviews…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="seller-form-input pl-9 pr-4 flex-1 min-w-0"
            aria-label="Search reviews"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          <div className="flex flex-wrap gap-2">
            {[{ key: 'all', label: 'All' }, { key: 'recent', label: 'Recent' }, { key: 'highest', label: '4★ & up' }, { key: 'lowest', label: '1-2★' }].map((f) => {
              const isActive = activeTab === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveTab(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-market-primary text-market-on-primary'
                    : 'text-market-on-surface-variant hover:bg-market-surface-container-high hover:text-market-primary'
                  }`}
                  aria-pressed={isActive}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={`stars-${r}`}
                type="button"
                onClick={() => setRatingFilter(r === parseInt(ratingFilter) ? 'all' : String(r))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ratingFilter === String(r)
                  ? 'bg-market-primary text-market-on-primary'
                  : 'text-market-on-surface-variant hover:bg-market-surface-container-high hover:text-market-primary'
                }`}
                aria-pressed={ratingFilter === String(r)}
              >
                {r}★
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="seller-form-section">
        {filteredReviews.length === 0 ? (
          <SellerEmptyState
            title="No reviews found"
            description="Customer reviews will appear here as buyers purchase and rate your products."
            icon="💬"
          />
        ) : (
          <div className="divide-y divide-market-border">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-market-surface-container-low transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-market-surface-container-low flex items-center justify-center flex-shrink-0">
                    <span className="text-market-on-surface-variant font-semibold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-market-on-surface">{review.user.name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={star <= review.rating ? 'text-yellow-500 fill-current' : 'text-market-on-surface-variant'}
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-market-on-surface-variant mb-2">
                      {new Date(review.date).toLocaleDateString()} · {review.productName}
                    </p>
                    <p className="text-market-on-surface-variant text-sm mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-market-primary hover:text-market-primary-hover transition">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-market-on-surface-variant">
        <p>Showing {filteredReviews.length} of {allReviews.length} reviews</p>
      </div>
    </div>
  );
};

export default Reviews;
