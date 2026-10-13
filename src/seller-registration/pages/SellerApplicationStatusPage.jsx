import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerStatusBadge from '@/seller-registration/components/SellerStatusBadge';
import SellerApplicationSummary from '@/seller-registration/components/SellerApplicationSummary';
import useSellerRegistration from '@/seller-registration/hooks/useSellerRegistration';
import sellerRegistrationApi from '@/seller-registration/api/sellerRegistrationApi';
import shopService from '@/services/shop.service';
import { useRoleAccess } from '@/hooks/useRoleAccess';

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
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Seller Application</h1>
          <SellerStatusBadge status={application.status || 'DRAFT'} />
        </div>
        
        {/* Role Access Status */}
        {showRoleStatus && (
          <div className={`mt-4 rounded-lg border p-4 ${
            roleAccess.status === 'PENDING' ? 'border-blue-200 bg-blue-50' :
            roleAccess.status === 'REJECTED' ? 'border-red-200 bg-red-50' :
            roleAccess.status === 'SUSPENDED' ? 'border-yellow-200 bg-yellow-50' :
            'border-gray-200 bg-gray-50'
          }`}>
            <p className="text-sm">
              <strong>Account Status:</strong> {roleAccess.message}
            </p>
          </div>
        )}

        <p className="mt-4 text-gray-600">
          {application.status === 'PENDING_REVIEW' && 'Pending Approval — your seller application is under review.'}
          {application.status === 'MORE_INFORMATION_REQUIRED' && 'Additional information is required before review can continue.'}
          {application.status === 'REJECTED' && 'Your application was rejected. You may update and resubmit it.'}
          {application.status === 'APPROVED' && 'Your seller application has been approved.'}
          {application.status === 'SUSPENDED' && 'Your seller application is suspended.'}
          {(!application.status) && 'You have not started your seller application yet. Continue to set up your store.'}
          {application.status === 'DRAFT' && 'Your seller application is not complete yet. Continue where you left off.'}
        </p>
        {reason && <div className="mt-6 rounded border border-orange-200 bg-orange-50 p-4"><strong>Review message:</strong> {reason}</div>}

        {staleDraft && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              <strong>You already have a store.</strong> This draft was started before your{' '}
              {storeCount === 1 ? 'shop' : `${storeCount} shops`} were approved, so it is no longer needed. Discard it to
              clear it from review.
            </p>
            {discardError && <p className="mt-2 text-sm text-red-600">{discardError}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={discardDraft}
                disabled={discarding}
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {discarding ? 'Discarding…' : 'Discard draft'}
              </button>
              <Link
                to="/business/shops"
                className="rounded border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-white"
              >
                Go to my shops
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8"><SellerApplicationSummary application={application} /></div>
        {canContinue && !staleDraft && (
          <Link to="/seller-registration" className="mt-8 inline-flex rounded bg-[#75d04b] px-5 py-2 text-white">
            {needsResubmit ? 'Update and Resubmit' : 'Continue Registration'}
          </Link>
        )}
        
        {/* If role is approved but application not synced, provide link to dashboard */}
        {roleAccess.allowed && application.status !== 'APPROVED' && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-900">
              <strong>Your seller role is active!</strong> You can access the seller dashboard even if this application status hasn't updated yet.
            </p>
            <Link
              to="/business"
              className="mt-3 inline-flex rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Go to Seller Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
