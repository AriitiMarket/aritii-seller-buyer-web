import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm lg:p-0"
      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139, 69, 19, 0.1) 0%, rgba(0,0,0,0.5) 100%)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full max-w-6xl h-auto max-h-[90vh] relative">
        {/* Left Sidebar - Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-orange-600 to-orange-800 p-12 flex-col justify-between rounded-l-2xl">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <svg viewBox="0 0 64 64" className="h-12 w-auto" aria-hidden="true">
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="1" stopColor="#f0f0f0" />
                  </linearGradient>
                </defs>
                <path d="M32 6 L58 52 L6 52 Z" fill="#000" />
                <path d="M32 31 L58 52 L6 52 Z" fill="url(#brandGrad)" />
              </svg>
              <div>
                <p className="text-xl font-bold text-white">Aritii</p>
                <p className="text-sm text-orange-100">Market</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
            <p className="text-lg text-orange-50 leading-relaxed">Sign in to access your account, manage orders, and continue your journey with Aritii Market.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">Secure Login</p>
                <p className="text-sm text-orange-100">Fast and safe access to your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">Multi-Role Support</p>
                <p className="text-sm text-orange-100">One account for buyer, seller, or delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-white">24/7 Access</p>
                <p className="text-sm text-orange-100">Always connected to your marketplace</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div ref={dialogRef} className="relative w-full lg:w-3/5 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none border border-orange-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.15)' }}>
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-gray-300 hover:text-white transition"
            aria-label="Close"
            onClick={onClose}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center border-b border-orange-500/10">
            <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              {roleLabel}
            </span>
            <h1 id="login-title" className="text-3xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to access your account and manage your business.</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div>
                <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Email</label>
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
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Password</label>
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
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-orange-500" />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onForgot}
                  className="text-sm font-semibold text-gray-300 hover:text-orange-400 transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-200 flex items-center gap-2">
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
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-black font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
                {!submitting && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="px-0 py-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-gray-500 font-semibold uppercase">or continue with</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-3">
              <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign in with Google">
                <GoogleLogo />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign in with Facebook">
                <FacebookLogo />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 flex items-center justify-center transition" aria-label="Sign in with LinkedIn">
                <LinkedInLogo />
              </a>
            </div>

            {/* Footer */}
            <div className="border-t border-orange-500/10 pt-4 mt-6">
              <p className="text-sm text-gray-400 text-center">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onContactUs}
                  className="text-orange-400 hover:text-orange-300 font-semibold"
                >
                  Contact us
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-md rounded-2xl border border-orange-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.15)' }}>
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-gray-300 hover:text-white transition"
          aria-label="Close"
          onClick={onClose}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-orange-500/10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg viewBox="0 0 64 64" className="h-8 w-auto" aria-hidden="true">
              <defs>
                <linearGradient id="mobileGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <path d="M32 6 L58 52 L6 52 Z" fill="#0f1114" />
              <path d="M32 31 L58 52 L6 52 Z" fill="url(#mobileGrad)" />
            </svg>
            <span className="font-bold text-white">Aritii Market</span>
          </div>
          <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            {roleLabel}
          </span>
          <h1 id="login-title" className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={submitting}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none transition disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={onForgot}
                className="text-sm font-semibold text-gray-300 hover:text-orange-400"
              >
                Forgot?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-black font-bold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 pt-4 border-t border-orange-500/10">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onContactUs}
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Create one
            </button>
          </p>
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
