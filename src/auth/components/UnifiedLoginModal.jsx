import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './UnifiedLoginModal.css';

const UnifiedLoginModal = ({
  open,
  onClose,
  onLogin,
  onForgot,
  onContactUs,
  error,
  role = 'BUYER',
}) => {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onLogin?.({ email: email.trim(), password });
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel = {
    BUYER: 'BUYER PORTAL',
    SELLER: 'SELLER PORTAL',
    PROVIDER: 'DELIVERY PORTAL',
  }[role] || 'CUSTOMER PORTAL';

  if (!open) return null;

  return createPortal(
    <div
      className="unified-login-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div ref={dialogRef} className="unified-login-modal">
        {/* Header */}
        <div className="unified-login-header">
          <div className="header-left">
            <div className="logo-container">
              <UnifiedLogo role={role} />
            </div>
            <div className="role-badge">
              <span>{roleLabel}</span>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            aria-label="Close"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="unified-login-content">
          <h1 id="login-title" className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to access your account and manage your business.</p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email Field */}
            <div className="login-field">
              <input
                autoComplete="email"
                id="unified-email"
                name="email"
                type="email"
                required
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                disabled={submitting}
              />
              <label htmlFor="unified-email" className="login-label">Email</label>
            </div>

            {/* Password Field */}
            <div className="login-field password-field">
              <input
                autoComplete="current-password"
                id="unified-password"
                name="password"
                type={visible ? 'text' : 'password'}
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                disabled={submitting}
              />
              <label htmlFor="unified-password" className="login-label">Password</label>
              <button
                type="button"
                className="password-toggle"
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible(!visible)}
                tabIndex="-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="login-options">
              <label className="remember-checkbox">
                <input type="checkbox" name="remember" />
                <span className="checkbox-mark" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-btn"
                onClick={onForgot}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit"
              disabled={submitting}
            >
              <span>{submitting ? 'Signing in...' : 'Sign in'}</span>
              {!submitting && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span className="divider-line" />
            <span className="divider-text">or continue with</span>
            <span className="divider-line" />
          </div>

          {/* Social Buttons */}
          <div className="social-buttons">
            <a href="#" className="social-btn google" aria-label="Continue with Google" onClick={(e) => e.preventDefault()}>
              <GoogleLogo />
            </a>
            <a href="#" className="social-btn facebook" aria-label="Continue with Facebook" onClick={(e) => e.preventDefault()}>
              <FacebookLogo />
            </a>
            <a href="#" className="social-btn linkedin" aria-label="Continue with LinkedIn" onClick={(e) => e.preventDefault()}>
              <LinkedInLogo />
            </a>
          </div>

          {/* Sign Up Link */}
          <p className="login-signup">
            Don't have an account?{' '}
            <button type="button" className="signup-link" onClick={onContactUs}>
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UnifiedLoginModal;

/* Logos */

function UnifiedLogo({ role }) {
  const colors = {
    BUYER: { start: '#fbbf24', end: '#f97316' },
    SELLER: '#10b981',
    PROVIDER: '#3b82f6',
  };
  const color = colors[role] || colors.BUYER;

  return (
    <svg viewBox="0 0 64 64" className="unified-logo" aria-hidden="true">
      <defs>
        <linearGradient id={`logoGrad-${role}`} x1="0" y1="0" x2="1" y2="1">
          {typeof color === 'object' ? (
            <>
              <stop offset="0" stopColor={color.start} />
              <stop offset="1" stopColor={color.end} />
            </>
          ) : (
            <>
              <stop offset="0" stopColor={color} />
              <stop offset="1" stopColor={color} />
            </>
          )}
        </linearGradient>
      </defs>
      <path d="M32 6 L58 52 L6 52 Z" fill="#0f1114" />
      <path d="M32 31 L58 52 L6 52 Z" fill={`url(#logoGrad-${role})`} />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 10h-2.5v8h-2v-8H9v-2h2V9c0-1.66 1-2.5 2.7-2.5h1.8v1.8h-1c-.52 0-.7.22-.7.7v1.2h2l-.5 2z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#0A66C2" />
      <path fill="white" d="M9 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 14H7V9h2v13zm8-13c-1.657 0-2 1.343-2 3v1h-2v2h2v8h2v-8c0-2 1-3 2-3h1v-2h-1z" />
    </svg>
  );
}
