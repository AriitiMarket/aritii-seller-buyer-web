import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLayout } from '@/app/providers/LayoutContext';
import authService from '@/services/auth.service';
import BrandLogo from '@/shared/components/BrandLogo';
import { MdLock, MdCheckCircle, MdWarning, MdArrowForward } from 'react-icons/md';

const ResetPasswordPage = () => {
  const { openLoginModal } = useLayout();
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
        setTokenError(err.response?.data?.message || err.message || 'This password reset link is invalid or has expired.');
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
      setFormError(err.response?.data?.message || err.message || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/');
    openLoginModal('BUYER');
  };

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1f2c] border border-gray-800 p-8 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <BrandLogo size="lg" />
        </div>

        {verifying ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-3 border-amber-400 border-t-transparent" />
            <p className="text-sm text-gray-300">Verifying reset token...</p>
          </div>
        ) : !isValid ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <MdWarning size={32} />
            </div>
            <h1 className="text-xl font-bold text-white">Invalid or Expired Link</h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              {tokenError}
            </p>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300 shadow-md"
              >
                Request New Reset Link
              </button>
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full text-xs font-semibold text-gray-400 hover:text-white py-2"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <MdCheckCircle size={32} />
            </div>
            <h1 className="text-xl font-bold text-white">Password Reset Complete</h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your password has been successfully updated. All previous sessions have been signed out for security.
            </p>
            <button
              type="button"
              onClick={handleLoginClick}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300 shadow-md"
            >
              <span>Sign In with New Password</span>
              <MdArrowForward size={18} />
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Create New Password</h1>
              {maskedEmail ? (
                <p className="mt-1 text-sm text-gray-400">
                  Setting new password for <span className="text-amber-400 font-semibold">{maskedEmail}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-400">
                  Enter your new account password below.
                </p>
              )}
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MdLock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#131921] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <MdLock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#131921] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-50 shadow-md"
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
          </div>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
