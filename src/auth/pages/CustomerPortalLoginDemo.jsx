import React, { useState } from 'react';
import CustomerPortalLoginModal from '@/auth/components/CustomerPortalLoginModal';

/**
 * CustomerPortalLoginDemo — visual demo only.
 * Wraps the portal login modal in a local open/close state so it can be
 * previewed and smoke-tested without a parent route guard.
 *
 * NOTE: This is a DEV/SANDBOX route. It is intentionally not wired into the
 * real auth flow (which is role-specific: buyer / seller / delivery).
 */
const CustomerPortalLoginDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <button
          type="button"
          className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          onClick={() => setOpen(true)}
        >
          Open Customer Portal login
        </button>
      </main>

      <CustomerPortalLoginModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CustomerPortalLoginDemo;
