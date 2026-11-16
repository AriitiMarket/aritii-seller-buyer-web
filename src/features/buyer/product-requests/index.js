/**
 * Product Requests feature module.
 *
 * One extensible home for the request domain: shared constants first, then
 * presentational components reused by the buyer pages
 * (`src/buyer/pages/Requests/*`) and the seller page
 * (`src/business/pages/Requests/Requests.jsx`).
 *
 * Pages own their data fetching and actions; everything here is UI/domain
 * vocabulary only, so new capabilities (templates, saved sellers, expiry,
 * notifications, analytics, disputes…) can be added as new files here
 * without touching the existing surfaces.
 */
export * from './constants';

export { default as RequestTabs } from './components/RequestTabs';
export { default as RequestStatusBadge } from './components/RequestStatusBadge';
export { default as SellerCard } from './components/SellerCard';
export { default as ParticipantCard } from './components/ParticipantCard';
export { default as DiscussionThread } from './components/DiscussionThread';
export { default as ImageLightbox } from './components/ImageLightbox';
export { default as AttachmentGallery } from './components/AttachmentGallery';

export { default as useRequestEvents } from './hooks/useRequestEvents';
export { default as OfferCard } from './components/OfferCard';
export { default as ActivityTimeline } from './components/ActivityTimeline';
export { default as RequestSummary } from './components/RequestSummary';
