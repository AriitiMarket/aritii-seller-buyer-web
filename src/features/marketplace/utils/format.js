/**
 * Marketplace formatting helpers.
 *
 * These used to be a second, independent implementation of the shared
 * formatters in `@/shared/utils/format` — with a different date locale
 * (en-US vs en-GB) and a different currency suffix convention. One
 * implementation now owns money and date formatting for the whole app.
 */
export { formatCurrency, formatDate, formatDateTime, shortId, initials } from '@/shared/utils/format';
