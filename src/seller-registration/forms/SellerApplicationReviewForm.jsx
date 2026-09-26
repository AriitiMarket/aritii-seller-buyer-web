import SellerApplicationSummary from '@/seller-registration/components/SellerApplicationSummary';

export default function SellerApplicationReviewForm({ application }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Review your application</h2>
      <SellerApplicationSummary application={application} />
      <p className="mt-6 text-sm text-gray-500">Confirm that the information is accurate before submitting it for administrator review.</p>
    </div>
  );
}
