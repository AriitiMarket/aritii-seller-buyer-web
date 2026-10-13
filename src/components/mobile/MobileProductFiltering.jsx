/**
 * Mobile Product Filtering UI
 */
import React, { useState } from 'react';

export function MobileFilterSheet({ onClose, onApply }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    rating: 0,
    availability: 'all'
  });

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: type === 'min' 
        ? [value, prev.priceRange[1]]
        : [prev.priceRange[0], value]
    }));
  };

  return (
    <div className="mobile-filter-sheet">
      <div className="sheet-header">
        <h3>Filters</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4>Price Range</h4>
        <input
          type="range"
          min="0"
          max="100000"
          value={filters.priceRange[0]}
          onChange={(e) => handlePriceChange('min', e.target.value)}
          className="price-input"
        />
        <input
          type="range"
          min="0"
          max="100000"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange('max', e.target.value)}
          className="price-input"
        />
        <div className="price-display">
          {filters.priceRange[0]} - {filters.priceRange[1]} Birr
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <h4>Rating</h4>
        <div className="rating-options">
          {[0, 3, 4, 4.5, 5].map(rating => (
            <label key={rating} className="checkbox-label">
              <input
                type="radio"
                name="rating"
                value={rating}
                onChange={() => setFilters(prev => ({ ...prev, rating }))}
              />
              <span className="stars">{'⭐'.repeat(Math.floor(rating))}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="checkbox-label">
          <input
            type="radio"
            name="availability"
            value="all"
            onChange={() => setFilters(prev => ({ ...prev, availability: 'all' }))}
          />
          All Items
        </label>
        <label className="checkbox-label">
          <input
            type="radio"
            name="availability"
            value="in_stock"
            onChange={() => setFilters(prev => ({ ...prev, availability: 'in_stock' }))}
          />
          In Stock Only
        </label>
      </div>

      <button className="apply-btn" onClick={() => onApply(filters)}>
        Apply Filters
      </button>
    </div>
  );
}

export function MobileProductCard({ product }) {
  return (
    <div className="mobile-product-card">
      <div className="image-container">
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <div className="rating">
          <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
          <span className="count">({product.reviews})</span>
        </div>
        <div className="price">
          <span className="current">{product.price} Br</span>
          {product.originalPrice && (
            <span className="original">{product.originalPrice} Br</span>
          )}
        </div>
      </div>
      <div className="actions">
        <button className="add-to-cart">Add</button>
        <button className="add-to-wishlist">❤️</button>
      </div>
    </div>
  );
}

export default MobileFilterSheet;
