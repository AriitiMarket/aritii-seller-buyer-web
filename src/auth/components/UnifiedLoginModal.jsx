import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BrandLogo from '@/shared/components/BrandLogo';

/**
 * UnifiedLoginModal — the ONE login UI for the whole application.
 *
 * The role is NOT chosen here. The Identity Service resolves the account's
 * role server-side from its role memberships (`user_roles`) and returns it as
 * `login_role`, so the modal only collects credentials. The `role` prop is a
 * contextual HINT (it picks the badge and the sign-up link) — it is never
 * sent to the backend as the sign-in role.
 */
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

  const ROLE_CONFIG = {
    BUYER: {
      label: 'Buyer',
      badge: 'SHOP & BUY',
      next: '/my-dashboard',
    },
    SELLER: {
      label: 'Seller',
      badge: 'SELL ON ARITII',
      next: '/seller-registration',
    },
    PROVIDER: {
      label: 'Delivery Provider',
      badge: 'DELIVER WITH ARITII',
      next: '/provider-application',
    },
  };

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

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.BUYER;

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131921]/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      {/* Centered Modal Card */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl border border-[#232f3e] bg-[#1a222d] shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(249, 115, 22, 0.1)' }}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/60 hover:bg-slate-700 border border-slate-600/60 flex items-center justify-center text-gray-300 hover:text-white transition"
          aria-label="Close"
          onClick={onClose}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Header with small icon / brand mark */}
        <div className="px-6 pt-7 pb-4 text-center border-b border-[#232f3e]">
          <div className="flex items-center justify-center mb-3">
            <BrandLogo size="md" showText showTagline tone="light" />
          </div>
          <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
            {config.badge}
          </span>
          <h1 id="login-title" className="text-2xl font-bold text-white tracking-tight">Sign in</h1>
          <p className="text-xs text-gray-400 mt-0.5">Welcome back! Sign in to continue</p>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5 block">
                Email or mobile phone number
              </label>
              <input
                autoComplete="email"
                id="unified-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:outline-none transition text-sm disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-200 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgot}
                  className="text-xs font-medium text-[#febd69] hover:text-[#f3a847] hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  id="unified-password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:outline-none transition text-sm disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-[#131921] text-[#e77600] focus:ring-[#e77600]"
                />
                <span className="text-xs text-gray-300">Keep me signed in</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-3 text-xs text-[#fca5a5] flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-2.5 px-4 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e77600] text-[#131921] font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="px-0 py-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#232f3e]" />
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">or sign in with</span>
            <div className="flex-1 h-px bg-[#232f3e]" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
              aria-label="Sign in with Google"
            >
              <GoogleLogo />
            </button>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
              aria-label="Sign in with Facebook"
            >
              <FacebookLogo />
            </button>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
              aria-label="Sign in with LinkedIn"
            >
              <LinkedInLogo />
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-[#232f3e] pt-4 mt-5 text-center">
            <p className="text-xs text-gray-400">
              New to Aritii?{' '}
              <button
                type="button"
                onClick={() => onContactUs?.(role)}
                className="text-[#febd69] hover:text-[#f3a847] font-semibold hover:underline"
              >
                Create your account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UnifiedLoginModal;

function GoogleLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 10h-2.5v8h-2v-8H9v-2h2V9c0-1.66 1-2.5 2.7-2.5h1.8v1.8h-1c-.52 0-.7.22-.7.7v1.2h2l-.5 2z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#0A66C2" />
      <path fill="white" d="M9 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 14H7V9h2v13zm8-13c-1.657 0-2 1.343-2 3v1h-2v2h2v8h2v-8c0-2 1-3 2-3h1v-2h-1z" />
    </svg>
  );
}
