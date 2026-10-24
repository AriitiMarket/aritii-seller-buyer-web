import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/app/providers/LayoutContext';
import authService from '@/services/auth.service';
import BrandLogo from '@/shared/components/BrandLogo';
import { MdEmail, MdArrowBack, MdCheckCircle } from 'react-icons/md';

const ForgotPasswordPage = () => {
  const { openLoginModal } = useLayout();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
    } catch {
      // Anti-enumeration: still display submitted state
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
    openLoginModal('BUYER');
  };

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1f2c] border border-gray-800 p-8 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <BrandLogo size="lg" />
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <MdCheckCircle size={32} />
            </div>
            <h1 className="text-xl font-bold text-white">Check Your Email</h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              If an account is associated with <span className="font-semibold text-white">{email}</span>, we have sent instructions to reset your password.
            </p>
            <p className="text-xs text-gray-500">
              The link expires in 15 minutes. Check your spam or junk folder if you don't receive it shortly.
            </p>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300 shadow-md"
            >
              <MdArrowBack size={18} />
              <span>Back to Login</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
              <p className="mt-2 text-sm text-gray-400">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MdEmail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#131921] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Sending Link...</span>
                  </span>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-amber-400 transition"
                >
                  <MdArrowBack size={14} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
