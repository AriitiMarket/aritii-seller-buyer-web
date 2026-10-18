import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './CustomerPortalLoginModal.css';

/**
 * CustomerPortalLoginModal
 *
 * React + Tailwind login modal for the Customer Portal.
 * - createPortal overlay onto <body> (avoids z-index nesting surprises).
 * - Escape key closes; body scroll is locked while open.
 * - Floating labels, orange-accented checkbox, social sign-in, etc.
 *
 * This component is presentational. The parent drives authentication (login /
 * route guard work) by passing onLogin / onForgot / onContactUs callbacks.
 *
 * Props:
 *   open      -> boolean, controls visibility
 *   onClose   -> () => void, called when the user closes the modal
 *   id        -> string, optional id for the dialog + accessible labels
 *   onLogin   -> (credentials) => Promise | void, called with { email, password }
 *   onForgot  -> () => void, called when "Forgot password?" is tapped
 *   onContactUs -> () => void, called when "Contact us" is tapped
 *   error     -> string | null, inline validation/connection error to show
 */
const CustomerPortalLoginModal = ({
  open,
  onClose,
  id = 'customer-portal-login',
  onLogin,
  onForgot,
  onContactUs,
  error,
}) => {
  const dialogRef = useRef(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

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

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
    >
      <div ref={dialogRef} className="customer-portal-modal relative w-full max-w-lg">
        {/* ===== Header: logo overlapping the top edge + badge + close ===== */}
        <div className="flex items-center justify-between px-5 pt-8 pb-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="logo-overlap flex items-center justify-center">
              <PortalLogo />
            </div>
            <div className="badge">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-black">
                CUSTOMER PORTAL
              </span>
            </div>
          </div>
          <button
            type="button"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            aria-label="Close"
            onClick={onClose}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ===== Main form ===== */}
        <div className="px-5 pb-8 pt-4">
          <h1 id={`${id}-title`} className="text-2xl font-extrabold leading-tight text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Sign in to access your projects and assets.
          </p>

          <form className="mt-6 space-y-4" noValidate>
            {/* Email */}
            <div className="customer-portal-field">
              <input
                autoComplete="username"
                id="portal-email"
                name="email"
                type="email"
                required
                placeholder=" "
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="customer-portal-input"
              />
              <label htmlFor="portal-email" className="customer-portal-input-label">
                Email or phone number
              </label>
            </div>

            {/* Password */}
            <div className="customer-portal-field">
              <input
                autoComplete="current-password"
                id="portal-password"
                name="password"
                type={visible ? 'text' : 'password'}
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="customer-portal-input"
              />
              <label htmlFor="portal-password" className="customer-portal-input-label">
                Password
              </label>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white focus:outline-none focus:text-white"
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible((v) => !v)}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between gap-4">
              <label className="customer-portal-checkbox flex items-center">
                <input type="checkbox" name="remember-me" id="portal-remember" />
                <span className="customer-portal-checkmark" />
                <span className="text-sm text-white/80">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  e && e.preventDefault();
                  onForgot?.();
                }}
                className="text-sm font-semibold text-white/80 transition hover:text-amber-300 focus:outline-none focus:text-amber-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3.5 text-sm font-bold text-black transition duration-200 hover:from-amber-300 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-black/20 active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                Sign in
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            {error && (
              <div
                className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4m0 4h.01" />
                  <path d="M19 17a7 7 0 0 0-11.94-6.26A7 7 0 0 0 6.06 4.06 7 7 0 0 0 12 12Z" />
                </svg>
                {error}
              </div>
            )}
          </form>

          {/* Divider + social sign-in */}
          <div className="mt-6">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                or continue with
              </span>
              <span className="h-px w-12 bg-white/10" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <a
                href="#"
                className="customer-portal-social-btn"
                aria-label="Sign in with Google"
                onClick={(e) => e.preventDefault()}
              >
                <GoogleLogo />
              </a>
              <a
                href="#"
                className="customer-portal-social-btn"
                aria-label="Sign in with Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <FacebookLogo />
              </a>
              <a
                href="#"
                className="customer-portal-social-btn"
                aria-label="Sign in with LinkedIn"
                onClick={(e) => e.preventDefault()}
              >
                <LinkedInLogo />
              </a>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                e && e.preventDefault();
                onContactUs?.();
              }}
              className="font-semibold text-amber-300 transition hover:text-amber-200 focus:outline-none focus:text-amber-200"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomerPortalLoginModal;

/* ==========================================================================
 * Inline brand icons (official colours, dark-themed)
 * ========================================================================== */

function PortalLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M32 6 L58 52 L6 52 Z" fill="#0f1114" />
      <path d="M32 31 L58 52 L6 52 Z" fill="url(#logoGrad)" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg className="h-20 w-20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg className="h-20 w-20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 23.094C14.922 23.094 18.83 20.97 19.863 17.452L24 19.781V24H0V19.781L5.137 21.548C4.17 24.03 8.078 24.03 12 24.03C18.595 24.03 24 18.595 24 12.073z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg className="h-20 w-20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#0A66C2" d="M20.45 3.295c-.83-.37-1.72-.59-2.65-.64L1.3 8.07v12.16c0 .55.44.99.99.99h12.16c.55 0 .99-.44.99-.99v-8.87L15.35 6.41a.99.99 0 0 0-.64-.35zM12 16.86c-2.54 0-4.6-2.06-4.6-4.6s2.06-4.6 4.6-4.6 4.6 2.06 4.6 4.6-2.06 4.6-4.6 4.6z" />
    </svg>
  );
}
