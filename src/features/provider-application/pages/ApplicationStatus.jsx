import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { providerApplicationApi } from '@/features/provider-application/services/providerApplicationApi';
import { useRoleAccess } from '@/shared/hooks/useRoleAccess';

/**
 * ApplicationStatus - the real state of the signed-in user's application, read
 * from GET /provider-application/me.
 *
 * The backend keeps one Provider record per applicant, so the review states map
 * off its `status`:
 *   pending                        -> under review
 *   available / busy / offline     -> approved (a live provider)
 *   rejected                       -> not approved (the reason is stored on
 *                                     metadata.application.rejectionReason);
 *                                     a rejected applicant may re-apply
 *   suspended                      -> treated as not approved (legacy records
 *                                     rejected before `rejected` existed);
 *                                     suspended accounts must contact support
 *   no record                      -> never applied
 */
const APPROVED_STATUSES = ['available', 'busy', 'offline'];
const REJECTED_STATUSES = ['rejected', 'suspended'];

function resolveState(application) {
  if (!application) return 'none';
  const status = String(application.status || '').toLowerCase();
  if (status === 'pending') return 'pending';
  if (APPROVED_STATUSES.includes(status)) return 'approved';
  if (REJECTED_STATUSES.includes(status)) return 'rejected';
  return 'rejected';
}

const ApplicationStatus = () => {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  
  // Check role access status from Identity Service
  const roleAccess = useRoleAccess('PROVIDER');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setApplication(await providerApplicationApi.getMine());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your application status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading || roleAccess.loading) return <Loading />;

  const state = resolveState(application);
  const rejectionReason = application?.application?.rejectionReason;

  // Show role access status if different from application status
  const showRoleStatus = roleAccess.status && roleAccess.status !== 'ACTIVE' && roleAccess.status !== state;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          {/* Role Access Status */}
          {showRoleStatus && (
            <div className={`mb-6 rounded-lg border p-4 ${
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

          {state === 'none' && (
            <>
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Finish Your Application</h1>
              <p className="text-gray-600 mb-6">
                Your delivery provider application has not been submitted yet. Continue where you
                left off to finish — it only takes a few minutes.
              </p>
              <Link
                to="/provider-application"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
              >
                Start or Continue Application
              </Link>
            </>
          )}

          {state === 'pending' && (
            <>
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h1>
              <p className="text-gray-600 mb-6">
                Your application is being reviewed. We'll notify you once a decision has been made.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Expected response time: 2-3 business days
              </p>
              <Link
                to="/provider-application"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Update Application
              </Link>
            </>
          )}


          {state === 'approved' && (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Approved!</h1>
              <p className="text-gray-600 mb-6">
                Congratulations! Your application has been approved. You can now start accepting deliveries.
              </p>
              <Link
                to="/provider"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
              >
                Go to Provider Portal
              </Link>
            </>
          )}

          {state === 'rejected' && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Approved</h1>
              {rejectionReason && (
                <p className="text-sm text-gray-500 mb-3">Reason: {rejectionReason}</p>
              )}
              <p className="text-gray-600 mb-6">
                {application?.status === 'suspended'
                  ? 'Your provider account is suspended. Please contact support if you believe this is a mistake.'
                  : 'Unfortunately, your application was not approved at this time. You can update your details and apply again.'}
              </p>
              {application?.status !== 'suspended' && (
                <Link
                  to="/provider-application"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition mr-3"
                >
                  Re-apply
                </Link>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Return to Home
              </Link>
            </>
          )}

          {/* If role is approved but application not synced, provide link to dashboard */}
          {roleAccess.allowed && state !== 'approved' && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-900">
                <strong>Your provider role is active!</strong> You can access the provider portal even if this application status hasn't updated yet.
              </p>
              <Link
                to="/provider"
                className="mt-3 inline-flex rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Go to Provider Portal
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={load}
              className="text-sm text-[#75d04b] hover:underline"
            >
              Refresh status
            </button>
            <span className="mx-3 text-gray-300">|</span>
            <Link to="/" className="text-sm text-[#75d04b] hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
