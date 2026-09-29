import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGO } from '@/assets';

const RoleStatusPage = ({ role, status, message }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          title: `${role} Application Pending`,
          description: message || `Your ${role.toLowerCase()} application has been submitted and is currently being reviewed. You will receive access to the ${role} Portal after approval.`,
          icon: '⏳',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          actionText: 'Check Application Status',
          actionPath: role === 'SELLER' ? '/seller-registration' : '/provider-application',
        };
      case 'REJECTED':
        return {
          title: `${role} Application Not Approved`,
          description: message || `Your ${role.toLowerCase()} application was not approved. Please review the reason and resubmit if available.`,
          icon: '❌',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          actionText: 'Review Application',
          actionPath: role === 'SELLER' ? '/seller-registration' : '/provider-application',
        };
      case 'SUSPENDED':
        return {
          title: `${role} Access Suspended`,
          description: message || `Your ${role.toLowerCase()} access is currently suspended. Please contact platform support.`,
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          actionText: 'Contact Support',
          actionPath: '/support',
        };
      case 'NOT_APPLIED':
        return {
          title: `No ${role} Application`,
          description: message || `You do not have ${role.toLowerCase()} access. Submit a ${role.toLowerCase()} application to continue.`,
          icon: '📝',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          actionText: `Apply as ${role}`,
          actionPath: role === 'SELLER' ? '/seller-registration' : '/provider-application',
        };
      default:
        return {
          title: 'Access Status Unknown',
          description: message || 'Your access status could not be determined. Please contact support.',
          icon: '❓',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          actionText: 'Contact Support',
          actionPath: '/support',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={LOGO}
            alt="Aritii Market"
            className="h-12 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h1>
        </div>

        {/* Status Card */}
        <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-8`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{config.icon}</div>
            <p className={`${config.textColor} text-lg mb-6`}>
              {config.description}
            </p>
            
            {/* Action Button */}
            <button
              onClick={() => navigate(config.actionPath)}
              className="w-full bg-[#75d04b] hover:brightness-95 text-white font-semibold rounded-full py-3 transition-all duration-200 mb-4"
            >
              {config.actionText}
            </button>

            {/* Return to Buyer Dashboard */}
            <button
              onClick={() => navigate('/my-dashboard')}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full py-3 transition-all duration-200"
            >
              Return to Buyer Dashboard
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Account: {user?.email}</p>
          <p className="mt-1">
            Need help? <button onClick={() => navigate('/support')} className="text-[#75d04b] hover:underline">Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleStatusPage;