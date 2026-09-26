import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop } from '@/store/slices/productThunks';
import Loader from '@/components/common/Loading';
import { FiStar, FiFilter, FiSearch, FiMessageSquare, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';

const Reviews = () => {
  const { shopProducts = [], isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
    }
  }, [dispatch, shopId]);

  // Mock reviews data (in real app, this would come from a reviews API)
  const reviews = React.useMemo(() => {
    const mockReviews = [];
    shopProducts.forEach((product) => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach((review) => {
          mockReviews.push({
            id: review._id || Math.random().toString(),
            productId: product._id,
            productName: product.name,
            rating: review.rating || Math.floor(Math.random() * 5) + 1,
            comment: review.comment || 'Great product!',
            user: review.user || { name: 'Customer', avatar: null },
            date: review.createdAt || new Date().toISOString(),
            helpful: review.helpful || Math.floor(Math.random() * 20),
          });
        });
      }
    });
    return mockReviews;
  }, [shopProducts]);

  // Filter reviews
  const filteredReviews = React.useMemo(() => {
    let filtered = reviews;

    if (activeTab === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (activeTab === 'highest') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeTab === 'lowest') {
      filtered = filtered.sort((a, b) => a.rating - b.rating);
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.productName.toLowerCase().includes(term) ||
          r.comment.toLowerCase().includes(term) ||
          r.user.name.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [reviews, activeTab, ratingFilter, searchTerm]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Reviews</h1>
                <p className="text-sm text-gray-600">Manage customer feedback for your products</p>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiStar className="text-yellow-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Average Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{averageRating} / 5.0</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    size={16}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMessageSquare className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Reviews</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiThumbsUp className="text-green-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">5-Star Reviews</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {ratingDistribution.find((r) => r.rating === 5)?.count || 0}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{item.rating} star</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  <option value="all">Sort by: Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16">
                <FiMessageSquare className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No reviews found</p>
                <p className="text-gray-500 text-sm">Customer reviews will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-semibold">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{review.user.name}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                size={14}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(review.date).toLocaleDateString()} · {review.productName}
                        </p>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary-dark transition">
                            <FiThumbsUp size={16} />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary-dark transition">
                            <FiThumbsDown size={16} />
                            Not helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Showing {filteredReviews.length} of {reviews.length} reviews</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
