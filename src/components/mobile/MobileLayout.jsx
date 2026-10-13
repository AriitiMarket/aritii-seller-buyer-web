/**
 * Mobile Layout - Touch-friendly responsive wrapper
 */
import React, { useState } from 'react';

export function MobileLayout({ children }) {
  const [isMobile, setIsMobile] = React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`layout ${isMobile ? 'mobile' : 'desktop'}`}>
      {children}
    </div>
  );
}

export function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="header-content">
        <div className="logo">Aritii</div>
        <div className="actions">
          <button className="icon-btn">Search</button>
          <button className="icon-btn">Cart</button>
          <button className="icon-btn">Menu</button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <a href="/home" className="nav-item">
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </a>
      <a href="/search" className="nav-item">
        <span className="icon">🔍</span>
        <span className="label">Search</span>
      </a>
      <a href="/wishlist" className="nav-item">
        <span className="icon">❤️</span>
        <span className="label">Wishlist</span>
      </a>
      <a href="/orders" className="nav-item">
        <span className="icon">📦</span>
        <span className="label">Orders</span>
      </a>
      <a href="/account" className="nav-item">
        <span className="icon">👤</span>
        <span className="label">Account</span>
      </a>
    </nav>
  );
}

export default MobileLayout;
