export function validateSellerApplication(application) {
  const business = application.businessInformation || {};
  const location = application.location || {};
  const shop = application.shopInformation || {};
  const errors = {};

  if (!application.sellerType) errors.sellerType = 'Select a seller type.';
  if (!business.businessName?.trim()) errors.businessName = 'Business name is required.';
  if (!business.businessCategory?.trim()) errors.businessCategory = 'Business category is required.';
  if (!location.city && !location.cityName && !location.cityId) {
    errors.city = 'Operating city or subcity is required for delivery fulfillment.';
  }
  if (!location.address?.trim() && !location.specificPlace?.trim()) {
    errors.address = 'Store or warehouse pickup address is required so delivery couriers know where to collect orders.';
  }
  if (!shop.shopName?.trim()) errors.shopName = 'Shop name is required.';

  return errors;
}
