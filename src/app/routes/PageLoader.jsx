/**
 * Shared route-level loading fallback.
 *
 * Used by the router's <Suspense> boundary while a domain chunk is being fetched
 * (every domain page is lazy-loaded / code-split).
 */
import React from 'react';
import Loading from '@/components/common/Loading';

const PageLoader = () => <Loading />;

export default PageLoader;