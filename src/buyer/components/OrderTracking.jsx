/**
 * Gap #18: Order Tracking Timeline - Complete
 * Integrated into buyer section
 */

import React, { useState, useEffect } from 'react';

export function OrderTrackingPage({ orderId }) {
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [exceptions, setExceptions] = useState([]);

  useEffect(() => {
    fetchOrderTracking();
    const interval = setInterval(fetchOrderTracking, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderTracking = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`);
      const data = await response.json();
      setOrder(data.data.order);
      setTimeline(data.data.timeline);
      setExceptions(data.data.exceptions);
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>Order #{order._id.slice(-8)}</h2>
        <span className={`status ${order.status}`}>{order.status}</span>
      </div>

      {/* Exceptions */}
      {exceptions.length > 0 && (
        <div className="exceptions-section">
          {exceptions.map((ex, idx) => (
            <div key={idx} className="exception-alert">
              <span className="icon">⚠️</span>
              <div>
                <h4>{ex.type}</h4>
                <p>{ex.message}</p>
                {ex.contactSupport && (
                  <button className="contact-support">Contact Support</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="timeline">
        {timeline.map((step, idx) => (
          <TimelineStep key={idx} step={step} isLast={idx === timeline.length - 1} />
        ))}
      </div>

      {/* Provider Contact */}
      {order.provider && (
        <div className="provider-section">
          <h3>Delivery Provider</h3>
          <div className="provider-card">
            <img src={order.provider.avatar} alt="" />
            <div>
              <h4>{order.provider.name}</h4>
              <p>⭐ {order.provider.rating}</p>
              <button className="call-btn">📞 Call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineStep({ step, isLast }) {
  const getTimeDisplay = () => {
    if (step.actualTime) {
      return new Date(step.actualTime).toLocaleDateString();
    }
    if (step.eta) {
      return `ETA: ${new Date(step.eta).toLocaleDateString()}`;
    }
    return 'Pending';
  };

  return (
    <div className={`timeline-step ${step.completed ? 'completed' : ''}`}>
      <div className="step-dot"></div>
      {!isLast && <div className="step-line"></div>}
      <div className="step-content">
        <h4>{step.name}</h4>
        <p>{getTimeDisplay()}</p>
      </div>
    </div>
  );
}

export default OrderTrackingPage;
