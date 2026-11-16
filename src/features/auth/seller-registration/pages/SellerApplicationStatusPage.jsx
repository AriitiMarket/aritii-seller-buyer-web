import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerStatusBadge from '@/features/auth/seller-registration/components/SellerStatusBadge';
import SellerApplicationSummary from '@/features/auth/seller-registration/components/SellerApplicationSummary';
import useSellerRegistration from '@/features/auth/seller-registration/hooks/useSellerRegistration';
import sellerRegistrationApi from '@/features/auth/seller-registration/api/sellerRegistrationApi';
import shopService from '@/services/shop.service';
import { useRoleAccess } from '@/shared/hooks/useRoleAccess';

export default function SellerApplicationStatusPage() {
  const { application, loading, error } = useSellerRegistration();
  const navigate = useNavigate();
  const [storeCount, setStoreCount] = useState(null);
  const [discarding, setDiscarding] = useState(false);
  const [discardError, setDiscardError] = useState('');
  
  // Check role access status from Identity Service
  const roleAccess = useRoleAccess('SELLER');

  // A seller who already operates shops (approved application, or shops
  // provisioned another way) is left with an abandoned DRAFT that shows up
  // forever in the admin Businesses list. Detect that case so the page offers
  // to clean it up instead of pushing "Continue Registration".
  useEffect(() => {
    let active = true;
    shopService
      .getByOwner()
      .then((shops) => {
        if (active) setStoreCount(Array.isArray(shops) ? shops.length : 0);
      })
      .catch(() => {
        if (active) setStoreCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading || roleAccess.loading) return <main className="mx-auto max-w-3xl p-8">Loading application...</main>;
  if (error) return <main className="mx-auto max-w-3xl p-8 text-red-600">{error}</main>;

  const reason = application.review?.informationRequestReason || application.review?.rejectionReason;
  // Which statuses the applicant can still act on. A MISSING status is the
  // "registered as a seller but never finished (or never even started) the
  // wizard" case — it must offer a way to CONTINUE, never a dead end, or the
  // account looks locked out of the very application it registered to submit.
  // The locked statuses mirror the wizard's own redirect (SellerRegistrationPage).
  const LOCKED_STATUSES = ['PENDING_REVIEW', 'APPROVED', 'SUSPENDED'];
  const canContinue = !LOCKED_STATUSES.includes(application.status);
  const needsResubmit = application.status === 'REJECTED' || application.status === 'MORE_INFORMATION_REQUIRED';
  const hasStores = storeCount !== null && storeCount > 0;
  const staleDraft = application.status === 'DRAFT' && hasStores;
  const isApproved = application.status === 'APPROVED' || roleAccess.allowed;
  const needsShop = isApproved && !hasStores;

  const discardDraft = async () => {
    setDiscarding(true);
    setDiscardError('');
    try {
      await sellerRegistrationApi.discardDraft();
      navigate('/business/shops', { replace: true });
    } catch (err) {
      setDiscardError(err.response?.data?.message || err.message || 'Could not discard the draft');
      setDiscarding(false);
    }
  };

  // Show role access status if different from application status
  const showRoleStatus = roleAccess.status && roleAccess.status !== 'ACTIVE' && roleAccess.status !== application.status;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-6 shadow-sm sm:p-10">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>
          <span className="text-xs text-gray-400">Aritii Seller Portal</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Seller Application</h1>
          <SellerStatusBadge status={application.status || 'DRAFT'} />
        </div>
        
        {/* Role Access Status */}
        {showRoleStatus && (
          <div className={`mt-4 rounded-lg border p-4 ${
            roleAccess.status === 'PENDING' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800' :
            roleAccess.status === 'REJECTED' ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
            roleAccess.status === 'SUSPENDED' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' :
            'border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800'
          }`}>
            <p className="text-sm">
              <strong>Account Status:</strong> {roleAccess.message}
            </p>
          </div>
        )}

        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {application.status === 'PENDING_REVIEW' && 'Pending Approval — your seller application is under review.'}
          {application.status === 'MORE_INFORMATION_REQUIRED' && 'Additional information is required before review can continue.'}
          {application.status === 'REJECTED' && 'Your application was rejected. You may update and resubmit it.'}
          {application.status === 'APPROVED' && 'Your seller application has been approved.'}
          {application.status === 'SUSPENDED' && 'Your seller application is suspended.'}
          {(!application.status) && 'You have not started your seller application yet. Continue to set up your store.'}
          {application.status === 'DRAFT' && 'Your seller application is not complete yet. Continue where you left off.'}
        </p>
        {reason && <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 p-4"><strong>Review message:</strong> {reason}</div>}

        {staleDraft && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>You already have a store.</strong> This draft was started before your{' '}
              {storeCount === 1 ? 'shop' : `${storeCount} shops`} were approved, so it is no longer needed. Discard it to
              clear it from review.
            </p>
            {discardError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{discardError}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={discardDraft}
                disabled={discarding}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {discarding ? 'Discarding…' : 'Discard draft'}
              </button>
              <Link
                to="/business/shops"
                className="rounded-full border border-blue-300 dark:border-blue-700 px-4 py-2 text-sm font-semibold text-blue-800 dark:text-blue-300 hover:bg-white dark:hover:bg-gray-800"
              >
                Go to my shops
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8"><SellerApplicationSummary application={application} /></div>

        {/* Action Buttons with Back to Home Button */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.99] transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>

          {canContinue && !staleDraft && (
            <Link
              to="/seller-registration"
              className="inline-flex items-center justify-center rounded-full bg-[#75d04b] px-6 py-2.5 text-sm font-bold text-gray-950 hover:bg-[#66bb3f] active:scale-[0.99] shadow-sm transition"
            >
              {needsResubmit ? 'Update and Resubmit' : 'Continue Registration'}
            </Link>
          )}

          {isApproved && (
            <Link
              to="/business"
              className="inline-flex items-center justify-center rounded-full bg-[#75d04b] hover:bg-[#66bb3f] text-gray-950 px-6 py-2.5 text-sm font-bold shadow-sm transition"
            >
              Seller Dashboard
            </Link>
          )}
        </div>
        
        {/* If role is approved but application not synced, provide link to dashboard */}
        {roleAccess.allowed && application.status !== 'APPROVED' && (
          <div className="mt-6 rounded-xl border border-[#75d04b]/30 bg-[#f3ffee] dark:bg-[#75d04b]/10 p-4">
            <p className="text-sm text-gray-900 dark:text-white">
              <strong>Your seller role is active!</strong> You can access the seller dashboard even if this application status hasn&apos;t updated yet.
            </p>
            <Link
              to="/business"
              className="mt-3 inline-flex rounded-full bg-[#75d04b] px-4 py-2 text-sm font-bold text-gray-950 hover:bg-[#66bb3f]"
            >
              Go to Seller Dashboard
            </Link>
          </div>
        )}

        {/* If approved but has no shops, show shop creation option */}
        {needsShop && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              <strong>Congratulations! Your seller application is approved.</strong> You can now create your first shop to start selling on Aritii Marketplace.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/business/shops"
                className="inline-flex rounded-full bg-[#75d04b] px-4 py-2 text-sm font-bold text-gray-950 hover:bg-[#66bb3f]"
              >
                Create Your Shop
              </Link>
              <Link
                to="/business"
                className="inline-flex rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
