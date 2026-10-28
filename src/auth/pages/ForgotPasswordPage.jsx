import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '@/services/auth.service';
import BrandLogo from '@/shared/components/BrandLogo';
import { MdEmail, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { getSafeRedirect } from '@/auth/utils/redirect';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(cleanEmail);
      setSubmitted(true);
    } catch {
      // Anti-enumeration: still display submitted state without revealing account existence
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { state: { from: getSafeRedirect(from, null) } });
  };

  const handleBackToPrevious = () => {
    const safeFrom = getSafeRedirect(from, null);
    if (safeFrom) {
      navigate(safeFrom, { replace: true });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#131921] px-4 py-8 sm:px-6">
      <div className="w-full max-w-[440px] max-h-[88dvh] flex flex-col rounded-2xl border border-gray-700/70 bg-[#1a222d] shadow-2xl overflow-hidden my-auto mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 text-center border-b border-[#232f3e] bg-[#161d26]/80 relative">
          <button
            type="button"
            onClick={handleBackToPrevious}
            className="absolute top-3.5 left-3.5 z-10 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600/70 flex items-center justify-center text-gray-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Back to previous page"
            title="Back"
          >
            <MdArrowBack size={18} />
          </button>

          <div className="flex justify-center mb-2.5">
            <BrandLogo size="md" showText showTagline={false} tone="light" linked={false} />
          </div>
          <span className="inline-block mb-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-amber-500/15 text-amber-400 border-amber-500/30">
            ACCOUNT RECOVERY
          </span>
          <h1 id="recovery-title" className="text-xl font-bold text-white tracking-tight">
            {submitted ? 'Check Your Email' : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {submitted
              ? 'We have sent password recovery instructions'
              : 'Enter your registered email to receive a secure reset link'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {submitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <MdCheckCircle size={32} />
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                If an account exists for <span className="font-semibold text-amber-400">{email}</span>, we have sent a secure link to reset your password.
              </p>
              <div className="bg-[#131921] border border-gray-700/60 rounded-lg p-3 text-xs text-gray-400 text-left space-y-1">
                <p className="font-semibold text-gray-300">• Link expires in 15 minutes</p>
                <p>• If you don&apos;t see the email, check your spam or junk folder</p>
                <p>• For security reasons, we do not reveal whether this email is registered</p>
              </div>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-amber-300 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <MdArrowBack size={18} />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-start gap-2"
                >
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1.5"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <MdEmail size={18} />
                  </span>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#131921] border border-[#37475a] rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-amber-300 active:bg-amber-500 disabled:opacity-50 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Sending Reset Link...</span>
                  </span>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#232f3e] px-6 py-3.5 bg-[#161d26]/80 text-center">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-amber-400 transition focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
          >
            <MdArrowBack size={14} />
            <span>Remembered your password? Sign In</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
