import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BrandLogo from '@/shared/components/BrandLogo';

/**
 * UnifiedLoginModal — standard authentication modal for Ariiti Market.
 *
 * Sizing:
 *  - Desktop & Tablet: Centered modal, max width ~440px, max height ~88dvh.
 *  - Mobile: Responsive width with side margins, max-h-[90dvh], independent scroll.
 *
 * Structure:
 *  1. Header: Ariiti Market brand mark, page title, close button.
 *  2. Content: Form fields, validation messages, password recovery, submit button.
 *  3. Footer: Relevant account navigation ("Create your account", "Back").
 */
const UnifiedLoginModal = ({
  open,
  onClose,
  onLogin,
  onVerify2FA,
  onForgot,
  onContactUs,
  error,
  role = 'BUYER',
  isPage = false,
}) => {
  const dialogRef = useRef(null);
  const emailInputRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [twoFA, setTwoFA] = useState({ required: false, method: 'TOTP', tempToken: '' });
  const [twoFACode, setTwoFACode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [twoFAError, setTwoFAError] = useState('');

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const ROLE_CONFIG = {
    BUYER: {
      label: 'Shopper',
      badge: 'SHOPPER ACCESS',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      next: '/my-dashboard',
    },
    SELLER: {
      label: 'Seller',
      badge: 'SELLER CENTRAL',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      next: '/seller-registration',
    },
    PROVIDER: {
      label: 'Delivery Provider',
      badge: 'DELIVERY NETWORK',
      badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      next: '/provider-application',
    },
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!open || isPage) return;

    previouslyFocusedRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus first input after mounting
    const focusTimer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, onClose, isPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setTwoFAError('');
    try {
      const res = await onLogin?.({ email: email.trim(), password });
      if (res?.requires2fa) {
        setTwoFA({
          required: true,
          method: res.method || 'TOTP',
          tempToken: res.tempToken,
        });
        setTwoFACode('');
        setUseBackupCode(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify2FASubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!twoFACode.trim()) {
      setTwoFAError('Please enter verification code');
      return;
    }
    setSubmitting(true);
    setTwoFAError('');
    try {
      await onVerify2FA?.({
        code: useBackupCode ? undefined : twoFACode.trim(),
        backupCode: useBackupCode ? twoFACode.trim() : undefined,
        tempToken: twoFA.tempToken,
      });
    } catch (err) {
      setTwoFAError(err.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (twoFA.method === 'TOTP' || resendCountdown > 0 || submitting) return;
    setSubmitting(true);
    try {
      const { authService } = await import('@/services');
      await authService.resend2FACode({ tempToken: twoFA.tempToken, method: twoFA.method });
      setResendCountdown(60);
    } catch (err) {
      setTwoFAError(err?.message || 'Failed to resend code');
    } finally {
      setSubmitting(false);
    }
  };

  const resetTwoFA = () => {
    setTwoFA({ required: false, method: 'TOTP', tempToken: '' });
    setTwoFACode('');
    setTwoFAError('');
  };

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.BUYER;

  if (!isPage && !open) return null;

  const modalCard = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="relative w-full max-w-[440px] max-h-[88dvh] flex flex-col rounded-2xl border border-gray-700/70 bg-[#1a222d] shadow-2xl overflow-hidden my-auto mx-auto"
      style={{
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.08)',
      }}
    >
      {/* Accessible Close / Dismiss Button */}
      <button
        type="button"
        className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600/70 flex items-center justify-center text-gray-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label={isPage ? 'Back to previous page' : 'Close modal'}
        title={isPage ? 'Back' : 'Close'}
        onClick={onClose}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Area 1: Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 text-center border-b border-[#232f3e] bg-[#161d26]/80">
        <div className="flex items-center justify-center mb-2.5">
          <BrandLogo size="md" showText showTagline={false} tone="light" linked={false} />
        </div>
        <span
          className={`inline-block mb-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            twoFA.required ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : config.badgeClass
          }`}
        >
          {twoFA.required ? 'SECURITY VERIFICATION' : config.badge}
        </span>
        <h1 id="login-title" className="text-xl font-bold text-white tracking-tight">
          {twoFA.required ? 'Two-Factor Authentication' : 'Sign in to Ariiti Market'}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {twoFA.required ? 'Verify your identity to complete sign-in' : 'Welcome back! Sign in to continue'}
        </p>
      </div>

      {/* Area 2: Content (scrollable internally if height is constrained) */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
        {twoFA.required ? (
          <TwoFAFormView
            twoFA={twoFA}
            twoFACode={twoFACode}
            setTwoFACode={setTwoFACode}
            useBackupCode={useBackupCode}
            setUseBackupCode={setUseBackupCode}
            resendCountdown={resendCountdown}
            handleResend={handleResend}
            handleVerify2FASubmit={handleVerify2FASubmit}
            resetTwoFA={resetTwoFA}
            submitting={submitting}
            twoFAError={twoFAError}
            error={error}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5 block">
                Email or mobile phone number
              </label>
              <input
                ref={emailInputRef}
                autoComplete="email"
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition text-sm disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-gray-200 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgot}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  id="login-password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition text-sm disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 focus:outline-none focus:text-white"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {visible ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 flex items-start gap-2.5"
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-gray-950 font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Area 3: Footer */}
      <div className="flex-shrink-0 border-t border-[#232f3e] px-6 py-3.5 bg-[#161d26]/80 text-center space-y-1.5">
        <p className="text-xs text-gray-300">
          New to Ariiti Market?{' '}
          <button
            type="button"
            onClick={() => onContactUs?.(role)}
            className="text-amber-400 hover:text-amber-300 font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
          >
            Create your account
          </button>
        </p>
        {isPage && (
          <div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-amber-400 hover:underline transition inline-flex items-center gap-1 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
            >
              <span aria-hidden="true">&larr;</span> Back to previous page
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isPage) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#131921] px-4 py-8 sm:px-6">
        {modalCard}
      </main>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {modalCard}
    </div>,
    document.body
  );
};

function TwoFAFormView({
  twoFA,
  twoFACode,
  setTwoFACode,
  useBackupCode,
  setUseBackupCode,
  resendCountdown,
  handleResend,
  handleVerify2FASubmit,
  resetTwoFA,
  submitting,
  twoFAError,
  error,
}) {
  const codeInputRef = useRef(null);

  useEffect(() => {
    codeInputRef.current?.focus();
  }, [useBackupCode]);

  const getPrompt = () => {
    if (useBackupCode) return 'Enter one of your 8-character backup codes.';
    if (twoFA.method === 'TOTP') return 'Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.).';
    if (twoFA.method === 'EMAIL') return 'Enter the 6-digit verification code sent to your email.';
    return 'Enter the 6-digit verification code sent to your phone.';
  };

  return (
    <form onSubmit={handleVerify2FASubmit} className="space-y-4" noValidate>
      <div className="text-center pb-1">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-500/20 text-amber-400 mb-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{getPrompt()}</p>
      </div>

      <div>
        <label htmlFor="twofa-code-input" className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5 block text-center">
          {useBackupCode ? 'Backup Code' : '6-Digit Verification Code'}
        </label>
        <input
          ref={codeInputRef}
          id="twofa-code-input"
          type="text"
          maxLength={useBackupCode ? 15 : 6}
          placeholder={useBackupCode ? 'XXXX-XXXX' : '000000'}
          value={twoFACode}
          onChange={(e) => {
            const val = useBackupCode
              ? e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
              : e.target.value.replace(/\D/g, '');
            setTwoFACode(val);
          }}
          disabled={submitting}
          className="w-full text-center tracking-widest text-xl font-mono px-3.5 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition disabled:opacity-50"
        />
      </div>

      {(twoFAError || error) && (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 flex items-start gap-2.5"
        >
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="leading-relaxed">{twoFAError || error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || (!useBackupCode && twoFACode.length !== 6) || (useBackupCode && !twoFACode.trim())}
        className="w-full mt-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-gray-950 font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" aria-hidden="true" />
            <span>Verifying...</span>
          </>
        ) : (
          <span>Verify Code</span>
        )}
      </button>

      {twoFA.method !== 'TOTP' && !useBackupCode && (
        <button
          type="button"
          disabled={submitting || resendCountdown > 0}
          onClick={handleResend}
          className="w-full py-1 text-xs text-amber-400 hover:text-amber-300 transition disabled:opacity-50"
        >
          {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
        </button>
      )}

      <div className="pt-2 flex flex-col gap-2 text-center text-xs border-t border-[#232f3e] mt-3">
        <button
          type="button"
          onClick={() => {
            setUseBackupCode(!useBackupCode);
            setTwoFACode('');
          }}
          className="text-gray-400 hover:text-amber-400 transition underline focus:outline-none"
        >
          {useBackupCode ? 'Use 6-digit code instead' : 'Lost access to device? Use a backup code'}
        </button>
        <button
          type="button"
          onClick={resetTwoFA}
          className="text-gray-400 hover:text-white transition focus:outline-none"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
}

export default UnifiedLoginModal;
