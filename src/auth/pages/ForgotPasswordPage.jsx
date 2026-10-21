import React from 'react';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * ForgotPasswordPage — placeholder page.
 *
 * The customer-portal login drives password resets through the shared
 * identity service (POST /user/update-user-password). This lightweight route
 * keeps the "Forgot password?" link navigable while the credential flow is
 * wired to the backend.
 */
const ForgotPasswordPage = () => {
  const { openLoginModal } = useLayout();

  return (
    <main className="flex min-h-screen items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 px-6 py-8 text-center text-white/80">
        <h1 className="text-xl font-bold text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-white/60">
          Reset links are sent through the shared identity service. Check your email.
        </p>
        <button
          type="button"
          onClick={() => openLoginModal('BUYER')}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
        >
          Back to login
        </button>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
