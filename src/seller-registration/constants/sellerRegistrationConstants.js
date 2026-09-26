export const SELLER_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'BUSINESS', label: 'Business' },
];

export const APPLICATION_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  MORE_INFORMATION_REQUIRED: 'MORE_INFORMATION_REQUIRED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
};

export const EMPTY_APPLICATION = {
  sellerType: 'INDIVIDUAL',
  businessInformation: {},
  location: {},
  shopInformation: {},
};
