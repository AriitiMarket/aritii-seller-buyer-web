/**
 * Mobile Wishlist Component
 */
import React, { useState } from 'react';

export function MobileWishlistItem({ item, onRemove, onAddToCart, onShare }) {
  const [priceDropAlert, setPriceDropAlert] = useState(item.priceDropPercent || 0);

  return (
    <div className="mobile-wishlist-item">
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="item-details">
        <h4>{item.name}</h4>
        
        {priceDropAlert > 0 && (
          <div className="price-drop-alert">
            <span className="badge">Price Drop {priceDropAlert}%</span>
          </div>
        )}

        <div className="prices">
          <span className="current-price">{item.currentPrice} Br</span>
          <span className="original-price">{item.addedPrice} Br</span>
        </div>

        <div className="seller-info">
          <span className="seller">{item.sellerName}</span>
          <span className="rating">⭐ {item.rating}</span>
        </div>
      </div>

      <div className="item-actions">
        <button 
          className="btn-primary"
          onClick={() => onAddToCart(item._id)}
        >
          Add to Cart
        </button>
        
        <div className="action-buttons">
          <button 
            className="btn-icon"
            onClick={() => onShare(item._id)}
            title="Share wishlist"
          >
            Share
          </button>
          <button 
            className="btn-icon"
            onClick={() => onRemove(item._id)}
            title="Remove from wishlist"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileWishlistActions({ wishlistId, onShare, onShareWithFriends }) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  return (
    <div className="mobile-wishlist-actions">
      <button 
        className="btn-primary"
        onClick={() => setShowShareMenu(!showShareMenu)}
      >
        Share Wishlist
      </button>

      {showShareMenu && (
        <div className="share-menu">
          <button onClick={() => onShare('whatsapp')}>
            WhatsApp
          </button>
          <button onClick={() => onShare('facebook')}>
            Facebook
          </button>
          <button onClick={() => onShareWithFriends()}>
            Share with Friends
          </button>
        </div>
      )}

      <button className="btn-secondary">
        View Recommendations
      </button>
    </div>
  );
}

export default MobileWishlistItem;
