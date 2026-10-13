/**
 * Mobile Payment Component - Quick Checkout
 */
import React, { useState } from 'react';

export function MobileQuickCheckout({ cart, onPayment }) {
  const [step, setStep] = useState('items'); // items, address, payment, confirm
  const [selectedPayment, setSelectedPayment] = useState('mobile_wallet');

  const paymentMethods = [
    {
      id: 'mobile_wallet',
      name: 'Mobile Wallet',
      icon: '💳',
      instant: true
    },
    {
      id: 'one_tap_card',
      name: 'One-Tap Card',
      icon: '🏧',
      instant: true
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: '📱',
      instant: false
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      instant: false
    }
  ];

  const getStepIndicator = () => {
    const steps = ['items', 'address', 'payment', 'confirm'];
    return (
      <div className="step-indicator">
        {steps.map((s, idx) => (
          <div
            key={s}
            className={`step ${steps.indexOf(step) >= idx ? 'active' : ''}`}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mobile-quick-checkout">
      {getStepIndicator()}

      {step === 'items' && (
        <div className="step-content">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <span>{item.name}</span>
                <span className="qty">x{item.quantity}</span>
                <span className="price">{item.price * item.quantity} Br</span>
              </div>
            ))}
          </div>
          <div className="total">
            <span>Total:</span>
            <span className="amount">{cart.total} Br</span>
          </div>
          <button 
            className="next-btn"
            onClick={() => setStep('address')}
          >
            Continue to Address
          </button>
        </div>
      )}

      {step === 'address' && (
        <div className="step-content">
          <h3>Delivery Address</h3>
          <div className="address-options">
            <label className="address-option">
              <input type="radio" name="address" defaultChecked />
              <div className="address-preview">
                <strong>Home</strong>
                <p>123 Main Street, Addis Ababa</p>
              </div>
            </label>
            <label className="address-option">
              <input type="radio" name="address" />
              <div className="address-preview">
                <strong>Work</strong>
                <p>456 Business Ave, Addis Ababa</p>
              </div>
            </label>
          </div>
          <button 
            className="add-address-btn"
            onClick={() => alert('Add new address')}
          >
            + Add New Address
          </button>
          <button 
            className="next-btn"
            onClick={() => setStep('payment')}
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="step-content">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <label 
                key={method.id}
                className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <span className="icon">{method.icon}</span>
                <div className="details">
                  <span className="name">{method.name}</span>
                  {method.instant && <span className="badge">Instant</span>}
                </div>
              </label>
            ))}
          </div>
          <button 
            className="next-btn"
            onClick={() => setStep('confirm')}
          >
            Review Order
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="step-content">
          <h3>Confirm Order</h3>
          <div className="order-review">
            <p><strong>Items:</strong> {cart.items.length}</p>
            <p><strong>Total:</strong> {cart.total} Br</p>
            <p><strong>Payment:</strong> {paymentMethods.find(m => m.id === selectedPayment)?.name}</p>
            <p><strong>Delivery:</strong> 2-3 hours</p>
          </div>
          <button 
            className="place-order-btn"
            onClick={() => onPayment({ method: selectedPayment, amount: cart.total })}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileBiometricPayment({ orderId, onComplete }) {
  const [attempt, setAttempt] = useState(0);
  const maxAttempts = 3;

  return (
    <div className="mobile-biometric-payment">
      <div className="biometric-prompt">
        <h2>Confirm Payment</h2>
        <p>Use your fingerprint or face to confirm</p>
        
        <div className="biometric-icon">
          👆
        </div>

        {attempt > 0 && (
          <p className="attempt-text">
            Attempt {attempt} of {maxAttempts}
          </p>
        )}

        <div className="actions">
          <button 
            className="retry-btn"
            onClick={() => setAttempt(attempt + 1)}
          >
            Try Again
          </button>
          <button 
            className="fallback-btn"
            onClick={() => alert('Use PIN instead')}
          >
            Use PIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileQuickCheckout;
