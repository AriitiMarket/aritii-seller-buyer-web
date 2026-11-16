import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '@/services/auth.service';
import BrandLogo from '@/shared/components/BrandLogo';
import { MdLock, MdCheckCircle, MdWarning, MdArrowForward } from 'react-icons/md';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [tokenError, setTokenError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setIsValid(false);
      setTokenError('Password reset token is missing from the link.');
      return;
    }

    const checkToken = async () => {
      try {
        const res = await authService.verifyResetToken(token);
        if (res.valid) {
          setIsValid(true);
          if (res.email) setMaskedEmail(res.email);
        } else {
          setIsValid(false);
          setTokenError(res.message || 'This password reset link is invalid or has expired.');
        }
      } catch (err) {
        setIsValid(false);
        setTokenError(
          err.response?.data?.message || err.message || 'This password reset link is invalid or has expired.'
        );
      } finally {
        setVerifying(false);
      }
    };

    void checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#141414] px-4 py-8 sm:px-6">
      <div className="w-full max-w-[440px] max-h-[88dvh] flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414] shadow-2xl overflow-hidden my-auto mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 text-center border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-[#181818]/80">
          <div className="flex justify-center mb-2.5">
            <BrandLogo size="md" showText showTagline={false} tone="auto" linked={false} />
          </div>
          <span className="inline-block mb-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-[#75d04b]/15 text-[#58a735] dark:text-[#75d04b] border-[#75d04b]/30">
            SECURITY &amp; ACCESS
          </span>
          <h1 id="reset-title" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isSuccess ? 'Password Reset Complete' : 'Create New Password'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isSuccess
              ? 'Your password has been successfully updated'
              : maskedEmail
                ? `Setting new password for ${maskedEmail}`
                : 'Enter your new account password below'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {verifying ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-3 border-[#75d04b] border-t-transparent" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Verifying reset token...</p>
            </div>
          ) : !isValid ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/30">
                <MdWarning size={30} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invalid or Expired Link</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{tokenError}</p>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full rounded-full bg-[#75d04b] px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-[#66bb3f] shadow-md focus:outline-none focus:ring-2 focus:ring-[#75d04b]/50"
                >
                  Request New Reset Link
                </button>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="w-full text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-1.5 transition"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#75d04b]/15 text-[#75d04b] border border-[#75d04b]/30">
                <MdCheckCircle size={32} />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                Your password has been successfully updated. All active sessions have been signed out for security.
              </p>
              <button
                type="button"
                onClick={handleLoginClick}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-[#75d04b] px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-[#66bb3f] shadow-md focus:outline-none focus:ring-2 focus:ring-[#75d04b]/50"
              >
                <span>Sign In with New Password</span>
                <MdArrowForward size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500 dark:text-red-400"
                >
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="reset-new-password"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-1.5"
                >
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <MdLock size={18} />
                  </span>
                  <input
                    id="reset-new-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    disabled={submitting}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 focus:outline-none transition text-sm disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-1.5"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <MdLock size={18} />
                  </span>
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    disabled={submitting}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 focus:outline-none transition text-sm disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-[#75d04b] px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-[#66bb3f] active:bg-[#58a735] disabled:opacity-50 shadow-md focus:outline-none focus:ring-2 focus:ring-[#75d04b]/50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Updating Password...</span>
                  </span>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 px-6 py-3.5 bg-gray-50/80 dark:bg-[#181818]/80 text-center">
          <button
            type="button"
            onClick={handleLoginClick}
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#75d04b] transition focus:outline-none"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
