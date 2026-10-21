import React from 'react';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * ContactPage — placeholder page.
 *
 * The customer portal login uses "Contact us" to reach the team behind the
 * shared account. This placeholder keeps the link navigable while the contact
 * and role-selection flows are finalised.
 */
const ContactPage = () => {
  const { openLoginModal } = useLayout();

  return (
    <main className="flex min-h-screen items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 px-6 py-8 text-center text-white/80">
        <h1 className="text-xl font-bold text-white">Contact us</h1>
        <p className="mt-2 text-sm text-white/60">
          For account, login or role questions, reach the support desk and a member
          of the team will respond with next steps.
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

export default ContactPage;
