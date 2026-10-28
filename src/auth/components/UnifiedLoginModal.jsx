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
  onVerify2FA,
  onForgot,
  onContactUs,
  error,
  role = 'BUYER',
  isPage = false,
}) => {
  const dialogRef = useRef(null);
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
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

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
    if (!open || isPage) return;

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
  }, [open, onClose, isPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (twoFA.method === 'TOTP' || resendCountdown > 0) return;
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
      className="relative w-full max-w-[380px] rounded-2xl border border-[#232f3e] bg-[#1a222d] shadow-2xl overflow-hidden my-auto"
      style={{ boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(249, 115, 22, 0.1)' }}
    >
      {/* Close / Return Button */}
      <button
        type="button"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 border border-slate-600/60 flex items-center justify-center text-gray-300 hover:text-white transition"
        aria-label={isPage ? 'Back to Home' : 'Close'}
        title={isPage ? 'Back to Home' : 'Close'}
        onClick={onClose}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Top Header with brand mark */}
      <div className="px-5 pt-5 pb-3 text-center border-b border-[#232f3e]">
        <div className="flex items-center justify-center mb-2">
          <BrandLogo size="sm" showText showTagline tone="light" />
        </div>
        <span className="inline-block mb-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
          {twoFA.required ? 'SECURITY VERIFICATION' : config.badge}
        </span>
        <h1 id="login-title" className="text-xl font-bold text-white tracking-tight">
          {twoFA.required ? 'Two-Factor Authentication' : 'Sign in'}
        </h1>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {twoFA.required ? 'Verify your identity to complete login' : 'Welcome back! Sign in to continue'}
        </p>
      </div>

      {/* Form Content */}
      <div className="px-5 py-4 sm:px-6">
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
          <>
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {/* Email Field */}
              <div>
                <label className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-1 block">
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
                  className="w-full px-3 py-2 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:outline-none transition text-sm disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onForgot}
                    className="text-[11px] font-medium text-[#febd69] hover:text-[#f3a847] hover:underline transition"
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
                    className="w-full px-3 py-2 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:outline-none transition text-sm disabled:opacity-50 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-600 bg-[#131921] text-[#e77600] focus:ring-[#e77600]"
                  />
                  <span className="text-[11px] text-gray-300">Keep me signed in</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-2.5 text-xs text-[#fca5a5] flex items-center gap-2">
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
                className="w-full mt-2.5 py-2 px-3 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e77600] text-[#131921] font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="py-2.5 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#232f3e]" />
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">or sign in with</span>
              <div className="flex-1 h-px bg-[#232f3e]" />
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
                aria-label="Sign in with Google"
              >
                <GoogleLogo />
              </button>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
                aria-label="Sign in with Facebook"
              >
                <FacebookLogo />
              </button>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-[#131921] border border-[#37475a] hover:border-gray-400 flex items-center justify-center transition"
                aria-label="Sign in with LinkedIn"
              >
                <LinkedInLogo />
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-[#232f3e] pt-2.5 mt-3 text-center space-y-1">
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
              {isPage && (
                <div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-gray-400 hover:text-[#febd69] hover:underline transition inline-flex items-center gap-1 font-medium"
                  >
                    <span>&larr;</span> Back to Home
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (isPage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#131921] px-4 py-6 sm:px-6">
        {modalCard}
      </div>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131921]/80 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
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
  const getPrompt = () => {
    if (useBackupCode) return 'Enter one of your 8-character backup codes.';
    if (twoFA.method === 'TOTP') return 'Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.).';
    if (twoFA.method === 'EMAIL') return 'Enter the 6-digit verification code sent to your email.';
    return 'Enter the 6-digit verification code sent to your phone.';
  };

  return (
    <form onSubmit={handleVerify2FASubmit} className="space-y-3" noValidate>
      <div className="text-center pb-0.5">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 mb-1.5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-xs text-gray-300">{getPrompt()}</p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-1 block">
          {useBackupCode ? 'Backup Code' : '6-Digit Verification Code'}
        </label>
        <input
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
          autoFocus
          className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:outline-none transition disabled:opacity-50"
        />
      </div>

      {(twoFAError || error) && (
        <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-2.5 text-xs text-[#fca5a5] flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>{twoFAError || error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || (!useBackupCode && twoFACode.length !== 6) || (useBackupCode && !twoFACode.trim())}
        className="w-full mt-2 py-2 px-3 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e77600] text-[#131921] font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-sm"
      >
        {submitting ? 'Verifying...' : 'Verify Code'}
      </button>

      {twoFA.method !== 'TOTP' && !useBackupCode && (
        <button
          type="button"
          disabled={submitting || resendCountdown > 0}
          onClick={handleResend}
          className="w-full py-1 text-xs text-[#febd69] hover:text-[#f3a847] transition disabled:opacity-50"
        >
          {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
        </button>
      )}

      <div className="pt-2 flex flex-col gap-1.5 text-center text-xs border-t border-[#232f3e] mt-2.5">
        <button
          type="button"
          onClick={() => {
            setUseBackupCode(!useBackupCode);
            setTwoFACode('');
          }}
          className="text-gray-400 hover:text-[#febd69] transition underline"
        >
          {useBackupCode ? 'Use 6-digit code instead' : 'Lost access to device? Use a backup code'}
        </button>
        <button
          type="button"
          onClick={resetTwoFA}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
}

export default UnifiedLoginModal;

function GoogleLogo() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 10h-2.5v8h-2v-8H9v-2h2V9c0-1.66 1-2.5 2.7-2.5h1.8v1.8h-1c-.52 0-.7.22-.7.7v1.2h2l-.5 2z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#0A66C2" />
      <path fill="white" d="M9 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm0 14H7V9h2v13zm8-13c-1.657 0-2 1.343-2 3v1h-2v2h2v8h2v-8c0-2 1-3 2-3h1v-2h-1z" />
    </svg>
  );
}
