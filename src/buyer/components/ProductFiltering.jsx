/**
 * Gap #16: Advanced Product Filtering - Buyer Side
 * Integrated into existing buyer structure
 */

import React, { useState, useEffect } from 'react';

export function ProductFiltering() {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    minRating: 0,
    seller: null,
    availability: 'all',
    categories: []
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [products, setProducts] = useState([]);

  // Fetch products with applied filters
  useEffect(() => {
    applyFilters();
  }, [filters, sortBy]);

  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams({
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minRating: filters.minRating,
        ...(filters.seller && { sellerId: filters.seller }),
        ...(filters.categories.length && { categories: filters.categories.join(',') }),
        inStock: filters.availability === 'in_stock',
        sort: sortBy
      });

      const response = await fetch(`/api/products/filter?${queryParams}`);
      const data = await response.json();
      setProducts(data.data.products || []);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: type === 'min'
        ? [parseInt(value), prev.priceRange[1]]
        : [prev.priceRange[0], parseInt(value)]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="product-filtering">
      <div className="filters-panel">
        {/* Price Range */}
        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="range-inputs">
            <input
              type="range"
              min="0"
              max="100000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
          <p>{filters.priceRange[0]} - {filters.priceRange[1]} Birr</p>
        </div>

        {/* Rating */}
        <div className="filter-group">
          <h4>Rating</h4>
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onChange={() => handleRatingChange(rating)}
              />
              {'⭐'.repeat(rating)}
            </label>
          ))}
        </div>

        {/* Stock */}
        <div className="filter-group">
          <h4>Availability</h4>
          <label>
            <input
              type="radio"
              value="all"
              checked={filters.availability === 'all'}
              onChange={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              value="in_stock"
              checked={filters.availability === 'in_stock'}
              onChange={() => setFilters(prev => ({ ...prev, availability: 'in_stock' }))}
            />
            In Stock Only
          </label>
        </div>
      </div>

      <div className="products-section">
        {/* Sort Options */}
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h4>{product.name}</h4>
      <div className="rating">⭐ {product.rating}</div>
      <p className="price">{product.price} Br</p>
      <button className="add-btn">Add to Cart</button>
    </div>
  );
}

export default ProductFiltering;
