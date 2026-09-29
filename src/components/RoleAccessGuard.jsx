import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import RoleStatusPage from './RoleStatusPage';

/**
 * Role Access Guard Component
 * 
 * Checks if a user has access to a specific role portal before rendering children.
 * Shows appropriate status pages based on role membership status:
 * - PENDING: Shows pending approval message
 * - REJECTED: Shows rejection message with resubmit option
 * - NOT_APPLIED: Shows application not submitted message
 * - SUSPENDED: Shows suspension message
 * - ACTIVE: Allows access to the protected content
 * 
 * @param {string} requiredRole - The role required for access (SELLER, PROVIDER, etc.)
 * @param {React.ReactNode} children - The protected content to render if access is granted
 * @param {string} fallbackPath - Optional path to redirect if access is denied (default: dashboard)
 */
const RoleAccessGuard = ({ requiredRole, children, fallbackPath = '/my-dashboard' }) => {
  const navigate = useNavigate();
  const { allowed, status, message, loading } = useRoleAccess(requiredRole);

  useEffect(() => {
    // If not loading and access is denied, we could redirect or show status page
    // For now, we'll show the status page inline
  }, [allowed, status, loading, navigate, fallbackPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#75d04b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return <RoleStatusPage role={requiredRole} status={status} message={message} />;
  }

  return <>{children}</>;
};

export default RoleAccessGuard;