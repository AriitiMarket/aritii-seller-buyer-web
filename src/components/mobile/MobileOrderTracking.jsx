/**
 * Mobile Order Tracking Timeline
 */
import React from 'react';

export function MobileOrderTimeline({ order, timeline, exceptions }) {
  return (
    <div className="mobile-order-timeline">
      <div className="order-header">
        <h3>Order #{order._id.slice(-8)}</h3>
        <span className="status-badge">{order.status}</span>
      </div>

      {/* Exception Banner */}
      {exceptions && exceptions.length > 0 && (
        <div className="exception-banner">
          <span className="icon">⚠️</span>
          <p>{exceptions[0].message}</p>
          <button className="help-btn">Get Help</button>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="timeline">
        {timeline.map((step, idx) => (
          <div key={idx} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
            <div className="step-indicator">
              <div className="dot"></div>
              <div className="connector"></div>
            </div>
            
            <div className="step-content">
              <h4>{step.name}</h4>
              {step.timestamp && (
                <p className="timestamp">
                  {new Date(step.timestamp).toLocaleDateString()}
                </p>
              )}
              {step.eta && (
                <p className="eta">
                  ETA: {new Date(step.eta).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Provider Contact */}
      {order.deliveryProvider && (
        <div className="provider-contact">
          <h4>Delivery Provider</h4>
          <div className="provider-info">
            <img src={order.deliveryProvider.avatar} alt="" />
            <div className="info">
              <p className="name">{order.deliveryProvider.name}</p>
              <p className="rating">⭐ {order.deliveryProvider.rating}</p>
            </div>
          </div>
          <button className="contact-btn">
            📞 Call Provider
          </button>
          <button className="track-btn">
            📍 Track Location
          </button>
        </div>
      )}

      {/* Next Action */}
      {order.nextAction && (
        <div className="next-action">
          <button className="action-btn">
            {order.nextAction}
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileDeliveryMap({ deliveryId, location, eta }) {
  return (
    <div className="mobile-delivery-map">
      <div className="map-container">
        {/* Map placeholder - replace with actual map integration */}
        <div className="map-placeholder">
          <p>📍 Delivery tracking map</p>
        </div>
      </div>
      
      <div className="delivery-info">
        <div className="info-row">
          <span className="label">ETA:</span>
          <span className="value">{eta}</span>
        </div>
        <div className="info-row">
          <span className="label">Distance:</span>
          <span className="value">3.2 km</span>
        </div>
      </div>
    </div>
  );
}

export default MobileOrderTimeline;
