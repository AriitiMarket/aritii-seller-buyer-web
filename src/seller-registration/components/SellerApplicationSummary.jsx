const Row = ({ label, value }) => (
  <div><dt className="text-gray-500">{label}</dt><dd className="font-medium">{value || '—'}</dd></div>
);

export default function SellerApplicationSummary({ application }) {
  const business = application.businessInformation || {};
  const location = application.location || {};
  const shop = application.shopInformation || {};
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      <Row label="Seller type" value={application.sellerType} />
      <Row label="Business name" value={business.businessName} />
      <Row label="Business category" value={business.businessCategory} />
      <Row label="Business phone" value={business.phone} />
      <Row label="Business email" value={business.email} />
      <Row label="City" value={location.cityName || location.city} />
      <Row label="Region" value={location.regionName || location.region} />
      <Row label="Address" value={location.address || location.specificPlace} />
      <Row label="Shop name" value={shop.shopName} />
      <Row label="Shop category" value={shop.category} />
      <Row label="Public phone" value={shop.publicPhone} />
      <Row label="Public email" value={shop.publicEmail} />
    </dl>
  );
}
