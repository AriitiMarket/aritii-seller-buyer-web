const colors = {
  DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  PENDING_REVIEW: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
  MORE_INFORMATION_REQUIRED: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30',
  APPROVED: 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#58a735] dark:text-[#75d04b] border border-[#75d04b]/30',
  REJECTED: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30',
  SUSPENDED: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30',
};

export default function SellerStatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${colors[status] || colors.DRAFT}`}>{status?.replaceAll('_', ' ') || 'DRAFT'}</span>;
}
