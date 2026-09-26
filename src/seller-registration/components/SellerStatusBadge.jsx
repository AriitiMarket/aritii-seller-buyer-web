const colors = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
  MORE_INFORMATION_REQUIRED: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SUSPENDED: 'bg-red-100 text-red-700',
};

export default function SellerStatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${colors[status] || colors.DRAFT}`}>{status?.replaceAll('_', ' ') || 'DRAFT'}</span>;
}
