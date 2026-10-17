/**
 * Format utilities for marketplace.
 * Provides currency formatting and date formatting functions.
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 ETB';
  return `${Number(amount).toLocaleString()} ETB`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';
  return Number(number).toLocaleString();
};