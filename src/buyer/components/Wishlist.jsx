/**
 * Gap #17: Wishlist Functionality - Complete
 * Integrated into buyer section
 */

import React, { useState, useEffect } from 'react';

export function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleShare = async (item) => {
    const shareLink = `${window.location.origin}/wishlist/shared/${item._id}`;
    
    try {
      await fetch('/api/wishlist/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlistId: item._id,
          recipients: [],
          message: `Check out my wishlist: ${shareLink}`
        })
      });

      // Copy to clipboard
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await fetch('/api/wishlist/to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlistId: item._id,
          quantity: 1
        })
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleRemove = async (item) => {
    try {
      await fetch(`/api/wishlist/${item._id}`, { method: 'DELETE' });
      setWishlist(wishlist.filter(w => w._id !== item._id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h2>My Wishlist</h2>
        <div className="wishlist-controls">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make Public
          </label>
          <button className="share-btn">Share Wishlist</button>
        </div>
      </div>

      <div className="wishlist-items">
        {wishlist.map(item => (
          <WishlistItem
            key={item._id}
            item={item}
            onShare={handleShare}
            onAddToCart={handleAddToCart}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {wishlist.length === 0 && (
        <p className="empty-message">Your wishlist is empty</p>
      )}
    </div>
  );
}

function WishlistItem({ item, onShare, onAddToCart, onRemove }) {
  const priceDropPercent = item.originalPrice
    ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100)
    : 0;

  return (
    <div className="wishlist-item">
      <img src={item.image} alt={item.name} />
      
      <div className="item-info">
        <h4>{item.name}</h4>
        
        {priceDropPercent > 0 && (
          <span className="price-drop">-{priceDropPercent}% Price Drop</span>
        )}
        
        <div className="prices">
          <span className="current">{item.currentPrice} Br</span>
          {item.originalPrice && (
            <span className="original">{item.originalPrice} Br</span>
          )}
        </div>

        <p className="seller">{item.sellerName}</p>
      </div>

      <div className="item-actions">
        <button
          className="add-cart-btn"
          onClick={() => onAddToCart(item)}
        >
          Add to Cart
        </button>
        <button
          className="share-btn"
          onClick={() => onShare(item)}
        >
          Share
        </button>
        <button
          className="remove-btn"
          onClick={() => onRemove(item)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistPage;
